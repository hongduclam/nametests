/**
 * @Desc JSON Structure for building columns.
 * search: global search
 *   - undefined: disable
 *   - deep: enable/disable deep search (deep search is columns searching)
 * title: For display on Header.(if no title then get data)
 * data: Model from Server JSON.
 * name: Order by at backend. (if no name, then get data)
 * filter pattern: Using for filter model.
 * If using filter, need to study filter stateful and stateless at
 *  http://blog.thoughtram.io/angularjs/2014/11/19/exploring-angular-1.3-stateful-filters.html
 * search: we define all kind of search as:
 *  - date
 *  - date-range
 *  - select (single)
 *  - select multi
 *  - range (number range)
 * @type {*[]}
 *
 * vm.options = {
        search: {
            global: true/false => Enable global search
            detail: 'panel', 'column' => Enable detail search in dropdown detail or column, in case panel, need to use transclude
        },
        columns: [
            {title: 'Document Id', data: 'documentId', name:'documentId', search: {
                type: 'select',
                directive: {
                    type: 'multiple/single',
                    name: '',
                    method: 'options/pipe'
                },
                options: [
                    {text: 'Enable', id: 1},
                    {text: 'Disabled', id: 0}
                ]
            }},
            {title: 'Warehouse', data: 'warehouseName'},
            {title: 'Type', data: 'type'},
            {title: 'Last Modified Date', data: 'lastModifiedDate'}
        ],
        actions: [
             {
                type: 'edit', => Default support edit, delete
                template: ''
            },
        ]

    };

 Current only support search type: SELECT, INPUT

 Reference:
 {@link http://www.jankoatwarpspeed.com/ultimate-guide-to-table-ui-patterns/}
 {@link http://stackoverflow.com/questions/24615103/angular-directives-when-and-how-to-use-compile-controller-pre-link-and-post}
 {@link http://www.alexkras.com/11-tips-to-improve-angularjs-performance/#debounce}
 {@link http://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives/}
 */
