(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnSave', lncBtnSave);

    function lncBtnSave () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/save.html'
        };
    }
})();
