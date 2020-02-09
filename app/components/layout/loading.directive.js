(function () {
    'use strict';

    angular
        .module('hdl.layout')
        .directive('lncLoading', lncLoading);

    lncLoading.$inject = ['lncLayout'];

    function lncLoading (lncLayout) {
        return {
            restrict: 'A',
            link: linkFunc
        };

        ////////////////
        function linkFunc (scope, element, attrs) {
            var els = element;
            attrs.$observe('lncLoading', function (val) {
                if (val === 'true') {
                    lncLayout.blockUI({
                        target: els
                    });
                } else {
                    lncLayout.unblockUI(els);
                }
            });
        }
    }
})();
