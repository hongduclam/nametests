(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnRemove', lncBtnRemove);

    function lncBtnRemove () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/remove.html'
        };
    }
})();

