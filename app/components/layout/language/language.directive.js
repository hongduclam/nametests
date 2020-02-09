(function () {
    'use strict';

    angular
        .module('hdl.layout')
        .directive('lncLanguage', lncLanguage);

    function lncLanguage () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/layout/language/language.tpl.html',
            link: linkFunc
        };

        ////////////////
        function linkFunc () {
        }
    }
})();

