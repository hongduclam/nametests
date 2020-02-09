(function () {
    'use strict';
    angular
        .module('hdl.core')
        .factory('cacheService', cacheService);

    function cacheService() {
        var service = {
            get: get,
            set: set,
            remove: remove,
            clear: clear
        };

        return service;

        ////////////////

        function get(key) {
            return localforage.getItem(key);
        }

        function set(key, value) {
            return localforage.setItem(key, value);
        }

        function remove(key) {
            return localforage.removeItem(key);
        }

        function clear() {
            return localforage.clear();
        }
    }
})();


