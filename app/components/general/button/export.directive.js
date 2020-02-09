(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnExport', lncBtnExport);

    function lncBtnExport () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/export.html'
        };
    }
})();

