(function () {
    'use strict';
    angular.module('lnc.moment').filter('lncDate', lncDate);

    lncDate.$inject = ['lncMoment'];

    function lncDate (lncMoment) {
        return function (data) {
            if (lnc.hasValue(data)) {
                return lncMoment.dateStr(data);
            }
            return '';
        };
    }

    angular.module('lnc.moment').filter('lncDatetime', lncDatetime);

    lncDatetime.$inject = ['lncMoment'];

    function lncDatetime (lncMoment) {
        return function (data) {
            if (lnc.hasValue(data)) {
                return lncMoment.dateTimeStr(data);
            }
            return '';

        };
    }

    angular.module('lnc.moment').filter('lncAgo', lncAgo);

    lncAgo.$inject = ['lncMoment'];

    function lncAgo (lncMoment) {
        return function (data) {
            if (lnc.hasValue(data)) {
                return lncMoment.ago(data);
            }
            return '';
        };
    }

    angular.module('lnc.moment').filter('lncCurrentDate', lncCurrentDate);

    lncCurrentDate.$inject = ['lncMoment'];

    function lncCurrentDate (lncMoment) {
        return function (dateFormat) {
            return lncMoment.currentDate(dateFormat);
        };
    }

    angular.module('lnc.moment').filter('lncCurrentTime', lncCurrentTime);

    lncCurrentTime.$inject = ['lncMoment'];

    function lncCurrentTime (lncMoment) {
        return function (timeFormat) {
            return lncMoment.currentTime(timeFormat);
        };
    }
})();
