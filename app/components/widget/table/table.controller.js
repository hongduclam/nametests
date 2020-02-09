(function () {
    'use strict';
    angular
        .module('lnc.table')
        .controller('TableController', TableController);

    TableController.$inject = ['$log', '$timeout', 'lncLayout', 'cacheService', '$q'];

    function TableController($log, $timeout, lncLayout, cacheService, $q) {
        var filterTimeoutHandler;
        var vm = this;
        vm.filter = filter;
        vm.rows = [];
        vm.toggleSort = toggleSort;
        vm.sorts = {};
        vm.searches = {
            global: '',
            columns: {}
        };
        vm.resetSearch = resetSearch;
        vm.isLoading = false;
        vm.errorMessage = 'Testing error message';
        vm.showMessage = false;
        vm.searchDetail = false;
        vm.pagination = {
            page: 1,
            itemsPerPage: '10',
            totalPage: 1,
            totalRecords: 0
        };
        vm.searchChange = searchChange;
        vm.previousPage = previousPage;
        vm.nextPage = nextPage;
        vm.toPage = toPage;

        vm.rowAction = rowAction;
        vm.api = {
            refresh: filter
        };

        $q.when(loadLastRequest(), function () {
            filter();
        }, function () {
            filter();
        });


        ////////////////
        function resetSearch() {
            vm.searches = {
                global: '',
                columns: {}
            };
            filter();
        }

        function rowAction(e, i) {
            var rowData;
            rowData = angular.copy(vm.rows[i]);
            if (angular.isFunction(vm.callback)) {
                vm.callback({
                    event: e,
                    data: rowData
                });
            }
        }

        function previousPage() {
            if (vm.pagination.page > 1) {
                vm.pagination.page = vm.pagination.page - 1;
                scheduleFilter();
            }
        }

        function nextPage() {
            if (vm.pagination.page < vm.pagination.totalPage) {
                vm.pagination.page = vm.pagination.page + 1;
                scheduleFilter();
            }
        }

        function toPage() {
            if (vm.pagination.page > vm.pagination.totalPage) {
                vm.pagination.page = vm.pagination.totalPage;
            } else if (vm.pagination.page < 1) {
                vm.pagination.page = 1;
            }
            scheduleFilter();
        }

        function toggleSort(e, sort) {
            var currentSort = lnc.hasValue(vm.sorts[sort]) ? vm.sorts[sort] : -1;
            if (e.altKey) {
                currentSort = currentSort - 1;
            } else {
                currentSort = currentSort + 1;
            }
            if (currentSort < -1) {
                currentSort = 1;
            }
            if (currentSort > 1) {
                currentSort = -1;
            }

            if (e.ctrlKey) {
                if (currentSort < 0) {
                    delete vm.sorts[sort];
                } else {
                    vm.sorts[sort] = currentSort;
                }
            } else {
                vm.sorts = {};
                if (currentSort >= 0) {
                    vm.sorts[sort] = currentSort;
                }
            }
            scheduleFilter();
        }

        function scheduleFilter() {
            $timeout.cancel(filterTimeoutHandler);
            filterTimeoutHandler = $timeout(filter, 500);
        }

        function searchChange() {
            filter();
        }

        function filter() {
            vm.isLoading = true;
            if (vm.searches && vm.searches.columns) {
                var columnsCheck = vm.searches.columns;
                angular.forEach(columnsCheck, function (v, i) {
                    if (v === '') {
                        delete columnsCheck[i];
                    }
                });
            }

            var obj = {
                page: vm.pagination.page - 1,
                size: vm.pagination.itemsPerPage,
                searches: vm.searches,
                sorts: vm.sorts
            };

            saveLastRequest(obj);

            vm.pipe(obj).then(function (data) {
                if (lnc.hasValue(data)) {
                    var res = data.data || '';
                    if (lnc.hasValue(res)) {
                        vm.pagination.totalRecords = res.totalElements;
                        vm.pagination.totalPage = res.totalPages;
                        vm.rows = res.data;
                    }
                }
            }, function () {
                lncLayout.toastr('Internal Error, please try again later or contact us, thank you !', '', 'error');
            }).finally(function () {
                vm.isLoading = false;
            });
        }

        function saveLastRequest(obj) {
            if (vm.lncId && vm.lncId.length) {
                cacheService.set(vm.lncId, obj);
            }
        }

        function loadLastRequest() {
            $log.info('Load Last Request: ' + vm.lncId);
            if (vm.lncId && vm.lncId.length) {
                return cacheService.get(vm.lncId).then(function (data) {
                    $log.info(data);
                    vm.pagination.page = data.page + 1;
                    vm.pagination.itemsPerPage = data.size;
                    vm.searches = data.searches;
                    vm.sorts = data.sorts;
                });
            }
            return null;
        }
    }
})();
