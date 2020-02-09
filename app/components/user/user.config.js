(function () {
    'use strict';

    angular.module('hdl.user').config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider) {
      /*  $stateProvider.state('erp.mngt.user', {
            url: '/user',
            abstract: true,
            template: '<ui-view/>'

        }).state('erp.mngt.user.profile', {
            url: '/profile',
            templateUrl: 'components/user/profile.tpl.html',
            controller: 'UserProfileController',
            controllerAs: 'up',
            data: {
                pageTitle: 'User Profile Information'
            },
            resolve: {
                profileOpts: getProfile
            }
        });
        getProfile.$inject = ['userProfileService'];
        function getProfile(userProfileService) {
            return userProfileService.get().then(function (data) {
                return data.data;
            });
        }*/
    }
})();
