(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnRefresh', lncBtnRefresh);

    function lncBtnRefresh () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                isRefresh: '='
            },
            templateUrl: 'components/general/button/refresh.html',
            link: _link
        };

        function _link(){

        }
    }
})();

