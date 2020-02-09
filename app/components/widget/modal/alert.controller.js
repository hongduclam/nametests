(function () {
    'use strict';
    angular
        .module('lnc.modal')
        .controller('ModalAlertController', ModalAlertController);

    ModalAlertController.$inject = ['$log', 'option'];

    function ModalAlertController ($log, option) {
        var vm = this;
        vm.option = option;
    }
})();
