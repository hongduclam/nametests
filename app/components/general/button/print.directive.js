(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnPrint', lncBtnPrint);

    function lncBtnPrint () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/print.html'
        };
    }
})();

