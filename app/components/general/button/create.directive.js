(function () {
    'use strict';

    angular
        .module('lnc.general')
        .directive('lncBtnCreate', lncBtnCreate);

    function lncBtnCreate () {
        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            templateUrl: 'components/general/button/create.html',
            link: _link
        };

        function _link(scope, ele, attrs){
            var rs = attrs.display || 'Create';
            scope.btn = {
                display: rs
            };
        }
    }
})();


