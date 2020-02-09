(function () {
    'use strict';
    angular
        .module('hdl.layout')
        .factory('lncLanguageService', lncLanguage);

    lncLanguage.$inject = ['$log'];

    function lncLanguage ($log) {
        return {
            set: set
        };

        ////////////////

        function set () {
            $log.info('set function');
        }
    }
})();
