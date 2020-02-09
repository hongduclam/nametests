(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('lncTooltip', lncTooltip);

    lncTooltip.$inject = ['$log'];

    function lncTooltip($log) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            element.tooltip({
                title: attrs.lncTooltip,
                trigger: 'hover',
                html: true
            });

            scope.$on('$destroy', function(){
                $log.info('Tooltip destroy');
                element.tooltip('destroy');
            });
        }
    }
})();
