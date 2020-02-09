(function () {
    'use strict';
    angular
        .module('hdl.core')
        .factory('CoreService', CoreService);

    CoreService.$inject = ['$http'];

    function CoreService($http) {
        var service = {
            init: init
        };

        return service;

        ////////////////

        /**
         * @Desc First call init to server for set Cookie and Csrf token
         *
         * @returns {*}
         */
        function init() {
            return $http.get('/init');
        }
    }
})();

