(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnEdit', lncBtnEdit);

    function lncBtnEdit () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/edit.html'
        };
    }
})();

