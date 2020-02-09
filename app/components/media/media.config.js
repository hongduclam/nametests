(function () {
    'use strict';

    angular.module('lnc.media').config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider) {
        $stateProvider
            .state('cms.media', {
                url: '/media',
                views: {
                    '@cms': {
                        template: '<lnc-browser></lnc-browser>',
                    }
                }
            });
    }
})();


