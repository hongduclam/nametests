(function () {
    'use strict';

    angular
        .module('lnc.widget')
        .directive('fbApi', fbApi);

    fbApi.$inject = ['Facebook', '$timeout'];

    function fbApi() {
        return {
            restrict: 'E',
            scope: {
                callToOutput: '&callToOutput',
                fbField: '=ngModel',
                facebookCode: '=facebookCode'
            },
            templateUrl: 'components/widget/fb/fbApi.html',
            link: link,
            bindToController: true,
            controller: 'FbApiController',
            controllerAs: 'fb'
        };

        ////////////////////////////////////
        function link(scope, element, attrs) {
        }
    }
})();
