(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('captcha', captcha);

    function captcha() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {},
            templateUrl: 'components/widget/captcha/captcha.html',
            link: linkFunc
        };

        ////////////////

        function linkFunc(scope) {
            scope.captcha = '/captcha';
            scope.refresh = refresh;
            scope.$on('reload.captcha', refresh);

            function refresh() {
                scope.captcha = '/captcha?_t=' + new Date().getMilliseconds();
            }
        }
    }
})();

