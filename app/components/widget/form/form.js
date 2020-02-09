(function () {
    'use strict';
    angular
        .module('lnc.widget')
        .directive('lncFormGroup', form);

    form.$inject = [
        '$compile'
    ];

    function form ($compile) {
        return {
            link: link,
            replace: true,
            transclude: true,
            require: '^form',
            restrict: 'E',
            template: '<div class="form-group" ng-transclude></div>'
        };
        function link (scope, element, attrs, formCtrl) {
            var i;

            var labels = element.find('label');
            for (var z = 0; z < labels.length; z++) {
                var label = angular.element(labels[z]);
                if (!label.hasClass('control-label')) {
                    label.addClass('control-label');
                }
            }

            var inputs = element.find('[name]');
            var inputElms = [];
            for (i = 0; i < inputs.length; i++) {
                var input = angular.element(inputs[i]);
                inputElms.push(input);
                main(input);

                var tagName = input.prop('tagName');
                if (!input.hasClass('form-control') && (tagName === 'INPUT' || tagName === 'TEXTAREA')) {
                    input.addClass('form-control');
                }
            }

            scope.$watch(function () {
                var rs = false;
                for (i = 0; i < inputElms.length; i++) {
                    var item = inputElms[i];
                    var inputName = item.attr('name');
                    if (formCtrl && formCtrl[inputName]) {
                        rs = (formCtrl.$submitted || formCtrl[inputName].$dirty) && formCtrl[inputName].$invalid;
                        if (rs) {
                            break;
                        }
                    }
                }
                return rs;
            }, function (invalid) {
                element.toggleClass('has-error', invalid);
            });

            function main (inp) {
                var inputName = inp.attr('name');
                var str = '<div ng-if="' + formCtrl.$name + '.$submitted || ';
                str += formCtrl.$name + '.' + inputName + '.$dirty" ';
                str += 'ng-messages="' + formCtrl.$name + '.' + inputName + '.$error">';
                str += '<div ng-messages-include="components/widget/form/validation-messages.html"></div>';
                str += '</div>';
                var ngMessages = $compile(str)(scope);
                var parentInp = inp.parent();
                if (parentInp.hasClass('input-group')) {
                    parentInp = parentInp.parent();
                }
                parentInp.append(ngMessages);
            }
        }
    }
})();
