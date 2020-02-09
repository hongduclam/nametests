(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('lncScroll', lncScroll);

    lncScroll.$inject = ['$log', '$timeout', '$parse'];

    function lncScroll($log, $timeout, $parse) {
        var defaultOptions = {
            theme: 'dark-thin',
            autoHideScrollbar: true,
            autoExpandScrollbar: true,
            contentTouchScroll: 50,
            scrollbarPosition: 'outside',
            scrollInertia: 900,
            mouseWheel: {
                preventDefault: true
            }
        };

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var opts = $parse(attrs.lncScroll)(scope);
            var option = angular.extend({}, defaultOptions, opts);
            $timeout(function () {
                element.mCustomScrollbar(option);
            }, 200);

            scope.$on('$destroy', function () {
                element.mCustomScrollbar('destroy');
            });
        }
    }
})();

