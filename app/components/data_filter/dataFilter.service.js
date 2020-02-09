(function () {
    'use strict';
    angular
        .module('hdl.dataFilter')
        .service('dataFilterService', dataFilterService);

    dataFilterService.$inject = ['$http'];

    function dataFilterService($http) {
        var _URL = '/dataFilter';

        return {
            filter: _filter,
            create: _create,
            read: _read,
            update: _update,
            delete: _delete,
        };

        function _filter(qid, req) {
            return $http.post(_URL + '/' + qid + '/filter/' , req);
        }

        function _create(qid, form) {
            return $http.post(_URL + '/' + qid, form).then(function (resp) {
                return resp.data;
            });
        }

        function _update(qid, id, form) {
            return $http.post(_URL + '/' + qid + '/' + id, form).then(function (resp) {
                return resp.data;
            });
        }

        function _read(qid, id) {
            return $http.get(_URL + '/' + qid + '/' + id).then(function (resp) {
                return resp.data;
            });
        }

        function _delete(qid, id) {
            return $http.delete(_URL + '/' + qid + '/' + id);
        }

    }
})();
