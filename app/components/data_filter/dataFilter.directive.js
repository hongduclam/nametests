(function () {
    'use strict';

    angular
        .module('hdl.dataFilter')
        .directive('questionFilterData', dataFilter);
    dataFilter.$inject = ['lncModalService', 'dataFilterService', 'questionService'];

    function dataFilter(lncModalService, dataFilterService, questionService) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                questionData: '=ngModel',
                add: '&'
            },
            templateUrl: 'components/data_filter/main.tpl.html',
            link: _link,
            bindToController: true,
            controller: 'DataFilterMainController',
            controllerAs: 'dfm'
        };
        function _link(scope, e, a, ctrl) {
        }
    }

    angular
        .module('hdl.dataFilter')
        .controller('DataFilterMainController', DataFilterMainController);

    DataFilterMainController.$inject = ['lncModalService', 'dataFilterService', 'questionService'];

    function DataFilterMainController(lncModalService, dataFilterService, questionService) {
        var scope = this;
        scope.openModal = openModal;
        scope.gridApi = angular.noop;
        scope.callback = callback;
        scope.tableData = filter;
        scope.create = create;
        /////////////////

        scope.options = {
            search: {
                global: false,
                placeholder: 'Search ...'
            },
            columns: [
               /* {
                    title: 'Img Sub',
                    data: 'imageSubId',
                    width: '15%',
                    name: 'imageSubId',
                    sortable: false,
                    directive: '<img src="" lnc-thumbnail="{{row.imageSubId}}">'
                },*/
                {
                    title: 'Content',
                    data: 'content',
                    width: '30%',
                    name: 'content',
                    sortable: false,
                },
                {
                    title: 'Keyword',
                    data: 'keyword',
                    width: '10%',
                    name: 'content',
                    sortable: false,
                }/*,
                {
                    title: 'Lang',
                    data: 'langCode',
                    width: '5%',
                    name: 'langCode',
                    sortable: false
                }*/
            ]
        };

        scope.options.actions = getActions();

        function filter(data) {
            return dataFilterService.filter(scope.questionData.id, data);
        }

        function callback(e, data) {
            var action = angular.element(e.currentTarget).data('type');
            if (action === 'edit') {
                edit(data);
            }
            if (action === 'add') {
                getCurrentRow(data);
            }
            else if (action === 'delete') {
                remove(data);
            }
        }
        function getCurrentRow(data){
            scope.add({data: data});
        }

        function reloadDT() {
            if (lnc.hasValue(scope.gridApi) && angular.isFunction(scope.gridApi.refresh)) {
                scope.gridApi.refresh();
            }
        }

        function remove(item) {
            var confirmInstance = lncModalService.confirm({
                type: 'danger',
                message: 'Data <strong>' + item.id + '</strong> will be deleted?'
            });
            confirmInstance.result.then(function () {
                dataFilterService.delete(scope.questionData.id, item.id).then(function () {
                    reloadDT();
                });
            });
        }

        function create() {
            openModal();
        }

        function edit(item) {
            dataFilterService.read(scope.questionData.id, item.id).then(function (resp) {
                openModal(item.id, resp);
            });
        }

        function getActions() {
            var acts = [];
            acts.push({
                type: 'edit'
            });
            acts.push({
                type: 'delete'
            });
            acts.push({
                type: 'add',
                template: [
                    '<button type="button" class="btn green-haze btn-xs" lnc-tooltip="Add" data-type="add">',
                    'Add',
                    '</button>'
                ].join('')
            });
            return acts;
        }

        function openModal(id, formData) {
            var modalInstance = lncModalService.open({
                templateUrl: 'components/data_filter/form.tpl.html',
                title: 'Data Filter Form',
                controller: 'DataFilterFormController',
                controllerAs: 'vm',
                size: 'modal-md',
                bindToController: true,
                resolve: {
                    id: function () {
                        return id;
                    },
                    form: function () {
                        return formData;
                    },
                    questionData: function () {
                        return scope.questionData;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                reloadDT();
            }, function () {
            }, function () {
                reloadDT();
            });
        }
    }
})();
