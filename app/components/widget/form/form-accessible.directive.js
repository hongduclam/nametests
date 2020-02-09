(function () {
    'use strict';
    angular
        .module('lnc.widget')
        .directive('formAccessible', formAccessible);

    formAccessible.$inject = [
        '$compile'
    ];

    function formAccessible () {
        return {
            restrict: 'A',
            link: _link
        };

        function _link (scope, elem) {
            elem.on('submit', function () {
                var firstInvalid = elem.find('.ng-invalid:visible:first');
                if (firstInvalid.length) {
                    firstInvalid.focus();
                }
            });
        }
    }
})();
