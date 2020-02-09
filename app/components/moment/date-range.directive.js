(function () {
    'use strict';

    angular
        .module('lnc.moment')
        .directive('lncDateRange', lncDateRange);

    lncDateRange.$inject = ['lncMoment', '$log', '$timeout'];

    function lncDateRange(lncMoment, $log, $timeout) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: true,
            priority: 2,
            templateUrl: 'components/moment/date-range.tpl.html',
            link: linkFunc
        };

        ////////////////

        function linkFunc(scope, element, attrs, ctrl) {
            var dateTimeRangePicker;
            var option = {
                'showDropdowns': true,
                'autoApply': true,
                'linkedCalendars': false,
                'autoUpdateInput': false,
                'locale': {
                    'format': lncMoment.getDateFormat(),
                    'separator': ' - ',
                    'applyLabel': 'Apply',
                    'cancelLabel': 'Cancel',
                    'fromLabel': 'From',
                    'toLabel': 'To',
                    'customRangeLabel': 'Custom',
                    'daysOfWeek': [
                        'Su',
                        'Mo',
                        'Tu',
                        'We',
                        'Th',
                        'Fr',
                        'Sa'
                    ],
                    'monthNames': [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ],
                    'firstDay': 1
                }
            };

            element.daterangepicker(option, function (start, end, label) {
                $log.info('Start: ' + start);
                $log.info('end: ' + end);
                $log.info('label: ' + label);
                $timeout(function () {
                    ctrl.$setViewValue({
                        from: start.valueOf(),
                        to: end.valueOf()
                    });
                });
            });
            dateTimeRangePicker = element.data('daterangepicker');

            ctrl.$parsers.push(function (viewValue) {
                element.val(getViewValue(viewValue));
                return viewValue;
            });

            ctrl.$formatters.push(function (modelValue) {
                $log.info('Set date from model: ');
                $log.info(modelValue);

                if (modelValue) {
                    var from = modelValue.from ? lncMoment
                        .fromSecond(modelValue.from) : '';
                    var to = modelValue.to ? lncMoment.fromSecond(modelValue.to) : '';

                    dateTimeRangePicker.setStartDate(from);
                    dateTimeRangePicker.setEndDate(to);
                }

                return getViewValue(modelValue);
            });

            function getViewValue(value) {
                var rs = '';
                if (value) {
                    var from = value.from ? lncMoment.dateStr(value.from) : '';
                    var to = value.to ? lncMoment.dateStr(value.to) : '';
                    rs = from + ' - ' + to;
                }

                return rs;
            }
        }
    }
})();
