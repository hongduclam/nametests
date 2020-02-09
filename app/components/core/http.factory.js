(function () {
    'use strict';
    angular
        .module('hdl.core')
        .factory('lncHttpInterceptor', lncHttpInterceptor);

    lncHttpInterceptor.$inject = ['$q', '$log', 'lncToastr', '$rootScope'];

    function lncHttpInterceptor($q, $log, lncToastr, $rootScope) {
        return {
            request: request,
            requestError: requestError,
            responseError: responseError
        };

        function requestError(rejection) {
            return $q.reject(rejection);
        }

        function request(config) {
            return config;
        }

        function responseError(rejection) {
            var statusCode = rejection.status || '';
            var statusText = '';
            if (lnc.hasValue(rejection.data)) {
                statusText = rejection.data.message || '';
            }
            switch (statusCode) {
                case LNC_HTTP_STATUS.SESSION_TIMEOUT:
                    $log.info('Broad Cast Event Session Timeout');
                    $rootScope.$broadcast(LNC_EVENT.SESSION_TIMEOUT);
                    break;
                case LNC_HTTP_STATUS.ACCESS_DENIED:
                    break;
                case LNC_HTTP_STATUS.INTERNAL_ERROR:
                    lncToastr.error(statusText);
                    break;
                default:
                    break;
            }

            return $q.reject(rejection);
        }
    }
})();

