(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('lncEqual', lncEqual);

    lncEqual.$inject = ['$log'];

    function lncEqual($log) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: linkFunc
        };

        ////////////////

        function linkFunc(scope, element, attrs, ctrl) {
            ctrl.$validators.lncEqual = function (modelValue) {
                var needCompareValue = attrs.lncEqual;
                $log.info(needCompareValue);
                if (ctrl.$isEmpty(modelValue) || ctrl.$isEmpty(needCompareValue)) {
                    return true;
                }

                if (modelValue === needCompareValue) {
                    return true;
                }

                return false;
            };

            attrs.$observe('lncEqual', function () {
                ctrl.$validate();
            });
        }
    }
})();

