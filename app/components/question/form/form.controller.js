(function () {
    'use strict';
    angular
        .module('hdl.question')
        .controller('QuestionFormController', QuestionFormController);

    QuestionFormController.$inject = ['$state', '$log', 'lncLayout',
        'questionService', 'lncMediaService',
        'id', 'form', 'userService'];

    function QuestionFormController($state, $log, lncLayout,
                                    questionService, lncMediaService,
                                    id, form, userService) {
        var vm = this;
        vm.save = save;
        vm.isLoading = false;
        vm.title = $state.current.data.pageTitle;
        vm.preview = _preview;
        vm.folder = userService.getFolder();

        vm.isActive = [{
            id: 1,
            value: 'YES'
        }, {
            id: 0,
            value: 'NO'
        }];

        vm.question = form;
        vm.questionCopy = angular.copy(vm.question);
        vm.questionCopy.id = id;

        vm.question.imgSubWidth = 486;
        vm.question.imgSubHeight = 255;
        //vm.question.imageSubFooterId = 'a18fe22fd6bc97ac5ba537990824ae95';
        //////////////////////////////////////////
        function _preview() {
            vm.imageUrl = lncMediaService.download(vm.question.imageMainId);
        }

        function reset() {
            vm.form.$setPristine();
            vm.question = {};
        }


        function save() {
            vm.isLoading = true;
            var processPromise;
            vm.question.slug = lnc.str2Slug(vm.question.content);
            vm.questionCopy = angular.copy(vm.question);
            if (id) {
                processPromise = questionService.update(id, vm.question);
            } else {
                processPromise = questionService.create(vm.question).then(function (resp) {
                    vm.questionCopy.id = resp.data;
                    reset();
                    return resp;
                });
            }

            processPromise.then(function (data) {
                lncLayout.toastr(data.message, 'SUCCESS', 'success');
            }).catch(function (response) {
                lncLayout.toastr(response.data, 'ERROR', 'error');
            }).finally(function () {
                vm.isLoading = false;
            });
        }
    }
})();
