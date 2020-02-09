(function () {
    'use strict';
    angular
        .module('hdl.account')
        .factory('accountService', accountService);

    accountService.$inject = ['$log', '$http'];

    function accountService($log, $http) {
        return {
            login: _login,
            register: _register
        };

        ////////////////
        function _login(data) {
            return $http.post('/login', $.param(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });
        }
        function _register(data) {
            return $http.post('/user/register', data);
        }
    }
})();

