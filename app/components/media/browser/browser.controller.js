(function () {
    'use strict';
    angular
        .module('lnc.media')
        .controller('BrowserController', BrowserController);

    function BrowserController () {
        var vm = this;
        vm.isLoading = false;
        vm.path = '';
    }
})();
