(function () {
    'use strict';
    angular.module('hdl.dashboard').config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider) {
        $stateProvider
            .state('cms.dashboard', {
                url: '/dashboard',
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dc',
                data: {
                    pageTitle: 'Dashboard'
                }
            });
    }
})();
