(function () {
    'use strict';
    angular
        .module('hdl.question')
        .service('questionService', QuestionService);

    QuestionService.$inject = ['$http'];

    function QuestionService($http) {
        var _URL = '/question';

        return {
            filter: _filter,
            create: _create,
            read: _read,
            update: _update,
            delete: _delete,
        };

        function _filter(req) {
            return $http.post(_URL + '/filter', req);
        }

        function _create(form) {
            return $http.post(_URL, form).then(function (resp) {
                return resp.data;
            });
        }

        function _update(id, form) {
            return $http.post(_URL + '/' + id, form).then(function (resp) {
                return resp.data;
            });
        }

        function _read(id) {
            return $http.get(_URL + '/' + id).then(function (resp) {
                return resp.data;
            });
        }

        function _delete(id) {
            return $http.delete(_URL + '/' + id);
        }

    }
})();
