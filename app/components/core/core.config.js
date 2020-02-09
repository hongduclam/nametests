(function () {
    'use strict';

    angular
        .module('hdl.core')
        .config(configProcess);

    configProcess.$inject = ['$httpProvider'];

    function configProcess($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'LNCXMLHttpRequest';
        $httpProvider.interceptors.push('lncHttpInterceptor');
    }
})();
