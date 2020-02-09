(function () {
    'use strict';

    angular
        .module('hdl.notification')
        .directive('lncNotification', lncNotification);

    lncNotification.$inject = ['$log'];

    function lncNotification($log) {
        return {
            replace: true,
            templateUrl: 'components/layout/notification/notification.tpl.html',
            controller: 'NotificationController',
            controllerAs: 'notifyCtrl',
            link: linkFunc,
            restrict: 'E'
        };

        ////////////////
        function linkFunc(scope, element) {
            var notifyCtrl = scope.notifyCtrl;
            element.on('shown.bs.dropdown', function () {
                $log.info('Notification Shown');
                notifyCtrl.notificationOpen();
            });
        }
    }
})();
