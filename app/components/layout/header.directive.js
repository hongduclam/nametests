(function () {
    'use strict';
    angular
        .module('hdl.layout')
        .directive('lncLayoutHeader', lncLayoutHeader);

    function lncLayoutHeader () {
        return {
            templateUrl: 'components/layout/header.tpl.html',
            restrict: 'E',
            replace: true,
            controller: 'HeaderController',
            controllerAs: 'hc'
        };
    }
})();
