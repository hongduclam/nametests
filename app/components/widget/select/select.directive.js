/**
 * LNC Select
 *  - Support single select, multiple select, tagging, remote data.
 *  - Dynamic options
 *  - Support ajax, paging
 *  - Render html
 *  - Event
 *      + OnSelect
 *      + OnRemove
 *
 *  DO NOT USING watch in attribute, same with keyword in Firefox.
 */
(function () {
    'use strict';

    angular
        .module('lnc.input')
        .directive('lncSelect', lncSelect);

    lncSelect.$inject = ['$log', '$interpolate', '$compile', '$timeout', '$q'];

    function lncSelect($log, $interpolate, $compile, $timeout, $q) {

        var parse = {
            template: '',
            placeholder: ''
        };

        var _TYPE = {
            SINGLE: 'single',
            MULTIPLE: 'multiple',
            TAGGING: 'tagging'
        };

        var _METHOD = {
            OPTION: 'options',
            PIPE: 'pipe'
        };

        var MAX_ITEM = 10;

        /* Should use empty value:
         *    SINGLE:
         *      - element.val() => null
         *    MULTIPLE, TAGGING
         *      - element.val() => []
         * */
        var DEFAULT_NOT_SELECTED_VALUE = '';

        return {
            restrict: 'E',
            require: 'ngModel',
            replace: true,
            compile: compile,
            priority: -1,
            scope: {
                pipe: '=?',
                options: '=?',
                notfound: '&',
                onSelect: '&',
                onClose: '&',
                onUnSelect: '&',
                onOpen: '&',
                onChange: '&',
                noSearch: '@',
                attachParent: '@',
                lncWatch: '@'
            },
            controller: 'LncSelectController',
            controllerAs: 'sC',
            bindToController: true,
            template: template
        };

        ////////////////
        function template(element, attrs) {
            var itemTemplate = element.find('item');
            var chooseTemplate = element.find('choose');
            var notfound = element.find('notfound');
            var selectTemplate = '<select class="form-control" {{style}}>{{options}}</select>';
            var options = '';

            parse = {
                option: '',
                choose: '',
                placeholder: '',
                notfound: ''
            };
            if (itemTemplate.length > 0) {
                /**
                 * Options is Object
                 */
                parse.option = {
                    id: itemTemplate.attr('id'),
                    template: itemTemplate.html(),
                    value: itemTemplate.attr('value')
                };
            } else {
                options = element.html();
            }

            if (chooseTemplate.length > 0) {
                parse.choose = chooseTemplate.html();
            }

            if (notfound.length > 0) {
                parse.notfound = notfound.html();
            }

            parse.placeholder = attrs.placeholder || 'Select ...';
            delete attrs.placeholder;

            var style = attrs.style || 'style="width: 100%"';
            var returnTemplate = selectTemplate.replace(/{{options}}/ig, options);
            returnTemplate = selectTemplate.replace(/{{style}}/ig, style);
            return returnTemplate;
        }

        function compile(e, a) {
            /**
             * Using compile function to clone global variable from Template function, this will be same for all
             * directive instance, so need to clone for using local.
             */
            var selectInfo = angular.copy(parse);

            /* Default is single */
            var elementType = a.type || _TYPE.SINGLE;
            if (angular.isDefined(a.multiple)) {
                elementType = _TYPE.MULTIPLE;
            }

            /* Need to set in compile function, before angular linking */
            if (elementType === _TYPE.MULTIPLE || elementType === _TYPE.TAGGING) {
                a.$set('multiple', 'multiple');
            } else if (elementType === _TYPE.SINGLE) {
                e.prepend('<option value="' + DEFAULT_NOT_SELECTED_VALUE + '"></option>');
            }

            return {
                pre: linkFunc
            };

            function linkFunc($scope, element, attrs, ngModel) {
                var LOGTAG = 'SELECT [' + selectInfo.placeholder + ']: ';
                $log.info(LOGTAG + 'LINK START');
                var scope = $scope.sC;

                var eventInternal = false;
                var select2Ready = false;
                var select2OptionReady = false;
                var _options = [];
                var _method = '';

                var tempCurrentValue = null;
                var setValueFn;
                var isTouched = false;

                var watch = {
                    isFirst: true,
                    time: 0,
                    fn: angular.noop,
                    enable: false
                };

                if (angular.isDefined(attrs.options)) {
                    _method = _METHOD.OPTION;
                } else if (angular.isDefined(attrs.pipe)) {
                    _method = _METHOD.PIPE;
                }

                if (elementType !== _TYPE.TAGGING && _method === '') {
                    throw 'Invalid Select';
                }

                var select2Options = {
                    allowClear: attrs.allowClear || false,
                    width: 'resolve',
                    templateResult: templateResult,
                    templateSelection: templateSelection,
                    escapeMarkup: escapeMarkup
                };

                /**
                 * Setup attach parent, auto attach to modal.
                 */
                var parentEls = element.parent('.modal');
                if (parentEls.length) {
                    $log.info(LOGTAG + 'Attach to Modal');
                    select2Options.dropdownParent = parentEls;
                } else if (scope.attachParent) {
                    $log.info(LOGTAG + 'Attach Parent');
                    parentEls = element.parent();
                    if (parentEls.length) {
                        select2Options.dropdownParent = parentEls;
                    }
                }


                /**
                 * set up placeholder
                 */
                if (lnc.hasValue(selectInfo.placeholder)) {
                    if (elementType === _TYPE.SINGLE && lnc.hasValue(selectInfo.option)) {
                        /**
                         * Set up placeholder follow Template
                         */
                        select2Options.placeholder = {
                            id: DEFAULT_NOT_SELECTED_VALUE,
                            text: '<span>' + selectInfo.placeholder + '</span>'
                        };
                    } else {
                        select2Options.placeholder = selectInfo.placeholder;
                    }
                }

                scope.setOptions = setOptions;
                scope.setPipe = setPipe;
                scope.setOptionTemplate = setOptionTemplate;
                scope.setNotFoundTemplate = setNotFoundTemplate;
                scope.setChooseTemplate = setChooseTemplate;
                scope.notFoundAction = notFoundAction;
                scope.setNotFoundCallBack = setNotFoundCallBack;
                scope.setValue = setValue;

                if (lnc.hasValue(scope.options)) {
                    _options = angular.copy(scope.options);
                }

                if (lnc.hasValue(attrs.minimumInputLength)) {
                    select2Options.minimumInputLength = attrs.minimumInputLength;
                }

                if (elementType === _TYPE.TAGGING || elementType === _TYPE.MULTIPLE) {
                    select2Options.tags = true;
                    select2Options.allowClear = false;
                    if (elementType === _TYPE.TAGGING) {
                        select2Options.language = {
                            noResults: function () {
                                return 'Add Tag';
                            }
                        };
                    }

                    if (elementType === _TYPE.MULTIPLE) {
                        select2Options.createTag = function () {
                            return null;
                        };
                    }
                } else if (elementType === _TYPE.SINGLE) {
                    if (lnc.hasValue(scope.notfound)) {
                        templateNotfound();
                        select2Options.language = {
                            noResults: templateNotfound
                        };
                    }
                }

                /* Priority Pipe first, then Options */
                if (_method === _METHOD.PIPE) {
                    select2Options.ajax = {
                        delay: 250,
                        data: function (params) {
                            var q = '';
                            var page = 0;
                            if (lnc.hasValue(params)) {
                                q = params.term || '';
                                if (lnc.hasValue(params.page)) {
                                    page = params.page - 1;
                                }
                            }
                            if (page === 0) {
                                lnc.deleteArray(_options);
                            }
                            return {
                                size: MAX_ITEM,
                                q: q,
                                page: page
                            };
                        },
                        processResults: function (res) {
                            var result = {
                                results: [],
                                pagination: {
                                    more: false
                                }
                            };
                            if (lnc.hasValue(res)) {
                                _options = _options.concat(res.data);
                                if (lnc.hasValue(selectInfo.option)) {
                                    result.results = buildSelect2Options(res.data);
                                }
                                result.pagination.more = res.more;
                            }

                            return result;
                        },
                        transport: function (params, success, failure) {
                            var deferred = $q.defer();
                            if (angular.isFunction(scope.pipe)) {
                                scope.pipe(params.data).then(function (data) {
                                    deferred.resolve(data);
                                }, function (reason) {
                                    deferred.reject(reason);
                                });
                            } else {
                                deferred.resolve(null);
                            }

                            return deferred.promise.then(success, failure);
                        }
                    };
                    /**
                     * In case pipe, no need waiting for Option.
                     * @type {boolean}
                     */
                    select2OptionReady = true;
                } else if (_method === _METHOD.OPTION) {
                    if (angular.isUndefined(scope.noSearch)) {
                        select2Options.minimumResultsForSearch = MAX_ITEM;
                    } else {
                        select2Options.minimumResultsForSearch = Infinity;
                    }

                    if (_options.length) {
                        if (lnc.hasValue(selectInfo.option)) {
                            select2Options.data = buildSelect2Options(_options);
                        } else {
                            /*
                             * Have no option format, this time, option must have format {id, text}
                             * */
                            select2Options.data = _options;
                        }
                        select2OptionReady = true;
                    }

                    watch.enable = angular.isDefined(scope.lncWatch);

                    if (watch.enable) {
                        watch.time = parseInt(scope.lncWatch);

                        watch.fn = $scope.$watchCollection('sC.options', function (newOpts) {
                            $log.info(LOGTAG + 'WATCH got new options, isFirst: ' + watch.isFirst);
                            if (watch.isFirst) {
                                watch.isFirst = false;
                            }
                            setData(newOpts);
                            if (watch.time >= 1 && newOpts && newOpts.length) {
                                $log.info(LOGTAG + 'Un-register watch');
                                watch.fn();
                            }
                            setSelect2Val();
                        });
                    }
                } else if (elementType !== _TYPE.TAGGING) {
                    var numOfOptions = element.find('option[value != ""]');
                    if (numOfOptions.length === 0) {
                        $log.warn('Init Select: ' + element + ' with no option: ' + selectInfo.placeholder);
                        throw 'Init Select without options';
                    }
                }

                /* Format and Parse Model, base on options */
                /* model to view */

                ngModel.$formatters.push(formatModel);

                /* view to model */
                ngModel.$parsers.push(function (value) {
                    $log.info(LOGTAG + 'View To Model: ' + String(value));
                    return fromSelect2Values(value);
                });


                $scope.$on('$destroy', function () {
                    destroySelect2();
                });

                /*
                 * For increase time to render data.
                 *  - Select2 take many time to init.
                 * */
                //$scope.$evalAsync(createSelect2);
                /*$timeout(createSelect2).then(function(){

                 });*/

                createSelect2();

                function setValue(obj) {
                    if (ngModel) {
                        formatModel(obj, true);
                    }
                }

                function formatModel(value, trigger) {
                    $log.info(LOGTAG + 'Model To View: ' + String(value));
                    var viewValue = DEFAULT_NOT_SELECTED_VALUE;
                    if (lnc.hasValue(value)) {
                        viewValue = toSelect2Values(value);
                    }
                    var isDiff = isDifferent(viewValue, element.val());
                    if (isDiff) {
                        if (lnc.hasValue(viewValue)) {
                            if (elementType === _TYPE.TAGGING) {
                                if (angular.isArray(viewValue)) {
                                    /* TAGGING or PIPE with Multiple, value will be array */
                                    for (var i = 0; i < viewValue.length; i++) {
                                        var curOpt = element.find('option[value="' + viewValue[i] + '"]');
                                        if (curOpt.length === 0) {
                                            var tagOpt = new Option(viewValue[i], viewValue[i]);
                                            element.append(tagOpt);
                                        }
                                    }
                                }
                            } else if (_method === _METHOD.PIPE
                                || (_method === _METHOD.OPTION && watch.enable && _options.length === 0)) {
                                /* Select new data:
                                 - PIPE (add new data as option and set it)
                                 - is Option and Watch and not exist option.
                                 */
                                setData(value);
                            }
                        }

                        var vals = angular.isObject(viewValue) ? angular.copy(viewValue) : viewValue;

                        $log.info(LOGTAG + 'select2Ready: ' + select2Ready + '/isTouched: ' + isTouched);
                        if (isTouched || (angular.isDefined(value) && value !== null)) {
                            if (angular.isDefined(value) && value !== null) {
                                isTouched = true;
                            }
                            if (select2Ready && select2OptionReady) {
                                eventInternal = true;
                                $log.info(LOGTAG + 'TimeOut set value: ' + vals);
                                if (trigger) {
                                    $timeout(function () {
                                        element.val(vals).trigger('change');
                                    });
                                } else {
                                    $timeout(function () {
                                        element.val(vals).trigger('change.select2');
                                    });
                                }
                                tempCurrentValue = null;
                            } else {
                                tempCurrentValue = vals;
                            }
                        }
                    }

                    return value;
                }

                function setPipe(fn) {
                    scope.pipe = fn;
                }

                /**
                 * opt {
                 *    id: required
                 *    value: id or null
                 *    template: required (html)
                 * }
                 * @param opt
                 */
                function setOptionTemplate(opt) {
                    selectInfo.option = opt;
                }

                function setChooseTemplate(opt) {
                    selectInfo.choose = opt;
                }

                function setNotFoundTemplate(opt) {
                    selectInfo.notfound = opt;
                    templateNotfound();
                }

                function templateNotfound() {
                    return $compile('<span ng-click="sC.notFoundAction($event)">' + selectInfo.notfound + '</span>')($scope);
                }

                function setNotFoundCallBack(fn) {
                    scope.notfound = fn;
                }

                function notFoundAction(clicke) {
                    $log.info(LOGTAG + 'Not found callback: ' + clicke);
                    element.select2('close');
                    (scope.notfound || angular.noop)({
                        data: clicke
                    });
                }

                function setOptions(opts) {
                    select2OptionReady = false;
                    $q.when(opts, function (val) {
                        setData(val);
                    }).finally(function () {
                        setSelect2Val();
                    });
                }

                function setSelect2Val() {
                    $log.info('SET Temp Value: ' + tempCurrentValue + '/' + select2Ready + '/' + select2OptionReady);
                    if (tempCurrentValue && select2Ready && select2OptionReady) {
                        if (setValueFn) {
                            $timeout.cancel(setValueFn);
                        }

                        setValueFn = $timeout(function () {
                            element.val(tempCurrentValue).trigger('change');
                            tempCurrentValue = null;
                        });
                    }
                }

                function createSelect2() {
                    /**
                     * Fix Remove all tag, (This will be updated on new Select2 version)
                     *
                     *  @link{https://github.com/select2/select2/issues/3354}
                     */
                    $.fn.select2.amd.require(['select2/selection/search', 'select2/selection/allowClear'],
                        function (Search, AllowClear) {
                            var oldRemoveChoice = Search.prototype.searchRemoveChoice;
                            //var oldHandleClear = AllowClear.prototype._handleClear;

                            Search.prototype.searchRemoveChoice = function () {
                                oldRemoveChoice.apply(this, arguments);
                                this.$search.val('');
                            };
                            AllowClear.prototype._handleClear = function (_, evt) {
                                // Ignore the event if it is disabled
                                if (this.options.get('disabled')) {
                                    return;
                                }

                                var $clear = this.$selection.find('.select2-selection__clear');

                                // Ignore the event if nothing has been selected
                                if ($clear.length === 0) {
                                    return;
                                }

                                evt.stopPropagation();

                                var data = $clear.data('data');

                                for (var d = 0; d < data.length; d++) {
                                    var unselectData = {
                                        data: data[d]
                                    };

                                    this.trigger('unselect', unselectData);

                                    // If the event was prevented, don't clear it out.
                                    if (unselectData.prevented) {
                                        return;
                                    }
                                }

                                this.$element.val(this.placeholder.id).trigger('change');
                            };

                            element.select2(select2Options);

                            element.on('select2:open', onOpen);

                            if (angular.isFunction(scope.onSelect)) {
                                element.on('select2:select', onSelect);
                            }

                            if (angular.isFunction(scope.onClose)) {
                                element.on('select2:close', onClose);
                            }
                            if (angular.isFunction(scope.onUnSelect)) {
                                element.on('select2:unselect', onUnSelect);
                            }
                            if (angular.isFunction(scope.onChange)) {
                                element.on('change', onChange);
                            }

                            $log.info(LOGTAG + 'CREATED');
                            select2Ready = true;
                            setSelect2Val();
                        });
                }

                function onChange(select2Event) {
                    if (angular.isFunction(scope.onChange) && !eventInternal) {
                        scope.onChange({
                            event: select2Event
                        });
                    }
                    eventInternal = false;
                }

                function onClose(select2Event) {
                    if (angular.isFunction(scope.onClose)) {
                        scope.onClose({
                            event: select2Event
                        });
                    }
                }

                function onUnSelect(select2Event) {
                    if (angular.isFunction(scope.onUnSelect)) {
                        var data = select2Event.params.data.id || '';
                        var obj = fromSelect2Value(data);
                        scope.onUnSelect({
                            event: select2Event,
                            data: obj
                        });
                    }
                }

                function onOpen(select2Event) {
                    $log.info(LOGTAG + 'SET Touch true');
                    isTouched = true;
                    if (angular.isFunction(scope.onOpen)) {
                        scope.onOpen({
                            event: select2Event
                        });
                    }
                }

                function onSelect(select2Event) {
                    if (angular.isFunction(scope.onSelect) && !eventInternal) {
                        var data = select2Event.params.data.id || '';
                        var obj = fromSelect2Value(data);
                        scope.onSelect({
                            event: select2Event,
                            data: obj
                        });
                    }
                    eventInternal = false;
                }

                function destroySelect2() {
                    $log.info(LOGTAG + 'DESTROY');
                    element.off('select2:select').off('select2:open').off('select2:close').off('select2:unselect');
                    try {
                        element.select2('destroy');
                    } catch (err) {
                        /**
                         * https://github.com/select2/select2/issues/3173
                         */
                        $log.warn(err);
                    }

                }

                function setData(newOpts) {
                    if (!lnc.hasValue(_options)) {
                        _options = [];
                    } else {
                        lnc.deleteArray(_options);
                    }
                    element.find('option[value != ""]').remove();
                    if (lnc.hasValue(newOpts)) {
                        var newOpt;
                        if (angular.isArray(newOpts)) {
                            angular.forEach(newOpts, function (i) {
                                this.push(i);
                            }, _options);

                            angular.forEach(buildSelect2Options(_options), function (i) {
                                newOpt = new Option(i.text, i.id);
                                element.append(newOpt);
                            });
                        } else {
                            _options.push(newOpts);
                            var opt = buildSelect2Option(newOpts);
                            newOpt = new Option(opt.text, opt.id);

                            element.append(newOpt);
                        }
                        select2OptionReady = true;
                    } else {
                        select2OptionReady = false;
                    }
                }

                function escapeMarkup(params) {
                    return params;
                }

                function templateResult(item) {
                    var rs = '';
                    if (item.loading) {
                        rs = item.text;
                    } else {
                        rs = item.text;
                        if (elementType !== _TYPE.TAGGING) {
                            try {
                                rs = angular.element(item.text);
                                if (rs.length === 0) {
                                    rs = item.text;
                                }
                            } catch (err) {
                                $log.info(err);
                            }
                        }
                    }
                    return rs;
                }

                function templateSelection(item) {
                    var rs;
                    if (elementType !== _TYPE.TAGGING) {
                        if (lnc.hasValue(selectInfo.choose)) {
                            if (lnc.hasValue(item) && item.id === '') {
                                /**
                                 * Render Placeholder
                                 */
                                rs = renderHtml(item.text);
                            }
                            var chooseItem = null;
                            try {
                                for (var i = 0; i < _options.length; i++) {
                                    var id = _options[i][selectInfo.option.id].toString();
                                    if (id === item.id) {
                                        chooseItem = _options[i];
                                        break;
                                    }
                                }
                            } catch (err) {
                                $log.info(LOGTAG + 'TemplateSelection: ');
                                $log.info(item);
                            }
                            if (chooseItem !== null) {
                                var htmlStr = $interpolate(selectInfo.choose)(chooseItem);
                                rs = renderHtml(htmlStr);
                            }
                        } else {
                            rs = renderHtml(item.text);
                        }
                    } else {
                        rs = item.text || '';
                    }

                    return rs;
                }

                function renderHtml(obj) {
                    var rs = '';
                    try {
                        rs = angular.element(obj);
                        if (rs.length === 0) {
                            /* Not html string, return text */
                            rs = obj;
                        }
                    } catch (err) {
                        rs = obj;
                    }

                    return rs;
                }

                /**
                 * Using for compare
                 *  - tag array, which have format [string, string, string, string] only. Not for compare
                 *    other kind of array's item.
                 *  - compare two string
                 *
                 * @param obj1
                 * @param obj2
                 * @returns {boolean}
                 */
                function isDifferent(obj1, obj2) {
                    var rs = true;
                    if (!lnc.hasValue(obj1)) {
                        obj1 = null;
                    }
                    if (!lnc.hasValue(obj2)) {
                        obj2 = null;
                    }

                    if (obj1 === obj2) {
                        rs = false;
                    } else if (angular.isArray(obj1) && angular.isArray(obj2)) {
                        if (obj1.length === obj2.length) {
                            var isSame = true;
                            for (var i = 0; i < obj1.length; i++) {
                                var pos = obj2.indexOf(obj1[i]);
                                if (pos === -1) {
                                    isSame = false;
                                    break;
                                }
                            }
                            rs = !isSame;
                        }
                    }

                    return rs;
                }

                function toSelect2Values(val) {
                    /* When no select, select2 value is null */
                    var rs = null;
                    try {
                        if (lnc.hasValue(val)) {
                            if (angular.isArray(val)) {
                                rs = [];
                                for (var i = 0; i < val.length; i++) {
                                    rs.push(toSelect2Value(val[i]));
                                }
                            } else {
                                rs = toSelect2Value(val);
                            }
                        }
                    } catch (err) {
                        $log.error(err);
                    }

                    return rs;
                }

                function toSelect2Value(val) {
                    var rs = DEFAULT_NOT_SELECTED_VALUE;
                    try {
                        if (val && angular.isObject(val)) {
                            rs = val[selectInfo.option.id].toString();
                        } else {
                            rs = val.toString();
                        }
                    } catch (err) {
                        $log.info(LOGTAG + 'toSelect2Value ERROR: ');
                        $log.info(val);
                        $log.info(select2Options.option);
                    }
                    return rs;
                }

                function fromSelect2Values(val) {
                    var rs = val;
                    if (lnc.hasValue(val)) {
                        if (angular.isArray(val)) {
                            rs = [];
                            for (var i = 0; i < val.length; i++) {
                                var valRs = fromSelect2Value(val[i]);
                                if (lnc.hasValue(valRs)) {
                                    rs.push(valRs);
                                }
                            }
                        } else {
                            rs = fromSelect2Value(val);
                        }
                    }

                    return rs;
                }

                function fromSelect2Value(val) {
                    var rs = val;
                    for (var i = 0; i < _options.length; i++) {
                        var item = _options[i];
                        var fieldStr;
                        if (lnc.hasValue(selectInfo.option)) {
                            if (angular.isObject(item)) {
                                fieldStr = item[selectInfo.option.id].toString();
                            } else {
                                fieldStr = item;
                            }

                        } else {
                            fieldStr = item.id;
                        }

                        if (fieldStr === val) {
                            if (lnc.hasValue(selectInfo.option.value) && angular.isObject(item)) {
                                rs = item[selectInfo.option.value];
                            } else {
                                rs = item;
                            }
                        }
                    }

                    return rs;
                }

                function buildSelect2Options(options) {
                    var rs = [];
                    angular.forEach(options, function (item) {
                        var option = buildSelect2Option(item);
                        if (lnc.hasValue(option)) {
                            this.push(option);
                        }
                    }, rs);

                    return rs;
                }

                function buildSelect2Option(option) {
                    var rs = null;
                    try {
                        if (angular.isObject(option)) {
                            rs = {
                                id: option[selectInfo.option.id].toString(),
                                text: $interpolate(selectInfo.option.template)(option)
                            };
                        } else {
                            rs = {
                                id: option,
                                text: option
                            };
                        }

                    } catch (err) {
                        $log.error(err);
                    }

                    return rs;
                }

                $log.info(LOGTAG + 'LINK END');
            }
        }
    }
})();

