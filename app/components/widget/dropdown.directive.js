(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('lncHoverDropdown', lncHoverDropdown);

    lncHoverDropdown.$inject = ['$log', '$timeout', '$rootScope'];

    function lncHoverDropdown($log, $timeout, $rootScope) {
        var currentElementOpen = null;

        var defaults = {
            delay: 500,
            hoverDelay: 0,
            instantlyCloseOthers: true
        };

        var dropdownEvent = $rootScope.$on(LNC_EVENT.DROPDOWN_CLOSE, function () {
            $log.info('Dropdown Close event');
            if (currentElementOpen) {
                currentElementOpen.removeClass('open');
            }
        });

        return {
            restrict: 'A',
            link: linkFunc
        };

        ////////////////
        function linkFunc(scope, element, attrs) {
            var timeoutHover, removeTimeout;
            var settings = angular.toJson(attrs.lncHoverDropdown);
            settings = angular.extend({}, defaults, settings);

            element.hover(function (e) {
                e.stopPropagation();
                e.preventDefault();

                openDropdown(e);
            }, function (e) {
                e.stopPropagation();
                e.preventDefault();
                clearTimeout(timeoutHover);
                /* eslint-disable */
                removeTimeout = setTimeout(function () {
                    element.removeClass('open');
                }, settings.delay);
                /* eslint-enable */
            });

            function openDropdown() {
                // clear dropdown timeout here so it doesn't close before it should
                clearTimeout(removeTimeout);
                // restart hover timer
                clearTimeout(timeoutHover);

                if (currentElementOpen !== null && !element.is(currentElementOpen)) {
                    currentElementOpen.removeClass('open');
                }
                /* eslint-disable */
                // delay for hover event.
                timeoutHover = setTimeout(function () {
                    // clear timer for hover event
                    clearTimeout(timeoutHover);
                    element.addClass('open');
                    currentElementOpen = element;
                }, settings.hoverDelay);
                /* eslint-enable */
            }

            scope.$on('$destroy', function () {
                dropdownEvent();
            });
        }
    }
})();

