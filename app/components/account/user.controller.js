(function () {
    'use strict';

    angular
        .module('hdl.account')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope'];

    function UserController($scope) {
        var backstretch;
        $scope.$on('$viewContentLoaded', function () {
            backstretch = angular.element('.login-bg');
            backstretch.backstretch([
                'image/bg/3.jpg',
                'image/bg/1.jpg',
                'image/bg/2.jpg',
            ], {
                fade: 1000,
                duration: 8000
            });
        });
    }
})();
