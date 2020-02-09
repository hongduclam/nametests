(function () {
    'use strict';
    angular
        .module('hdl.account')
        .controller('UserRegisterController', UserRegisterController);

    UserRegisterController.$inject = ['$scope', '$state', '$log', 'accountService'];

    function UserRegisterController($scope, $state, $log, accountService) {
        var vm = this;

        vm.submit = submit;
        vm.errors = [];
        vm.errorStatus = 0;
        vm.isLoading = false;
        ////////////////

        function submit(account) {
            $log.info(account);
            vm.isLoading = true;
            vm.errros = [];
            vm.errorStatus = 0;
            accountService.register(account).then(function (res) {
                if (res.data.data > 0) {
                    $state.go('account.login');
                }
            }, function (errRes) {
                vm.errorStatus = errRes.status;
                if (errRes.data && angular.isArray(errRes.data)) {
                    vm.errors = errRes.data;
                }
            }).finally(function () {
                $scope.$broadcast('reload.captcha');
                vm.form.$setPristine();
                vm.account.captcha = '';
                vm.isLoading = false;
            });
        }
    }
})();

