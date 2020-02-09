(function () {
    'use strict';
    angular
        .module('hdl.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        'userService', '$log'
    ];

    function DashboardController(userService, $log) {
        var vm = this;
    }
})();
