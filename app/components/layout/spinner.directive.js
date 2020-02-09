(function () {
    'use strict';
    angular
        .module('hdl.layout')
        .directive('ngSpinnerBar', ngSpinnerBar);

    ngSpinnerBar.$inject = ['$rootScope', 'lncLayout', '$timeout',
        '$state', 'userService', '$log', 'lncModalService', '$window'];

    function ngSpinnerBar($rootScope, lncLayout, $timeout,
                          $state, userService, $log, lncModalService, $window) {
        return {
            link: linkFunc
        };

        function linkFunc(scope, element) {
            element.addClass('hide');

            var changeStartEvent = $rootScope.$on('$stateChangeStart', stateChangeStart);
            var stateNotFoundEvent = $rootScope.$on('$stateNotFound', stateNotFound);
            var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
            var stateChangeErrorEvent = $rootScope.$on('$stateChangeError', stateChangeError);
            var requireLoginedEvent = $rootScope.$on(LNC_EVENT.LOGIN_REQUIRED, requireLogined);
            var sessionTimeoutEvent = $rootScope.$on(LNC_EVENT.SESSION_TIMEOUT, sessionTimeout);

            function sessionTimeout() {
                if (userService.isLogined()) {
                    var reloadConfirm = lncModalService.confirm({
                        type: 'warning',
                        message: 'Your session is timeout, click OK to reload.'
                    });
                    reloadConfirm.result.then(function () {
                        $window.location.reload();
                    });
                } else {
                    $window.location.reload();
                }
            }

            function requireLogined() {
                if (userService.isLogined()) {
                    $log.info('Need Logined');
                    userService.setLogin(false);
                    $state.go('account.login', {
                        lastState: {
                            name: $state.current.name,
                            params: $state.params
                        }
                    });
                }
            }

            function stateChangeStart(stateEvent, toState, toParams) {
                $rootScope.$broadcast(LNC_EVENT.DROPDOWN_CLOSE);
                element.removeClass('hide');
                var reg = RegExp('cms.*');
                if (reg.test(toState.name)) {
                    if (!userService.isLogined()) {
                        stateEvent.preventDefault();

                        $state.go('account.login', {
                            lastState: {
                                name: toState.name,
                                params: toParams
                            }
                        });

                    } /*else if (!userService.isCompanyInit()) {
                        stateEvent.preventDefault();
                        $state.go('account.initCompany');
                    }*/

                    /*var hasPermission = true;
                    if (lnc.hasValue(toState.data)) {
                        var permissions = toState.data.permission || toState.data.permissions || '';
                        var module = toState.data.module || '';
                        if (lnc.hasValue(module) || lnc.hasValue(permissions)) {
                            hasPermission = userService.hasAnyPermission(module, permissions);
                        }
                    }
                    if (!hasPermission) {
                        stateEvent.preventDefault();
                        $state.go('cms.accessDenied', {}, {location: false});
                    }*/
                }
            }

            function stateNotFound(stateEvent, unfoundState) {
                $log.info(unfoundState);
                stateEvent.preventDefault();
                $state.go('cms.notfound', {}, {location: false});
            }

            function stateChangeSuccess(stateEvent, toState) {
                var stateData = toState.data;
                if (lnc.hasValue(stateData)) {
                    $rootScope.title = toState.data.pageTitle || 'welcome ^^';
                }
                element.addClass('hide');
                angular.element('body').removeClass('page-on-load');
                $timeout(function () {
                    lncLayout.scrollTo();
                }, lncLayout.pageAutoScrollOnLoad);
            }

            function stateChangeError(stateEvent, toState, toParams, fromState, fromParams, error) {
                $log.info(fromState);
                $log.info(fromParams);
                $log.error(error);
                if (angular.isObject(error) && error.status) {
                    error = error.status;
                }
                switch (error) {
                    case LNC_HTTP_STATUS.NOT_FOUND:
                        stateEvent.preventDefault();
                        $state.go('cms.notfound', {}, {location: false});
                        break;
                    case LNC_HTTP_STATUS.ACCESS_DENIED:
                        stateEvent.preventDefault();
                        $state.go('cms.accessDenied', {}, {location: false});
                        break;
                    case LNC_HTTP_STATUS.UNAUTHORIZED:
                        /**
                         * Unauthorized
                         */
                        stateEvent.preventDefault();
                        $state.go('account.login', {}, {location: false});
                        break;
                    case LNC_HTTP_STATUS.INIT_COMPANY:
                        stateEvent.preventDefault();
                        $state.go('account.initCompany');
                        break;
                    default:
                        break;
                }
                element.addClass('hide');
            }

            scope.$on('$destroy', function () {
                changeStartEvent();
                stateChangeSuccessEvent();
                stateNotFoundEvent();
                stateChangeErrorEvent();
                stateNotFoundEvent();
                requireLoginedEvent();
                sessionTimeoutEvent();
            });
        }
    }
})();
