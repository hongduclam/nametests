(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnSetting', lncBtnSetting);

    function lncBtnSetting () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/setting.html'
        };
    }
})();


