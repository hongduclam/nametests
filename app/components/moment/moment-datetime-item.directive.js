(function () {
    'use strict';

    angular
        .module('lnc.moment')
        .directive('momentDateTimeItem', momentDateTimeItem);

    function momentDateTimeItem() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                item: '='
            },
            templateUrl: 'components/moment/moment-datetime-item.tpl.html',
            link: linkFunc
        };

        ////////////////

        function linkFunc() {
        }
    }
})();

