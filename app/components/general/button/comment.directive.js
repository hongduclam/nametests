(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnComment', lncBtnComment);

    function lncBtnComment () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/general/button/comment.html'
        };
    }
})();
