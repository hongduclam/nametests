(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnClose', lncBtnClose);

    function lncBtnClose () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/close.html'
        };
    }
})();

