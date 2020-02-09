(function () {
    'use strict';
    angular
        .module('hdl.notification')
        .controller('NotificationController', NotificationController);

    NotificationController.$inject = ['cacheService', '$log', 'notificationService', 'logService', 'userService'];

    function NotificationController(cacheService, $log, notificationService, logService, userService) {
        var LAST_LOG_ID = 'LAST_LOG_ID';
        var vm = this;
        var page = 0;
        var lastLogId = 0;
        vm.isLoading = false;
        vm.canLoadMore = false;
        vm.pending = 0;

        vm.events = [];
        vm.getLog = _getLog;
        vm.notificationOpen = _notificationOpen;

        cacheService.get(LAST_LOG_ID).then(function (value) {
            $log.info('Get LAST_LOG_ID: ' + value);
            lastLogId = value || 0;
            _getUpdate();
        }, function () {
            lastLogId = 0;
            _getUpdate();
        });

        notificationService.information().then(function (data) {
            $log.info(data);
            var channel = notificationService.subscribe(data.channel);
            channel.bind_all(function (e, pData) {
                $log.info(e);
                $log.info(pData);
                if (_isEvent(e, pData)) {
                    _getUpdate();
                }
            });
        });

        function _getUpdate() {
            logService.getUpdate(lastLogId).then(function (resp) {
                var notificationUpdate = resp.data;
                if (lastLogId) {
                    vm.pending = notificationUpdate.newAmount;
                }

                if (notificationUpdate.lastId) {
                    lastLogId = notificationUpdate.lastId;
                }

                cacheService.set(LAST_LOG_ID, lastLogId);
            });
        }

        function _isEvent(e, data) {
            var rs = true;
            var createdBy = 0;
            if (data && data.byUser) {
                createdBy = data.byUser.id || 0;
            }

            $log.info('Event create by: ' + createdBy + '/' + userService.getId());
            if (e && e.startsWith('pusher:') || createdBy === userService.getId()) {
                rs = false;
            }

            return rs;
        }

        function _notificationOpen() {
            page = 0;
            _getLog().then(function () {
                vm.pending = 0;
            });
        }

        function _getLog() {
            vm.isLoading = true;
            var request = {
                page: page,
                size: 10
            };
            return logService.select(request, false).then(function (resp) {
                var data = resp.data;
                $log.info(data);
                vm.events = data.data;
                vm.canLoadMore = data.more;
                return data;
            }).finally(function () {
                vm.isLoading = false;
            });
        }

        /*function _getNextLog() {
         page++;
         _getLog();
         }*/
    }
})();
