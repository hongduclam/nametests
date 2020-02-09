(function () {
    'use strict';
    angular
        .module('hdl.question')
        .controller('QuestionMainController', QuestionMainController);

    QuestionMainController.$inject = ['questionService', '$state', 'lncLayout', 'lncModalService'];

    function QuestionMainController(questionService, $state, lncLayout, lncModalService) {
        var vm = this;
        vm.title = $state.current.data.pageTitle;
        vm.gridApi = angular.noop;
        vm.callback = callback;
        vm.tableData = filter;

        vm.options = {
            search: {
                global: true,
                placeholder: 'Search ...'
            },
            columns: [
              {
                    title: 'Name',
                    data: 'name',
                    width: '5%',
                    name: 'name',
                    sortable: false,
                },
                {
                    title: 'Content',
                    data: 'content',
                    width: '30%',
                    name: 'langCode',
                    sortable: false,
                },
                {
                    title: 'Img Home',
                    data: 'imageHomeId',
                    width: '15%',
                    name: 'imageHomeId',
                    directive: '<img src="" lnc-thumbnail="{{row.imageHomeId}}">',
                    sortable: false
                },
                {
                    title: 'Img Main',
                    data: 'imageMainId',
                    width: '15%',
                    name: 'imageMainId',
                    directive: '<img src="" lnc-thumbnail="{{row.imageMainId}}">',
                    sortable: false
                },
                {
                    title: 'Img Sub',
                    data: 'imageSubId',
                    width: '15%',
                    name: 'imageSubId',
                    sortable: false,
                    directive: '<img src="" lnc-thumbnail="{{row.imageSubId}}">'
                },
                {
                    title: 'Active',
                    data: 'isActive',
                    width: '5%',
                    name: 'isActive',
                    sortable: false
                },
             /*   {
                    title: 'UpdatedDate',
                    data: 'updatedDate',
                    width: '10%',
                    name: 'updatedDate',
                    directive: '<moment-date-time-item item="::row.updatedDate"></moment-date-time-item>',
                    sortable: true
                }*/
            ]
        };

        vm.options.actions = getActions();

        function filter(data) {
            return questionService.filter(data);
        }

        function callback(e, data) {
            var action = angular.element(e.currentTarget).data('type');
            if (action === 'edit') {
                edit(data);
            }
            else if (action === 'answer') {
                $state.go('^.id.answer', {
                    id: data.id
                });
            }
            else {
                remove(data);
            }
        }

        function reloadDT() {
            if (lnc.hasValue(vm.gridApi) && angular.isFunction(vm.gridApi.refresh)) {
                vm.gridApi.refresh();
            }
        }

        function remove(item) {
            var confirmInstance = lncModalService.confirm({
                type: 'danger',
                message: 'Customer <strong>' + item.name + '</strong> will be deleted?'
            });
            confirmInstance.result.then(function () {
                questionService.delete(item.id).then(function () {
                    reloadDT();
                });
            });
        }

        function edit(item) {
            $state.go('^.id.edit', {
                id: item.id
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
                type: 'answer',
                template: [
                    '<button type="button" class="btn green-haze btn-xs" lnc-tooltip="Answer" data-type="answer">',
                    'Answer',
                    '</button>'
                ].join('')
            });
            return acts;
        }
    }
})();

