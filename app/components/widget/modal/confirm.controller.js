(function () {
    'use strict';
    angular
        .module('lnc.modal')
        .controller('ModalConfirmController', ModalConfirmController);

    ModalConfirmController.$inject = ['$log', 'option'];

    function ModalConfirmController ($log, option) {
        $log.info('Message: ' + option);
        var vm = this;
        vm.option = option;
    }
})();
