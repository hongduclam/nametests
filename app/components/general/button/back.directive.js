(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnBack', lncBtnBack);

    function lncBtnBack () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/back.html'
        };
    }
})();

