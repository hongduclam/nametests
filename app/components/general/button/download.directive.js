(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnDownload', lncBtnDownload);

    function lncBtnDownload () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/download.html'
        };
    }
})();


