(function () {
    'use strict';

    angular
        .module('hdl.user')
        .directive('userItem', userItem);

    function userItem() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                user: '=item',
                showAvatar: '@'
            },
            templateUrl: 'components/user/user-item.view.html',
            link: linkFunc
        };

        ////////////////

        function linkFunc(scope) {
            if (angular.isUndefined(scope.showAvatar) || scope.showAvatar === null) {
                scope.showAvatar = true;
            }
        }
    }
})();

