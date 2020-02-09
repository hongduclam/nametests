(function () {
    'use strict';
    angular.module('hdl.layout').directive('lncHeaderSearch', lncHeaderSearch);
    lncHeaderSearch.$inject = ['$state', '$timeout', '$log'];
    function lncHeaderSearch($state, $timeout, $log) {
        return {
            link: link,
            templateUrl: 'components/layout/search.tpl.html',
            restrict: 'E',
            replace: true
        };
        function link(scope) {
        }
    }
})();
