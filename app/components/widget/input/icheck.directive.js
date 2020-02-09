(function () {
    'use strict';

    angular
        .module('lnc.input')
        .directive('icheck', icheck);

    icheck.$inject = ['$timeout'];

    function icheck($timeout) {
        var _DEFAULT_TWO_STATE = {
            check: true,
            uncheck: false
        };

        /* eslint-disable */
        var _DEFAULT_THREE_STATE = {
            check: 1,
            uncheck: 0,
            indeterminate: -1
        };
        /* eslint-enable */
        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        function link($scope, element, $attrs, ngModel) {
            var state;
            var checkboxClass = $attrs.checkbox || 'icheckbox_minimal-grey';
            var radioClass = $attrs.radio || 'iradio_minimal-grey';
            var icheckOptions = {
                checkboxClass: checkboxClass,
                radioClass: radioClass
            };

            state = angular.fromJson($attrs.icheck) || _DEFAULT_TWO_STATE;

            element.iCheck(icheckOptions);
            element.on('ifClicked', function () {
                $timeout(function () {
                    ngModel.$setViewValue(element.prop('checked'));
                });
            });

            ngModel.$formatters.push(parseICheck);

            ngModel.$parsers.push(function (value) {
                return value ? state.check : state.uncheck;
            });

            function parseICheck(modelValue) {
                if (modelValue === state.check) {
                    element.iCheck('check');
                    return true;
                }

                element.iCheck('uncheck');
                return false;
            }

            $scope.$on('$destroy', function () {
                element.iCheck('destroy');
            });
        }
    }
})();