(function () {
    'use strict';

    angular
        .module('lnc.table')
        .directive('lncTable', lncTable);

    lncTable.$inject = ['$compile'];
    function lncTable($compile) {
        var defaultSearch = {
            global: true,
            placeholder: 'Search'
        };

        var searchElementType = {
            select: [
                '<lnc-select {{models}} options="{{selectOpts}}" allow-clear="true">',
                '</lnc-select>'
            ].join(''),
            selectDirective: [
                '<lnc-select {{models}} {{method}} {{directive}} {{type}} allow-clear="true">',
                '</lnc-select>'
            ].join(''),
            input: '<input type="text" class="form-control" {{models}} placeholder="{{placeholder}}"/>',
            dateRange: [
                '<lnc-date-range {{models}}></lnc-date-range>'
            ],
            date: '<lnc-datetime {{models}} placeholder="{{placeholder}}" class="form-control"></lnc-datetime>',
            number: '<lnc-input-number {{models}} class="form-control" placeholder="{{placeholder}}"></lnc-input-number>',
            submit: [
                '<button type="button" class="btn yellow btn-xs" data-ng-click="tb.searchChange()">',
                '<span class="fa fa-search fa-fw" aria-hidden="true"></span>',
                '</button>'
            ].join(''),
            reset: [
                '<button type="button" class="btn red btn-xs" data-ng-click="tb.resetSearch()">',
                '<span class="fa fa-remove fa-fw" aria-hidden="true"></span>',
                '</button>'
            ].join(''),
            editBtn: [
                '<button type="button" class="btn btn-warning btn-xs" lnc-tooltip="Edit" data-type="edit" data-ng-click="tb.rowAction($event, $index)">',
                '<span class="fa fa-edit fa-fw" aria-hidden="true"></span>',
                '</button>'
            ].join(''),
            delBtn: [
                '<button type="button" class="btn red btn-xs" lnc-tooltip="Delete" data-type="delete" data-ng-click="tb.rowAction($event, $index)">',
                '<span class="fa fa-trash fa-fw" aria-hidden="true"></span>',
                '</button>'
            ].join('')
        };

        return {
            restrict: 'E',
            scope: {
                options: '=',
                pipe: '=',
                callback: '&',
                api: '=?',
                lncId: '@?'
            },
            bindToController: true,
            templateUrl: 'components/widget/table/table.tpl.html',
            replace: true,
            controller: 'TableController',
            controllerAs: 'tb',
            link: linkFunc,
            transclude: true
        };

        ////////////////
        /*function compile() {
         return {
         post: function (scope, iElem, iAttrs, ctrl, trans) {
         linkFunc(scope, iElem, iAttrs, ctrl, trans);
         }
         };
         }*/

        function linkFunc(scope, element, attrs, ctrl, trans) {
            var tableOptions = ctrl.options;

            // rowId - used for trackBy row, but wont update if edit row - removed
            //var rowId = tableOptions.columnId || 'id';

            var trF = '<tr class="filter">';
            var trH = '<tr class="heading">';
            var trB = '<tr data-ng-repeat="row in tb.rows">';
            var columns = tableOptions.columns;
            var tableSearchOpt = angular.extend({}, defaultSearch, tableOptions.search);
            var tableActions = lnc.hasValue(tableOptions.actions);
            var transclude;
            //Set place holder for search global
            scope.searchGlobalPlaceholder = tableSearchOpt.placeholder;
            if (tableSearchOpt.detail === 'panel') {
                transclude = trans();
            }

            if (lnc.hasValue(columns)) {
                for (var i = 0; i < columns.length; i++) {
                    var column = columns[i];
                    var columnServerName = column.name || column.data;
                    var columnTitle = column.title || column.data;
                    var columnSearch = column.search;
                    var columnStyle = '';
                    var columnFilter = '';

                    var isSortable = column.sortable || false;
                    var sortableStr = '';
                    if (isSortable) {
                        sortableStr = ' class="sorting" ng-click=\'tb.toggleSort($event, "'
                            + columnServerName + '")\' ng-class=\'{sorting_asc: tb.sorts["'
                            + columnServerName + '"] == 0, sorting_desc: tb.sorts["'
                            + columnServerName + '"] == 1}\'';
                    }

                    if (column.width && column.width.length) {
                        columnStyle = 'style="width: ' + column.width + '"';
                    }

                    if (column.filter && column.filter.length) {
                        columnFilter = ' | ' + column.filter;
                    }

                    trH += '<th ' + columnStyle + sortableStr + '>' + columnTitle + '</th>';
                    if (column.directive) {
                        trB += '<td ' + columnStyle + '">' + column.directive + '</td>';
                    } else if (columnFilter.length) {
                        trB += '<td ' + columnStyle + ' ng-bind-html="::row.' + column.data + columnFilter + '"></td>';
                    } else {
                        trB += '<td ' + columnStyle + ' ng-bind-html="::row.' + column.data + '"></td>';
                    }


                    var searchElement = '';
                    if (lnc.hasValue(columnSearch)) {
                        var searchElsModels, searchElsPlaceholder, searchElsOptions;
                        var searchElsType = 'input';

                        if (angular.isObject(columnSearch)) {
                            searchElsType = columnSearch.type;
                        }

                        searchElsModels = 'ng-model="tb.searches.columns[\'' + columnServerName + '\']"';

                        if (tableSearchOpt.detail === 'column' && !tableActions) {
                            searchElsModels += ' ng-change="tb.searchChange()" ng-model-options="{debounce: 500}"';
                        }

                        switch (searchElsType) {
                            case 'select':
                                var selectDirective = columnSearch.directive || false;
                                if (selectDirective) {
                                    var directiveName = selectDirective.name;
                                    var directiveMethod = selectDirective.method || 'options';
                                    var directiveType = selectDirective.type || '';
                                    searchElement = searchElementType.selectDirective;
                                    searchElement = searchElement.replace(/{{directive}}/ig, directiveName);
                                    searchElement = searchElement.replace(/{{type}}/ig, directiveType);
                                    searchElement = searchElement.replace(/{{method}}/ig, directiveMethod);
                                } else {
                                    searchElsPlaceholder = 'Filter by ' + columnTitle;
                                    searchElsOptions = 'tb.options.columns[' + i + '].search.options';
                                    searchElement = searchElementType.select;
                                    searchElement = searchElement.replace(/{{selectOpts}}/ig, searchElsOptions);
                                }
                                break;
                            case 'date-range':
                                searchElement = searchElementType.dateRange;
                                searchElsPlaceholder = 'Select Date Range';
                                break;
                            default:
                                searchElsPlaceholder = 'Search ' + columnTitle;
                                searchElement = searchElementType.input;
                                break;
                        }

                        searchElement = searchElement.replace(/{{models}}/ig, searchElsModels);
                        searchElement = searchElement.replace(/{{placeholder}}/ig, searchElsPlaceholder);
                    }

                    if (tableSearchOpt.detail === 'panel') {
                        transclude.find('input[name="' + columnServerName + '"]').replaceWith(searchElement);
                    } else if (tableSearchOpt.detail === 'column') {
                        trF += '<td ' + columnStyle + '>' + searchElement + '</td>';
                    }
                }
            }

            if (tableActions) {
                trB += '<td>' + createActionsColumn(tableOptions.actions) + '</td>';
                trF += '<td>' + searchElementType.submit + searchElementType.reset + '</td>';
                trH += '<th>Actions</th>';
            }

            trF += '</tr>';
            trH += '</tr>';
            trB += '</tr>';

            var tplEH = element.find('thead');
            tplEH.append($compile(trH)(scope));

            if (tableSearchOpt.detail === 'panel') {
                /**
                 * Replace submit button.
                 */

                var searchViewActions = transclude.find('.form-actions');
                var searchViewSubmit = searchViewActions.find('button[type="submit"]');
                var searchViewReset = searchViewActions.find('button[type="reset"]');
                if (searchViewSubmit.length) {
                    searchViewSubmit.replaceWith(searchElementType.submit);
                } else {
                    searchViewActions.prepend(searchElementType.submit);
                }

                if (searchViewReset.length) {
                    searchViewReset.replaceWith(searchElementType.reset);
                } else {
                    searchViewActions.append(searchElementType.reset);
                }

                setSearchPanel(element, $compile(transclude)(scope));
            } else if (tableSearchOpt.detail === 'column') {
                tplEH.append($compile(trF)(scope));
            }


            element.find('tbody').append($compile(trB)(scope));

            element.find('thead .heading').on('mousedown', function (e) {
                e.preventDefault();
            });
            element.find('thead .filter').on('keyup', function (e) {
                if (e.altKey && e.keyCode === 13) {
                    e.preventDefault();
                    ctrl.searchChange();
                }
            });

            scope.$on('$destroy', function () {
                element.find('thead .heading').off('mousedown');
                element.find('thead .filter').off('keyup');
            });
        }

        function setSearchPanel(element, searchPanel) {
            var searchView = element.find('.search');
            var searchPanelWidth = searchPanel.attr('width') || '600';
            var dropdown = searchView.find('.dropdown');
            /* Set width to dropdown */
            dropdown.find('.dropdown-menu').css({width: searchPanelWidth});
            var detailSearch = dropdown.find('.detail-search');
            detailSearch.empty();
            detailSearch.append(searchPanel);
        }

        function createActionsColumn(actions) {
            /**
             * Add table actions
             * @type {string}
             */
            var tdActions = angular.element('<td></td>');
            var onClickFn = 'tb.rowAction($event, $index)';
            for (var i = 0; i < actions.length; i++) {
                var template = '';
                var actionColumn = actions[i];
                if (actionColumn.type === 'edit' && !lnc.hasValue(actionColumn.template)) {
                    template = searchElementType.editBtn;
                } else if (actionColumn.type === 'delete' && !lnc.hasValue(actionColumn.template)) {
                    template = searchElementType.delBtn;
                } else {
                    template = angular.element(actionColumn.template);
                    if (template.length === 1) {
                        if (template[0].tagName === 'BUTTON') {
                            template.attr('data-ng-click', onClickFn);
                        }
                    } else if (template.length > 1) {
                        template.find('button').attr('data-ng-click', onClickFn);
                    }
                }
                tdActions.append(template);
            }

            return tdActions.html();
        }
    }
})();
