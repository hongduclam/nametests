(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnLoadMore', lncBtnLoadMore);

    function lncBtnLoadMore () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/load-more.html'
        };
    }
})();
