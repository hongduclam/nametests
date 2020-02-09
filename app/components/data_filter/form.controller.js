(function () {
    'use strict';
    angular
        .module('hdl.dataFilter')
        .controller('DataFilterFormController', DataFilterFormController);

    DataFilterFormController.$inject = ['lncLayout', 'dataFilterService', 'id', 'form', 'questionData'];

    function DataFilterFormController(lncLayout, dataFilterService, id, form, questionData) {
        var vm = this;
        vm.save = save;
        vm.formData = form || {};

        vm.questionContent = questionData.content;
        vm.isLoading = false;

        function reset() {
            vm.form.$setPristine();
            vm.formData = {};
        }

        function save() {
            var processPromise;
            vm.isLoading = true;
            vm.formData.isDefault = questionData.isDefault;
            vm.formData.langCode = questionData.langCode;
            if (!id) {
                processPromise = dataFilterService.create(questionData.id, vm.formData).then(function (data) {
                    vm.$notify();
                    reset();
                    lncLayout.toastr(data.data.message, 'SUCCESS', 'success');
                });
            } else {
                processPromise = dataFilterService.update(questionData.id, id, vm.formData).then(function (data) {
                    vm.$close();
                    lncLayout.toastr(data.data.message, 'SUCCESS', 'success');
                });
            }

            processPromise.catch(function (response) {
                lncLayout.toastr(response.data, 'ERROR', 'error');
            }).finally(function () {
                vm.isLoading = false;
            });
        }
    }
})();