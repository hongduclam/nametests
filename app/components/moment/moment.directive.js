(function () {
    'use strict';
    angular
        .module('lnc.moment')
        .config(logProvider);

    logProvider.$inject = ['$logProvider'];

    function logProvider($logProvider) {
        $logProvider.debugEnabled(false);
    }

    // factory
    angular
        .module('lnc.moment')
        .factory('lncDatetime', lncDatetimeFact);

    lncDatetimeFact.$inject = ['$locale', 'lncMoment'];

    function lncDatetimeFact($locale, lncMoment) {
        // Fetch date and time formats from $locale service
        var formats = $locale.DATETIME_FORMATS;
        // Valid format tokens. 1=sss, 2=''
        // var tokenRE =
        // /yyyy|yy|y|M{1,4}|dd?|EEEE?|HH?|hh?|mm?|ss?|([.,])sss|a|Z|ww|w|'(([^']+|'')*)'/g;
        var tokenRE = /YYYY|YY|M{1,4}|DD?|HH?|hh?|mm?|ss?|SS?|([.,])SSS|a|Z|ww|w|'(([^']+|'')*)'/g;
        // Token definition
        var definedTokens = {
            'YY': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 99,
                name: 'year',
                type: 'number',
                mask: 'YY'
            },
            'yy': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 99,
                name: 'year',
                type: 'number',
                mask: 'yy'
            },
            'YYYY': {
                minLength: 4,
                maxLength: 4,
                min: 1,
                max: 9999,
                name: 'year',
                type: 'number',
                mask: 'YYYY'
            },
            'yyyy': {
                minLength: 4,
                maxLength: 4,
                min: 1,
                max: 9999,
                name: 'year',
                type: 'number',
                mask: 'yyyy'
            },
            'MM': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 12,
                name: 'month',
                type: 'number',
                mask: 'MM'
            },
            'M': {
                minLength: 1,
                maxLength: 2,
                min: 1,
                max: 12,
                name: 'month',
                type: 'number',
                mask: 'M'
            },
            'DD': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 31,
                name: 'date',
                type: 'number',
                mask: 'DD'
            },
            'dd': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 31,
                name: 'date',
                type: 'number',
                mask: 'dd'
            },
            'D': {
                minLength: 1,
                maxLength: 2,
                min: 1,
                max: 31,
                name: 'date',
                type: 'number',
                mask: 'D'
            },
            'd': {
                minLength: 1,
                maxLength: 2,
                min: 1,
                max: 31,
                name: 'date',
                type: 'number',
                mask: 'd'
            },
            'HH': {
                minLength: 2,
                maxLength: 2,
                min: 0,
                max: 23,
                name: 'hour',
                type: 'number',
                mask: 'HH'
            },
            'H': {
                minLength: 1,
                maxLength: 2,
                min: 0,
                max: 23,
                name: 'hour',
                type: 'number',
                mask: 'H'
            },
            'hh': {
                minLength: 2,
                maxLength: 2,
                min: 1,
                max: 12,
                name: 'hour12',
                type: 'number',
                mask: 'hh'
            },
            'h': {
                minLength: 1,
                maxLength: 2,
                min: 1,
                max: 12,
                name: 'hour12',
                type: 'number',
                mask: 'h'
            },
            'mm': {
                minLength: 2,
                maxLength: 2,
                min: 0,
                max: 59,
                name: 'minute',
                type: 'number',
                mask: 'mm'
            },
            'm': {
                minLength: 1,
                maxLength: 2,
                min: 0,
                max: 59,
                name: 'minute',
                type: 'number',
                mask: 'm'
            },
            'ss': {
                minLength: 2,
                maxLength: 2,
                min: 0,
                max: 59,
                name: 'second',
                type: 'number',
                mask: 'ss'
            },
            's': {
                minLength: 1,
                maxLength: 2,
                min: 0,
                max: 59,
                name: 'second',
                type: 'number',
                mask: 's'
            },
            'sss': {
                minLength: 3,
                maxLength: 3,
                min: 0,
                max: 999,
                name: 'millisecond',
                type: 'number',
                mask: 'sss'
            },
            'string': {
                name: 'string',
                type: 'static'
            }
        };

        // Use localizable formats
        function getFormat(format) {
            return formats[format] || format;
        }

        function createNode(token, value) {
            var node = {
                token: definedTokens[token],
                value: value,
                viewValue: value || '',
                originalValue: value || '',
                offset: 0,
                caretPos: 0,
                isValid: false
            };
            node.reloadOffset = function () {
                var i = 0;
                if (angular.isObject(node.prev) && angular.isDefined(node.prev.viewValue)) {
                    i = i + node.prev.viewValue.length + node.prev.reloadOffset();
                }
                node.offset = i;
                return i;
            };
            node.analysis = function (obj, pos) {
                var result = false;
                var objVal = parseInt(obj);
                var objVal0;
                var len = pos;
                if (node.token.mask === 'M' || node.token.mask === 'MM') {
                    if (len >= 2) {
                        len = 0;
                    }
                    if (len === 0) {
                        if (objVal <= 1) {
                            result = true;
                        }
                    } else if (len === 1) {
                        objVal0 = parseInt(node.originalValue[0]);
                        if ((objVal0 === 1 && objVal <= 2) || (objVal0 === 0 && objVal > 0)) {
                            result = true;
                        }
                    }
                } else if (node.token.mask === 'D' || node.token.mask === 'DD' || node.token.mask === 'd' || node.token.mask === 'dd') {
                    if (len === 0) {
                        if (objVal <= 3) {
                            result = true;
                        }
                    } else if (len === 1) {
                        objVal0 = parseInt(node.originalValue[0]);
                        if ((objVal0 === 3 && objVal <= 1) || (objVal0 === 0 && objVal > 0) || (objVal0 > 0 && objVal0 < 3)) {
                            result = true;
                        }
                    }
                } else if (node.token.mask === 'Y' || node.token.mask === 'YY' || node.token.mask === 'YYYY') {
                    if (len === 0) {
                        if (objVal > 0) {
                            result = true;
                        }
                    } else {
                        result = true;
                    }
                } else {
                    result = true;
                }
                return result;
            };
            return node;
        }

        // Parse format to nodes
        function createNodes(format) {
            var nodes = [],
                pos = 0,
                match;
            do {
                match = tokenRE.exec(format);
                if (!match) {
                    if (pos < format.length) {
                        nodes.push(createNode('string', format.substring(pos)));
                    }
                    break;
                } else {
                    if (match.index > pos) {
                        nodes.push(createNode('string', format.substring(pos, match.index)));
                        pos = match.index;
                    }
                    if (match.index === pos) {
                        if (match[1]) {
                            nodes.push(createNode('string', match[1]));
                            nodes.push(createNode('sss'));
                        } else if (match[2]) {
                            nodes.push(createNode('string', match[2].replace(' ', '')));
                        } else {
                            nodes.push(createNode(match[0]));
                        }
                        pos = tokenRE.lastIndex;
                    }
                }
            }
            while (match);
            // Build relationship between nodes
            var i;
            for (i = 0; i < nodes.length; i++) {
                nodes[i].next = nodes[i + 1] || null;
                nodes[i].prev = nodes[i - 1] || null;
                nodes[i].id = i;
            }
            return nodes;
        }

        function getInteger(str, pos) {
            str = str.substring(pos);
            var match = str.match(/^\d+/);
            return match && match[0];
        }

        function getMatch(str, pos, pattern) {
            var i = 0,
                strQ = str.toUpperCase(),
                patternQ = pattern.toUpperCase();
            while (strQ[pos + i] && strQ[pos + i] === patternQ[i]) {
                i++;
            }
            return str.substr(pos, i);
        }

        function getWeek(date) {
            var yearStart = new Date(date.getFullYear(), 0, 1);
            var weekStart = new Date(yearStart.getTime());
            if (weekStart.getDay() > 4) {
                weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()) + 7);
            } else {
                weekStart.setDate(weekStart.getDate() + (1 - weekStart.getDay()));
            }
            var diff = date.getTime() - weekStart.getTime();
            return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
        }

        function num2str(num, minLength, maxLength) {
            var i;
            num = '' + num;
            if (num.length > maxLength) {
                num = num.substr(num.length - maxLength);
            } else if (num.length < minLength) {
                for (i = num.length; i < minLength; i++) {
                    num = '0' + num;
                }
            }
            return num;
        }

        function setText(node, date, token) {
            switch (token.name) {
                case 'year':
                    node.value = date.getFullYear();
                    break;
                case 'month':
                    node.value = date.getMonth() + 1;
                    break;
                case 'date':
                    node.value = date.getDate();
                    break;
                case 'day':
                    node.value = date.getDay() || 7;
                    break;
                case 'hour':
                    node.value = date.getHours();
                    break;
                case 'hour12':
                    node.value = date.getHours() % 12 || 12;
                    break;
                case 'ampm':
                    node.value = date.getHours() < 12 ? 1 : 2;
                    break;
                case 'minute':
                    node.value = date.getMinutes();
                    break;
                case 'second':
                    node.value = date.getSeconds();
                    break;
                case 'millisecond':
                    node.value = date.getMilliseconds();
                    break;
                case 'week':
                    node.value = getWeek(date);
                    break;

                // no default
            }
            if (node.value < 0) {
                node.value = 0;
            }
            switch (token.type) {
                case 'number':
                    node.viewValue = num2str(node.value, token.minLength, token.maxLength);
                    break;
                case 'select':
                    node.viewValue = token.select[node.value - 1];
                    break;
                default:
                    node.viewValue = node.value + '';
            }
        }

        // set the proper date value matching the weekday
        function setDay(date, day) {
            // we don't want to change month when changing date
            var month = date.getMonth(),
                diff = day - (date.getDay() || 7);
            // move to correct date
            date.setDate(date.getDate() + diff);
            // check month
            if (date.getMonth() !== month) {
                if (diff > 0) {
                    date.setDate(date.getDate() - 7);
                } else {
                    date.setDate(date.getDate() + 7);
                }
            }
        }

        function setHour12(date, hour) {
            hour = hour % 12;
            if (date.getHours() >= 12) {
                hour += 12;
            }
            date.setHours(hour);
        }

        function setAmpm(date, ampm) {
            var hour = date.getHours();
            if ((hour < 12) === (ampm > 1)) {
                date.setHours((hour + 12) % 24);
            }
        }

        function setDate(date, value, token) {
            switch (token.name) {
                case 'year':
                    date.setFullYear(value);
                    break;
                case 'month':
                    date.setMonth(value - 1);
                    break;
                case 'date':
                    date.setDate(value);
                    break;
                case 'day':
                    setDay(date, value);
                    break;
                case 'hour':
                    date.setHours(value);
                    break;
                case 'hour12':
                    setHour12(date, value);
                    break;
                case 'ampm':
                    setAmpm(date, value);
                    break;
                case 'minute':
                    date.setMinutes(value);
                    break;
                case 'second':
                    date.setSeconds(value);
                    break;
                case 'millisecond':
                    date.setMilliseconds(value);
                    break;
                case 'week':
                    date.setDate(date.getDate() + (value - getWeek(date)) * 7);
                    break;

                // no default
            }
            if (date.getFullYear() < 0) {
                date.setFullYear(0);
            }
        }

        // Re-calculate offset
        function calcOffset(nodes) {
            var i, offset = 0;
            for (i = 0; i < nodes.length; i++) {
                nodes[i].offset = offset;
                offset += nodes[i].viewValue.length;
            }
        }

        function parseNode(node, text, pos) {
            var result = false;
            var p = node,
                m, match, value, j;
            switch (p.token.type) {
                case 'static':
                    if (text.lastIndexOf(p.value, pos) !== pos) {
                        throw {
                            code: 'TEXT_MISMATCH',
                            message: 'Pattern value mismatch',
                            text: text,
                            node: p,
                            pos: pos
                        };
                    }
                    result = true;
                    break;
                case 'number':
                    // Fail when meeting .sss
                    value = getInteger(text, pos);
                    if (value === null) {
                        throw {
                            code: 'NUMBER_MISMATCH',
                            message: 'Invalid number',
                            text: text,
                            node: p,
                            pos: pos
                        };
                    }
                    p.originalValue = value;
                    /*
                     * Check value is valid or not
                     */
                    p.isValid = false;
                    if (value.length < p.token.minLength) {
                        value = (value + p.token.mask).substring(0, p.token.minLength);
                    } else if (value.length > p.token.maxLength) {
                        value = value.substr(0, p.token.maxLength);
                    } else {
                        p.value = Number(value);
                        result = true;
                        p.isValid = true;
                    }
                    p.viewValue = value;
                    break;
                case 'select':
                    match = '';
                    for (j = 0; j < p.token.select.length; j++) {
                        m = getMatch(text, pos, p.token.select[j]);
                        if (m && m.length > match.length) {
                            value = j;
                            match = m;
                        }
                    }
                    if (!match) {
                        throw {
                            code: 'SELECT_MISMATCH',
                            message: 'Invalid select',
                            text: text,
                            node: p,
                            pos: pos
                        };
                    }
                    if (match !== p.token.select[value]) {
                        throw {
                            code: 'SELECT_INCOMPLETE',
                            message: 'Incomplete select',
                            text: text,
                            node: p,
                            pos: pos,
                            match: match,
                            selected: p.token.select[value]
                        };
                    }
                    p.value = value + 1;
                    p.viewValue = match;
                    result = true;
                    break;
                case 'regex':
                    m = p.regex.exec(text.substr(pos));
                    if (!m || m.index !== 0) {
                        throw {
                            code: 'REGEX_MISMATCH',
                            message: 'Regex doesn\'t match',
                            text: text,
                            node: p,
                            pos: pos
                        };
                    }
                    p.value = m[0];
                    p.viewValue = m[0];
                    result = true;
                    break;

                // no default
            }
            return result;
        }

        // Main parsing loop. Loop through nodes, parse text, update date
        // model.
        function parseLoop(nodes, text, date) {
            var i, pos = 0;
            var lastRs = true;
            var parseRs = true;
            // For checking parse all success, then need
            // to parse to date object, else we let it
            // as string
            for (i = 0; i < nodes.length; i++) {
                try {
                    if (nodes[i].token.type !== 'static' && angular.isDefined(nodes[i].token.mask)) {
                        nodes[i].viewValue = nodes[i].token.mask;
                    }
                    if (lastRs) {
                        var parseNodeRs = parseNode(nodes[i], text, pos);
                        if (parseNodeRs) {
                            setDate(date, nodes[i].value, nodes[i].token);
                        }
                        parseRs = parseNodeRs && parseRs;
                        pos += nodes[i].originalValue.length;
                    }
                } catch (err) {
                    parseRs = false;
                    lastRs = false;
                }
            }
            nodes[nodes.length - 1].reloadOffset();
            return parseRs;
        }

        function createParser(format) {
            format = getFormat(format);
            var nodes = createNodes(format);
            var parser = {
                parse: function (text) {
                    var date = new Date();
                    try {
                        parser.isValid = parseLoop(parser.nodes, text, date);
                        if (parser.isValid) {
                            parser.setDate(date);
                        }
                    } catch (err) {
                        throw err;
                    }
                    return parser;
                },
                parseNode: function (node, text) {
                    var date = new Date(parser.date.getTime());
                    try {
                        parseNode(node, text, 0);
                    } catch (err) {
                        parser.setDate(parser.date);
                        throw err;
                    }
                    setDate(date, node.value, node.token);
                    parser.setDate(date);
                    return parser;
                },
                setDate: function (date) {
                    parser.date = date;
                    var i, node;
                    for (i = 0; i < parser.nodes.length; i++) {
                        node = parser.nodes[i];
                        setText(node, date, node.token);
                    }
                    calcOffset(parser.nodes);
                    return parser;
                },
                getDate: function () {
                    return parser.date;
                },
                getMillisecond: function () {
                    var date = parser.date;
                    return lncMoment.second({
                        y: date.getFullYear(),
                        M: date.getMonth(),
                        d: date.getDate(),
                        h: date.getHours(),
                        m: date.getMinutes(),
                        s: date.getSeconds(),
                        ms: date.getMilliseconds()
                    });
                },
                getText: function () {
                    var i, text = '';
                    for (i = 0; i < parser.nodes.length; i++) {
                        text += parser.nodes[i].viewValue;
                    }
                    return text;
                },
                date: new Date(),
                format: format,
                nodes: nodes,
                error: null,
                isValid: false
            };
            return parser;
        }

        return createParser;
    }

    // directive
    angular.module('lnc.moment').directive('lncDatetime', lncDatetime);

    lncDatetime.$inject = ['lncDatetime', '$log', 'lncMoment', '$timeout'];

    function lncDatetime(datetime, $log, lncMoment, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            link: linkFunc,
            templateUrl: 'components/moment/input-datetime.tpl.html'
        };

        /* eslint-disable */
        function getInputSelectionIE(input) {
            var bookmark = document.selection.createRange().getBookmark();
            var range = input.createTextRange();
            var range2 = range.duplicate();
            range.moveToBookmark(bookmark);
            range2.setEndPoint('EndToStart', range);
            var start = range2.text.length;
            var end = start + range.text.length;
            return {
                start: start,
                end: end
            };
        }

        function getInputSelection(input) {
            input = input[0];
            if (input.selectionStart !== 'undefined' && input.selectionEnd !== 'undefined') {
                return {
                    start: input.selectionStart,
                    end: input.selectionEnd
                };
            }
            if (document.selection) {
                return getInputSelectionIE(input);
            }
        }

        /* eslint-enable */
        function getInitialNode(nodes) {
            return getNode(nodes[0]);
        }

        function setInputSelectionIE(input, range) {
            var select = input.createTextRange();
            select.moveStart('character', range.start);
            select.collapse();
            select.moveEnd('character', range.end - range.start);
            select.select();
        }

        function setInputSelection(input, range) {
            input = input[0];
            if (input.setSelectionRange) {
                input.setSelectionRange(range.start, range.end);
            } else if (input.createTextRange) {
                setInputSelectionIE(input, range);
            }
        }

        function getNode(node, direction) {
            if (!direction) {
                direction = 'next';
            }
            while (node && (node.token.type === 'static' || node.token.type === 'regex')) {
                node = node[direction];
            }
            return node;
        }

        function addDate(date, token, diff) {
            switch (token.name) {
                case 'year':
                    date.setFullYear(date.getFullYear() + diff);
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + diff);
                    break;
                case 'date':
                case 'day':
                    date.setDate(date.getDate() + diff);
                    break;
                case 'hour':
                case 'hour12':
                    date.setHours(date.getHours() + diff);
                    break;
                case 'ampm':
                    date.setHours(date.getHours() + diff * 12);
                    break;
                case 'minute':
                    date.setMinutes(date.getMinutes() + diff);
                    break;
                case 'second':
                    date.setSeconds(date.getSeconds() + diff);
                    break;
                case 'millisecond':
                    date.setMilliseconds(date.getMilliseconds() + diff);
                    break;
                case 'week':
                    date.setDate(date.getDate() + diff * 7);
                    break;

                // no default
            }
        }

        function getLastNode(node, direction) {
            var lastNode;
            do {
                lastNode = node;
                node = getNode(node[direction], direction);
            } while (node);
            return lastNode;
        }

        function selectRange(range, direction, toEnd) {
            if (!range.node) {
                return;
            }
            if (direction) {
                range.start = 0;
                range.end = 'end';
                if (toEnd) {
                    range.node = getLastNode(range.node, direction);
                } else {
                    range.node = getNode(range.node[direction], direction) || range.node;
                }
            }
            setInputSelection(range.element, {
                start: range.start + range.node.offset,
                end: range.end === 'end' ? range.node.offset + range.node.viewValue.length : range.end + range.node.offset
            });
        }

        function isStatic(node) {
            return node.token.type === 'static' || node.token.type === 'regex';
        }

        function closerNode(range, next, prev) {
            var offset = range.node.offset + range.start,
                disNext = next.offset - offset,
                disPrev = offset - (prev.offset + prev.viewValue.length);
            return disNext <= disPrev ? next : prev;
        }

        function createRange(element, nodes) {
            var prev, next, range;
            range = getRange(element, nodes);
            if (isStatic(range.node)) {
                next = getNode(range.node, 'next');
                prev = getNode(range.node, 'prev');
                if (!next && !prev) {
                    range.node = nodes[0];
                    range.end = 0;
                } else if (!next || !prev) {
                    range.node = next || prev;
                } else {
                    range.node = closerNode(range, next, prev);
                }
            }
            range.start = 0;
            range.end = 'end';
            return range;
        }

        function getRange(element, nodes, node) {
            var selection = getInputSelection(element),
                i, range;
            for (i = 0; i < nodes.length; i++) {
                if (!range && nodes[i].offset + nodes[i].viewValue.length >= selection.start || i === nodes.length - 1) {
                    range = {
                        element: element,
                        node: nodes[i],
                        start: selection.start - nodes[i].offset,
                        end: selection.start - nodes[i].offset
                    };
                    break;
                }
            }
            if (node && range.node.next === node && range.start + range.node.offset === range.node.next.offset) {
                range.node = range.node.next;
                range.start = range.end = 0;
            }
            return range;
        }

        function isRangeCollapse(range) {
            return range.start === range.end || range.start === range.node.viewValue.length && range.end === 'end';
        }

        function isRangeAtEnd(range) {
            var maxLength, len;
            if (!isRangeCollapse(range)) {
                return false;
            }
            maxLength = range.node.token.maxLength;
            len = range.node.viewValue.length;
            if (maxLength && len < maxLength) {
                return false;
            }
            return range.start === len;
        }

        function isNumericKey(e) {
            return (e.keyCode >= 48 && e.keyCode <= 57);
        }

        function getNumberFromKeyCode(e) {
            var rs = -1;
            if (e.keyCode >= 48 && e.keyCode < 96) {
                rs = e.keyCode - 48;
            } else if (e.keyCode >= 96) {
                rs = e.keyCode - 96;
            }

            return rs;
        }

        function linkFunc(scope, element, attrs, ngModel) {
            var lncFormat = '';
            var hasTime = false;
            var isFocus = true;

            if (attrs.datetime !== null && attrs.datetime !== '') {
                lncFormat = attrs.datetime;
            }
            if (lnc.hasValue(attrs.time)) {
                hasTime = true;
            }

            if (!lnc.hasValue(lncFormat)) {
                if (hasTime) {
                    lncFormat = lncMoment.getDateTimeFormat();
                } else {
                    lncFormat = lncMoment.getDateFormat();
                }
            }

            if (!lnc.hasValue(attrs.placeholder)) {
                element.attr('placeholder', lncFormat);
            }

            var parser = datetime(lncFormat);
            // Create the parser
            var range = {
                element: element,
                node: getInitialNode(parser.nodes),
                start: 0,
                end: 'end'
            };

            var caretPos;
            ngModel.$render = function () {
                element.val(ngModel.$viewValue);
            };
            ngModel.$parsers.push(function (viewValue) {
                if (!parser) {
                    return null;
                }
                parser.parse(viewValue);
                scope.$evalAsync(function () {
                    caretPos = getInputSelection(element);
                    /*ngModel.$setViewValue(parser.getText());
                     ngModel.$render();*/
                    if (isFocus) {
                        element.val(parser.getText());
                    } else {
                        element.val(viewValue);
                    }

                    if (caretPos) {
                        setInputSelection(element, caretPos);
                    }
                });
                if (parser.isValid) {
                    //ngModel.$setValidity('datetime', true);
                    return parser.getMillisecond();
                }
                //ngModel.$setValidity('datetime', false);
                return null;
            });
            ngModel.$formatters.push(function (modelValue) {
                if (!modelValue) {
                    //ngModel.$setValidity('datetime', true);
                    return null;
                }
                //ngModel.$setValidity('datetime', true);
                if (angular.isNumber(modelValue)) {
                    var tempDate = new Date(modelValue);
                    parser.setDate(tempDate);
                } else {
                    parser.setDate(modelValue);
                }
                return parser.getText();
            });

            function addNodeValue(node, diff) {
                var date, viewValue;
                date = new Date(parser.date.getTime());
                addDate(date, node.token, diff);
                parser.setDate(date);
                viewValue = parser.getText();
                ngModel.$setViewValue(viewValue);
                range.start = 0;
                range.end = 'end';
                ngModel.$render();
                scope.$apply();
            }

            var waitForClick;
            element.on('keydown keypress mouseup mousedown click focus blur', function (e) {
                switch (e.type) {
                    case 'mousedown':
                        waitForClick = true;
                        break;
                    case 'focus':
                        isFocus = true;
                        e.preventDefault();
                        if (!waitForClick) {
                            /* eslint-disable */
                            setTimeout(function () {
                                selectRange(range);
                            });
                            /* eslint-enable */
                        }
                        break;
                    case 'click':
                        e.preventDefault();
                        waitForClick = false;
                        range = createRange(element, parser.nodes);
                        selectRange(range);
                        break;
                    case 'keydown':
                        switch (e.keyCode) {
                            case 37:
                                // Left
                                e.preventDefault();
                                selectRange(range, 'prev');
                                break;
                            case 39:
                                // Right
                                e.preventDefault();
                                selectRange(range, 'next');
                                break;
                            case 38:
                                // Up
                                e.preventDefault();
                                addNodeValue(range.node, 1);
                                selectRange(range);
                                break;
                            case 40:
                                // Down
                                e.preventDefault();
                                addNodeValue(range.node, -1);
                                selectRange(range);
                                break;
                            case 36:
                                // Home
                                e.preventDefault();
                                selectRange(range, 'prev', true);
                                break;
                            case 35:
                                // End
                                e.preventDefault();
                                selectRange(range, 'next', true);
                                break;
                            // no default
                        }
                        break;
                    case 'keypress':
                        /*
                         * Check key.
                         *
                         * Check range is end.
                         *
                         * check Character at position is valid, example: Date will valid if 1-31, Month 1-12
                         *
                         * - Done, for day and month only.
                         */
                        if (isNumericKey(e)) {
                            var number = getNumberFromKeyCode(e);
                            range = getRange(element, parser.nodes, range.node);
                            if (range.node.analysis(number, range.start)) {
                                /* eslint-disable */
                                setTimeout(function () {
                                    range = getRange(element, parser.nodes, range.node);
                                    if (isRangeAtEnd(range)) {
                                        range.node = getNode(range.node.next) || range.node;
                                        range.start = 0;
                                        range.end = 'end';
                                        range.node.reloadOffset();
                                        selectRange(range);
                                    }
                                });
                                /* eslint-enable */
                            } else {
                                e.preventDefault();
                            }
                        } else {
                            e.preventDefault();
                        }
                        break;
                    case 'blur':
                        isFocus = false;
                        if (!ngModel.$valid || ngModel.$modelValue === null || angular.isUndefined(ngModel.$modelValue)) {
                            $timeout(function () {
                                ngModel.$setViewValue('');
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    }
})();
