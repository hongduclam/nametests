(function () {
    'use strict';
    angular
        .module('lnc.media')
        .controller('LncMediaModalController', LncMediaModalController);

    LncMediaModalController.$inject = ['type', 'selectType', 'lncToastr'];

    function LncMediaModalController (type, selectType, lncToastr) {
        var vm = this;
        vm.api = null;
        vm.chooseFile = chooseFile;
        vm.mimetype = type;
        vm.selectType = selectType;

        function chooseFile () {
            if (angular.isObject(vm.api) && angular.isFunction(vm.api.getSelectedFiles)) {
                var files = vm.api.getSelectedFiles();
                if (files.length === 0) {
                    lncToastr.warning('Select your file !');
                }
                if (selectType === 'single') {
                    var image = files[0].original;
                    vm.$close(image.id);
                } else {
                    var documents = [];
                    angular.forEach(files, function (value) {
                        documents.push(value.original.id);
                    });
                    vm.$close(documents);
                }
            }
        }
    }
})();
