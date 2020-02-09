(function () {
    'use strict';
    angular
        .module('hdl.account')
        .controller('UserLoginController', UserLoginController);

    UserLoginController.$inject = ['$scope', '$log', '$state', 'accountService', 'userService'];

    function UserLoginController($scope, $log, $state, accountService, userService) {

        if (userService.isLogined()) {
            $state.go('erp.dashboard');
        }

        var vm = this;
        vm.isLoading = false;
        vm.error = false;

        vm.submit = submit;

        ////////////////

        function submit(user) {
            vm.isLoading = true;
            vm.error = false;
            accountService.login(user).then(function (data) {
                var res = data.data;
                userService.setLogin(true);
                if (lnc.hasValue(res) && res.result === 1) {
                    var url = 'erp.dashboard';
                    var params = {};
                    if ($state.params && $state.params.lastState) {
                        url = $state.params.lastState.name;
                        params = $state.params.lastState.params;
                    }
                    $state.go(url, params);
                    vm.isLoading = false;
                } else {
                    vm.isLoading = false;
                    vm.error = true;
                }
            }, function (err) {
                $log.info(err);
                vm.error = err.status;
                vm.isLoading = false;
            }).finally(function () {
                $scope.$broadcast('reload.captcha');
                vm.form.$setPristine();
                /* eslint-disable */
                user.j_captcha = '';
                /* eslint-enable */
            });
        }
    }
})();
