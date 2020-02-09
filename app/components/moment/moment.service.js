(function () {
    'use strict';

    angular
        .module('lnc.moment')
        .factory('lncMoment', lncMoment);

    function lncMoment() {
        // Default settings
        var defaultLocale = 'en';
        var defaultTimezone = 'Asia/Ho_Chi_Minh';
        var defaultDateFormat = 'YYYY-MM-DD';
        var defaultTimeFormat = 'HH:mm:ss';
        var defaultDateTimeFormat = defaultDateFormat + ' ' + defaultTimeFormat;

        moment.locale(defaultLocale);
        moment.tz.setDefault(defaultTimezone);

        var datePatterns = [
            'YYYY', 'YY', 'M', 'MM', 'D', 'DD'
        ];
        var timePatterns = [
            'H', 'HH', 'h', 'hh', 'a', 'A', 'm', 'mm', 's', 'ss'
        ];
        var ADD_TIME_PATTERNS = [
            'years', 'y', 'quarters', 'Q', 'months', 'M', 'weeks', 'w', 'days', 'd', 'hours', 'h',
            'minutes', 'm', 'seconds', 's', 'milliseconds', 'ms'
        ];

        /*
         var datePatterns = [
         'YYYY', 'YY', 'Q', 'M', 'MM', 'MMM', 'MMMM', 'D', 'DD', 'Do', 'DDD', 'DDDD', 'X', 'XX',
         'gggg', 'gg', 'w', 'ww', 'e', 'ddd', 'dddd', 'GGGG', 'GG', 'W', 'WW', 'E'
         ];
         var timePatterns = [
         'H', 'HH', 'h', 'hh', 'a', 'A', 'm', 'mm', 's', 'ss', 'S', 'SS', 'SSS', 'SSSS', 'Z', 'ZZ'
         ];
         */

        return {
            setAll: setAll,
            setLocale: setLocale,
            getLocale: getLocale,
            setTimezone: setTimezone,
            getTimezone: getTimezone,
            now: now,
            ago: ago,
            setDateFormat: setDateFormat,
            getDateFormat: getDateFormat,
            setTimeFormat: setTimeFormat,
            getTimeFormat: getTimeFormat,
            setDateTimeFormat: setDateTimeFormat,
            getDateTimeFormat: getDateTimeFormat,
            resetDateTimeFormat: resetDateTimeFormat,
            secondFromStr: secondFromStr,
            fromSecond: fromSecond,
            second: second,
            secondFromDate: secondFromDate,
            dateStr: dateStr,
            dateTimeStr: dateTimeStr,
            currentDate: currentDate,
            currentTime: currentTime,
            getPattern: getPattern,
            validDateFormat: validDateFormat,
            validTimeFormat: validTimeFormat,
            getCurrentDateTime: getCurrentDateTime,
            compareToNow: compareToNow,
            addTime: _addTime
        };

        function setAll(data) {
            if (lnc.hasValue(data.locale)) {
                setLocale(data.locale);
            }
            if (lnc.hasValue(data.timeZone)) {
                setTimezone(data.timeZone);
            }
            if (lnc.hasValue(data.dateFormat)) {
                setDateFormat(data.dateFormat);
            }
            if (lnc.hasValue(data.timeFormat)) {
                setTimeFormat(data.timeFormat);
            }
        }

        function setLocale(locale) {
            if (lnc.hasValue(locale)) {
                defaultLocale = locale;
                moment.locale(locale);
            }
        }

        function getLocale() {
            return defaultLocale;
        }

        function setTimezone(timezone) {
            if (lnc.hasValue(timezone)) {
                defaultTimezone = timezone;
                moment.tz.setDefault(timezone);
            }
        }

        function getTimezone() {
            return defaultTimezone;
        }

        function now() {
            return moment.format();
        }

        function ago(data) {
            return moment(data).fromNow();
        }

        function setDateFormat(val) {
            if (lnc.hasValue(val)) {
                defaultDateFormat = val;
                resetDateTimeFormat();
            }
        }

        function getDateFormat() {
            return defaultDateFormat;
        }

        function setTimeFormat(val) {
            if (lnc.hasValue(val)) {
                defaultTimeFormat = val;
                resetDateTimeFormat();
            }
        }

        function getTimeFormat() {
            return defaultTimeFormat;
        }

        function setDateTimeFormat(d, t) {
            if (lnc.hasValue(d)) {
                defaultDateFormat = d;
            }
            if (lnc.hasValue(t)) {
                defaultTimeFormat = t;
            }
            resetDateTimeFormat();
        }

        function getDateTimeFormat() {
            return defaultDateTimeFormat;
        }

        function resetDateTimeFormat() {
            defaultDateTimeFormat = defaultDateFormat + ' ' + defaultTimeFormat;
        }

        function secondFromStr(obj, format) {
            var curFormat = format || defaultDateTimeFormat;
            return moment(obj, curFormat).valueOf();
        }

        function fromSecond(seconds) {
            return moment(seconds);
        }

        function second(obj) {
            return moment(obj).valueOf();
        }

        function secondFromDate(obj, format) {
            var curFormat = format || defaultDateFormat;
            return moment(obj, curFormat).valueOf();
        }

        function dateStr(miliseconds, format) {
            var curFormat = format || defaultDateFormat;
            return moment(miliseconds).format(curFormat);
        }

        function dateTimeStr(miliseconds, format) {
            var curFormat = defaultDateTimeFormat;
            if (lnc.hasValue(format)) {
                curFormat = format;
            }
            return moment(miliseconds).format(curFormat);
        }

        function currentDate(dateFormat) {
            var rs;
            if (lnc.hasValue(dateFormat) && validDateFormat(dateFormat)) {
                rs = moment().format(dateFormat);
            } else {
                rs = moment().format(defaultDateFormat);
            }
            return rs;
        }

        function currentTime(timeFormat) {
            var rs;
            if (lnc.hasValue(timeFormat) && validTimeFormat(timeFormat)) {
                rs = moment().format(timeFormat);
            } else {
                rs = moment().format(defaultTimeFormat);
            }
            return rs;
        }

        function getPattern(form) {
            var tmp = form.split(/[^A-Za-z]/),
                input = [];
            for (var i in tmp) {
                if (lnc.hasValue(tmp[i])) {
                    if (tmp[i].length > 1) {
                        input = sameChar(tmp[i], input);
                    } else {
                        input.push(tmp[i]);
                    }
                }
            }
            return input;
        }

        function sameChar(str, rs) {
            if (lnc.hasValue(str) && str.length > 1) {
                var tmp = str.split(''),
                    tmpStr = '',
                    a = tmp[0],
                    size = tmp.length;
                for (var i = 0; i < size; i++) {
                    if (a !== tmp[i]) {
                        if (a === 'D' && tmp[i] === 'o' && (tmpStr === 'D' || tmpStr === 'DDDDD')) {
                            if (tmpStr === 'D') {
                                tmpStr += tmp[i];
                                rs.push(angular.copy(tmpStr));
                            } else {
                                tmpStr = tmpStr.substring(1);
                                rs.push(angular.copy(tmpStr));
                                tmpStr = a + tmp[i];
                                rs.push(angular.copy(tmpStr));
                            }
                            a = tmp[i + 1];
                            tmpStr = '';
                        } else {
                            rs.push(angular.copy(tmpStr));
                            a = tmp[i];
                            tmpStr = a;
                        }
                    } else {
                        tmpStr += a;
                    }
                    if (i === tmp.length - 1) {
                        if (lnc.hasValue(tmpStr)) {
                            rs.push(angular.copy(tmpStr));
                        }
                    }
                }
            } else if (lnc.hasValue(str)) {
                rs.push(str);
            }
            return rs;
        }

        function validPattern(p, patterns) {
            var flag = false,
                size = p.length;

            for (var x = 0; x < size; x++) {
                for (var i in patterns) {
                    if (p[x] === patterns[i]) {
                        flag = true;
                        break;
                    }
                }
                if (flag && x < size - 1) {
                    flag = false;
                } else {
                    break;
                }
            }

            return flag;
        }

        function validDateFormat(dateFormat) {
            var patterns = getPattern(dateFormat);
            return validPattern(patterns, datePatterns);
        }

        function validTimeFormat(timeFormat) {
            var patterns = getPattern(timeFormat);
            return validPattern(patterns, timePatterns);
        }

        function getCurrentDateTime() {
            return moment().valueOf();
        }

        function compareToNow(obj, type, isScaled) {
            return moment(obj).diff(moment(), type, isScaled);
        }

        function _addTime(obj, value, type) {
            if (lnc.hasValue(obj)
                && lnc.hasValue(value)
                && ADD_TIME_PATTERNS.indexOf(type) !== -1) {
                return moment(obj).add(value, type);
            }
            return obj;
        }
    }

})();
