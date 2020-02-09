(function(){
    'use strict';

    angular.module('hdl.notification').config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider){
        $stateProvider.state('notification', {
            url: '/notification',
            template: '<div>This is Notification</div>',
            data: {
                pageTitle: 'Notification',
              //  permission: ['READ']
            }
        });
    }
})();
