(function () {
    'use strict';
    angular
        .module('lnc.media')
        .factory('lncMediaService', lncMediaService);

    lncMediaService.$inject = ['$http', '$log', 'lncModalService', 'userService'];

    function lncMediaService($http, $log, lncModalService, userService) {
        var url = '/media';
        //var cdn = 'http://cdn.dev.lnc.vn';
        var cdn = 'http://cdn.abyourself.local';

        //var cdn = 'http://cdn.finance.local';
        var TYPE = {
            FOLDER: 0,
            FILE: 1
        };

        var SHARE_TYPE = {
            PERSONAL: 0,
            GLOBAL: 1
        };

        return {
            TYPE: TYPE,
            SHARE_TYPE: SHARE_TYPE,
            getRoot: getRoot,
            getTree: getTree,
            updateNode: updateNode,
            create: createNode,
            edit: editNode,
            delete: deleteNode,
            thumbnailFile: thumbnailFile,
            thumbnail: thumbnail,
            download: download,
            modal: modal,
            isImage: isImage,
            setProperties: setProperties,
            uploadCanvas: uploadCanvas,
            getMediaPermission: getMediaPermission,
            slide: slide,
            productImageUrl: productImageUrl,
            imageUrl: imageUrl,
            product: {
                preview: _productPreview
            }
        };

        ////////////////
        function imageUrl(id){
            return cdn + '/image/' + id;
        }
        function _productPreview(id) {
            return cdn + '/product/' + id + '/preview';
        }

        function getMediaPermission() {
            return {
                CREATE: true,
                UPDATE: true,
                DELETE:true
            };
            /*return {
                READ: userService.hasPermission('media', 'READ'),
                CREATE: userService.hasPermission('media', 'CREATE'),
                DELETE: userService.hasPermission('media', 'DELETE'),
                DOWNLOAD: userService.hasPermission('media', 'DOWNLOAD'),
                UPDATE: userService.hasPermission('media', 'UPDATE')
            };*/
        }

        function productImageUrl(pId, mId) {
            return cdn + '/product/' + pId + '/image/' + mId;
        }

        function uploadCanvas(data) {
            return $http.post(url + '/upload/canvas', data);
        }

        function setProperties(id, properties) {
            return $http.post(url + '/tree/' + id + '/properties', properties);
        }

        function slide(images) {
            var modalInstance = lncModalService.open({
                effect: false,
                isFullScreen: true,
                templateUrl: 'components/media/slider.tpl.html',
                controller: 'LncSliderController',
                controllerAs: 'sl',
                bindToController: true,
                resolve: {
                    images: function () {
                        return images;
                    }
                }
            });
            return modalInstance;
        }

        function modal(type, selectType) {
            var title;

            if (type === 'image') {
                title = 'Select Image';
            } else {
                title = 'Select Documents';
            }

            var modalInstance = lncModalService.open({
                templateUrl: 'components/media/media-modal.tpl.html',
                title: title,
                subtitle: '',
                controller: 'LncMediaModalController',
                controllerAs: 'mm',
                bindToController: true,
                size: 'modal-full',
                resolve: {
                    type: function () {
                        return type || 'document';
                    },
                    selectType: function () {
                        return selectType;
                    }
                }
            });
            return modalInstance;
        }

        function createNode(parentNode, data) {
            var createUrl = url + '/tree';
            if (lnc.hasValue(parentNode)) {
                createUrl += '/' + parentNode;
            }

            return $http.post(createUrl, data).then(function (response) {
                return response.data;
            });
        }

        function editNode(id, data) {
            return $http.put(url + '/tree/' + id, data).then(function (response) {
                return response.data;
            });
        }

        function deleteNode(id) {
            return $http.delete(url + '/tree/' + id).then(function (response) {
                return response.data;
            });
        }

        function getRoot(type) {
            return $http.get(url + '/tree/' + type).then(function (response) {
                return response.data;
            });
        }

        function updateNode(data) {
            return $http.post(url + '/tree', data).then(function (response) {
                return response.data;
            });
        }

        function getTree(node, type) {
            var treeUrl = url + '/tree/' + node + '/' + type;

            return $http.get(treeUrl).then(function (response) {
                return response.data;
            });
        }

        function thumbnailFile(fileObj) {
            var rs = 'image/filetype/documents.svg';
            /* Detect File Mimetype */
            if (lnc.hasValue(fileObj)) {
                var mimetype = fileObj.mimetype;
                if (isImage(mimetype)) {
                    rs = thumbnail(fileObj.id);
                } else if (isPDF(mimetype)) {
                    rs = thumbnail(fileObj.id);
                } else if (isMP3(mimetype)) {
                    rs = 'image/filetype/mp3.svg';
                } else if (isPowerPoint(mimetype)) {
                    rs = 'image/filetype/ppt.svg';
                } else if (isZip(mimetype)) {
                    rs = 'image/filetype/zip.svg';
                } else if (isExcel(mimetype)) {
                    rs = 'image/filetype/xls.svg';
                } else if (isWord(mimetype)) {
                    rs = 'image/filetype/doc.svg';
                } else if (isXML(mimetype)) {
                    rs = 'image/filetype/xml.svg';
                } else if (isVideo(mimetype)) {
                    rs = 'image/filetype/avi.svg';
                }
            }

            return rs;
        }

        function isVideo(mimetype) {
            return mimetype.match(/video\/*/);
        }

        function isImage(mimetype) {
            return mimetype.match(/image\/*/);
        }

        function isPDF(mimetype) {
            return mimetype.match(/application\/pdf/);
        }

        function isMP3(mimetype) {
            return mimetype.match('/audio\/mpeg/');
        }

        function isPowerPoint(mimetype) {
            return mimetype.match(/application\/vnd.ms-powerpoint | application\/vnd.openxmlformats-officedocument.presentationml.presentation | application\/vnd.openxmlformats-officedocument.presentationml.template | application\/vnd.openxmlformats-officedocument.presentationml.slideshow/);
        }

        function isXML(mimetype) {
            return mimetype.match(/application\/zip | application\/x-compressed-zip/);
        }

        function isZip(mimetype) {
            return mimetype.match(/application\/xml/);
        }

        function isExcel(mimetype) {
            return mimetype.match(/application\/vnd.ms-excel|application\/vnd.ms-excel.addin.macroEnabled.12|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application\/vnd.openxmlformats-officedocument.spreadsheetml.template/);
        }

        function isWord(mimetype) {
            return mimetype.match(/application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|application\/vnd.openxmlformats-officedocument.wordprocessingml.template/);
        }

        function thumbnail(id) {
            return cdn + '/' + id + '/thumbnail';
        }

        function download(id) {
            return '/media/' + id + '/download';
        }
    }
})();

