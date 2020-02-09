(function () {
    'use strict';

    angular
        .module('hdl.account')
        .config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider) {
        $stateProvider
            .state('account', {
                url: '/account',
                views: {
                    '@': {
                        templateUrl: 'components/account/user.tpl.html',
                        controller: 'UserController'
                    }
                },
                abstract: true
            })
            .state('account.login', {
                url: '/login',
                params: {
                    lastState: null
                },
                templateUrl: 'components/account/login.tpl.html',
                controller: 'UserLoginController',
                controllerAs: 'loginCtrl',
                data: {
                    pageTitle: 'Abyourself System Login'
                }
            })
            .state('account.register', {
                url: '/register',
                templateUrl: 'components/account/register.tpl.html',
                controller: 'UserRegisterController',
                controllerAs: 'rc',
                data: {
                    pageTitle: 'Register Account'
                }
            })
    }

    isLogined.$inject = ['userService', '$q'];
    function isLogined(userService, $q) {
        if (userService.isLogined()) {
            return $q.resolve();
        }

        return $q.reject(LNC_HTTP_STATUS.UNAUTHORIZED);
    }
})();

