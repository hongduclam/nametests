(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncTree', lncTree);

    lncTree.$inject = ['$log', 'lncMediaService', 'lncModalService'];

    function lncTree($log, lncMediaService, lncModalService) {
        var NODE_TYPE = {
            default: 'default',
            file: 'file',
            folder: 'folder',
            share: 'share'
        };

        return {
            restrict: 'E',
            require: '?^^lncBrowser',
            replace: true,
            templateUrl: 'components/media/jstree/jstree.tpl.html',
            link: linkFunc
        };

        ////////////////
        function linkFunc(scope, element, attrs, ctrl) {
            var els = element.find('.jstree');
            var jstree;
            scope.perms = lncMediaService.getMediaPermission();
            scope.create = createNode;
            scope.edit = renameNode;
            scope.delete = removeNode;
            scope.refresh = refresh;
            scope.selectRoot = selectRoot;

            scope.$on('$destroy', destroy);
            els.jstree({
                'plugins': ['search', 'contextmenu', 'types'],
                'core': {
                    'data': function (node, cb) {
                        var promise;
                        if (isRootNode(node)) {
                            promise = lncMediaService.getRoot(lncMediaService.TYPE.FOLDER);
                        } else {
                            promise = lncMediaService.getTree(node.id, lncMediaService.TYPE.FOLDER);
                        }

                        promise.then(function (data) {
                            var folder = [];
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                var childNode = {
                                    'id': item.id,
                                    'text': item.name,
                                    'type': getType(item),
                                    'shareType': item.shareType,
                                    'parent': node.id,
                                    'children': data[i].type === lncMediaService.TYPE.FOLDER
                                };
                                folder.push(childNode);
                            }
                            cb.call(this, folder);
                        });
                    },
                    'check_callback': true
                },
                'contextmenu': {
                    'select_node': false,
                    'items': customMenu
                },
                'types': {
                    default: {
                        icon: 'fa fa-folder icon-state-warning icon-lg'
                    },
                    file: {
                        icon: 'fa fa-file icon-state-warning icon-lg'
                    },
                    share: {
                        icon: 'fa fa-share-alt font-blue icon-lg'
                    }
                }
            }).on('move_node.jstree rename_node.jstree copy_node.jstree', handleNodeEvent)
                .on('ready.jstree', function (e, data) {
                    $log.info('tree init ready');
                    $log.info(data);
                }).on('select_node.jstree', function (e, data) {
                    $log.info('node change');
                    $log.info(data.node.id);
                    setBrowserPath(data.node);
                });

            jstree = els.jstree(true);

            function setBrowserPath(node) {
                var currentNode = '';
                if (lnc.hasValue(node)) {
                    currentNode = node.id || '';
                }

                if (ctrl) {
                    ctrl.path = getCurrentPath(node);
                    ctrl.setCurrentPath(currentNode);
                }
            }

            function selectRoot() {
                jstree.deselect_all();
                setBrowserPath();
            }

            function destroy() {
                $log.info('JSTree destroy');
                jstree.destroy();
            }

            function refresh() {
                var selectNode = getSelectNode();
                jstree.load_node(selectNode);
            }

            function getCurrentPath(node) {
                var rs = '';
                if (lnc.hasValue(node)) {
                    do {
                        rs = node.text + '&nbsp;<i class="fa fa-caret-right font-blue"></i>&nbsp;' + rs;
                        node = jstree.get_node(node.parent);
                    }
                    while (!isRootNode(node));
                }

                return rs;
            }


            function handleNodeEvent(e, data) {
                $log.info(e);
                $log.info(data);
                var eventType = e.type;
                var node = data.node;
                switch (eventType) {
                    case 'rename_node':
                        if (lnc.hasValue(node.original.id)) {
                            lncMediaService.edit(node.original.id, {
                                name: node.text,
                                clientId: node.id
                            }).then(function (res) {
                                $log.info(res);
                                reloadNodeWithServerData(res);
                            });
                        } else {
                            var parentNode = '';
                            if (!isRootNode(node.parent)) {
                                parentNode = node.parent;
                            }
                            lncMediaService.create(parentNode, {
                                name: node.text,
                                clientId: node.id
                            }).then(function (res) {
                                $log.info(res);
                                reloadNodeWithServerData(res);
                            });
                        }
                        break;
                    case 'move_node':
                        if (lnc.hasValue(node.original.id)) {
                            lncMediaService.edit(node.original.id, {
                                name: node.text,
                                parent: node.parent,
                                clientId: node.id
                            }).then(function (res) {
                                $log.info(res);
                                reloadNodeWithServerData(res);
                            });
                        }
                        break;
                    default:
                        break;
                }
            }

            function customMenu(node) {
                var type = node.type;
                var items = {
                    'create': {
                        'icon': 'fa fa-file fw',
                        'label': 'Create Folder',
                        'action': function () {
                            createNode(node);
                        }
                    },
                    'rename': {
                        'icon': 'fa fa-pencil fw',
                        'label': 'Rename',
                        'action': function () {
                            renameNode(node);
                        }
                    },
                    'remove': {
                        'icon': 'fa fa-trash fw',
                        'label': 'Delete',
                        'action': function () {
                            removeNode(node);
                        }
                    },
                    'ccp': {
                        'icon': 'fa fa-list fw',
                        'separator_before': true,
                        'separator_after': false,
                        'label': 'Edit',
                        'action': false,
                        'submenu': {
                            'cut': {
                                'icon': 'fa fa-scissors fw',
                                'label': 'Cut',
                                'action': function () {
                                    cutCopyPaste(node);
                                }
                            },
                            'paste': {
                                'icon': 'fa fa-paste fw',
                                '_disabled': !jstree.can_paste(),
                                'label': 'Paste',
                                'action': function () {
                                    pasteNode(node);
                                }
                            }
                        }
                    },
                    'properties': {
                        'icon': 'fa fa-cog fw',
                        'label': 'Properties',
                        'action': function () {
                            setProperties(node);
                        }
                    }
                };
                if (isRootNode(node)) {
                    delete items.rename;
                    delete items.remove;
                    delete items.ccp;
                } else if (type === NODE_TYPE.file) {
                    delete items.create;
                    delete items.paste;
                }
                return items;
            }

            function setProperties(node) {
                $log.info(node);
                var propertiesModal = lncModalService.open({
                    templateUrl: 'components/media/jstree/properties.tpl.html',
                    controller: 'MediaPropertiesController',
                    controllerAs: 'mp',
                    title: 'Folder ' + node.text + ' Properties',
                    bindToController: true,
                    resolve: {
                        media: function () {
                            return node;
                        }
                    }
                });

                propertiesModal.result.then(function (data) {
                    $log.info(data);
                    jstree.set_type(data.id, getType(data));
                }, function (reason) {
                    $log.info(reason);
                });
            }

            function reloadNodeWithServerData(nodeS) {
                var node = jstree.get_node(nodeS.clientId);
                var currentSelectNode = getSelectNode();
                var parentNode = currentSelectNode;
                if (angular.isObject(currentSelectNode)) {
                    parentNode = currentSelectNode.id;
                }

                if (lnc.hasValue(node)) {
                    jstree.set_id(node, nodeS.id);
                    node.original.id = nodeS.id;
                    node.text = nodeS.name;
                    node.parent = nodeS.parent || parentNode;
                    node.type = getType(nodeS);
                    jstree.set_icon(node, getIcon(nodeS));
                }
            }

            function getType(nodeS) {
                var rs = NODE_TYPE.default;
                if (nodeS.shareType === lncMediaService.SHARE_TYPE.GLOBAL) {
                    rs = NODE_TYPE.share;
                }

                return rs;
            }

            function getIcon(nodeS) {
                var rs = 'fa fa-folder icon-state-warning icon-lg';
                if (nodeS.shareType === lncMediaService.SHARE_TYPE.GLOBAL) {
                    rs = 'fa fa-users font-blue icon-lg';
                }

                return rs;
            }

            function getSelectNode() {
                var rs = $.jstree.root;
                var selectNodes = jstree.get_selected(true);
                if (selectNodes.length > 0) {
                    rs = selectNodes[0];
                }
                return rs;
            }

            function isRootNode(node) {
                return (node === $.jstree.root || node.id === $.jstree.root);
            }

            function createNode(node) {
                var parentNode = node || getSelectNode(),
                    newNode;

                var check = true;
                if (parentNode !== '#') {
                    check = jstree.is_open(parentNode);
                }

                if (!check) {
                    jstree.open_node(parentNode, function () {
                        newNode = jstree.create_node(parentNode);
                        jstree.edit(newNode);
                    });
                } else {
                    newNode = jstree.create_node(parentNode);
                    jstree.edit(newNode);
                }
            }

            function renameNode(node) {
                var selectedNode = node || getSelectNode();
                if (selectedNode === '#') {
                    lncModalService.alert({
                        type: 'warning',
                        message: 'Please select Node to edit !'
                    });
                } else {
                    jstree.edit(selectedNode);
                }
            }

            function cutCopyPaste(node) {
                var selectedNode = node || getSelectNode();
                if (selectedNode === '#') {
                    lncModalService.alert({
                        type: 'warning',
                        message: 'Please select Node to copy or paste !'
                    });
                } else {
                    jstree.cut(node);
                }
            }

            function pasteNode(node) {
                var selectedNode = node || getSelectNode();
                jstree.paste(selectedNode);
            }

            function removeNode(node) {
                var selectedNode = node || getSelectNode();
                if (selectedNode === '#') {
                    lncModalService.alert({
                        type: 'warning',
                        message: 'Please select Node to delete !'
                    });
                } else {
                    var confirmModal = lncModalService.confirm({
                        type: 'danger',
                        message: 'Folder <strong>' + selectedNode.text + '</strong> and all sub-folders, files will be deleted!'
                    });
                    confirmModal.result.then(function () {
                        lncMediaService.delete(selectedNode.id).then(function (data) {

                            if (lnc.hasValue(data) && lnc.hasValue(data.id)) {
                                var currentSelectedNode = getSelectNode();
                                var parentNode;
                                var changeNode = true;

                                if (isNodeChildrenOf(currentSelectedNode, data.id)) {
                                    parentNode = data.parent || $.jstree.root;
                                } else if (currentSelectedNode.id === data.id) {
                                    parentNode = currentSelectedNode.parent;
                                } else {
                                    changeNode = false;
                                }

                                if (changeNode) {
                                    if (isRootNode(parentNode)) {
                                        selectRoot();
                                    } else {
                                        jstree.select_node(parentNode);
                                    }
                                }
                                jstree.delete_node(data.id);
                            }
                        });
                    });
                }
            }

            function isNodeChildrenOf(nodeChild, nodeParentId) {
                var rs = false;
                if (isRootNode(nodeParentId)) {
                    rs = true;
                } else if (angular.isArray(nodeChild.parents)) {
                    for (var i = 0; i < nodeChild.parents.length; i++) {
                        if (nodeParentId === nodeChild.parents[i]) {
                            rs = true;
                            break;
                        }
                    }
                }
                return rs;
            }
        }
    }
})();

