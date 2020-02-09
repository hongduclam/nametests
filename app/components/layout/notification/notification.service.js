(function () {
    'use strict';
    angular
        .module('hdl.notification')
        .service('notificationService', notificationService);

    notificationService.$inject = ['$http', '$pusher', '$cookies'];

    function notificationService($http, $pusher, $cookies) {
        var _URL = '/notification';
        var _pusherClient = new Pusher('72247e68ab7598b93c03', {
            cluster: 'ap1',
            authEndpoint: _URL + '/pusher/authenticate',
            auth: {
                headers: {
                    'X-XSRF-TOKEN': $cookies.get('XSRF-TOKEN')
                }
            }
        });

        var _pusher = $pusher(_pusherClient);

        /*var EVENT_TYPE = {
         0: 'Activity'
         };*/

        return {
            activities: _activities,
            information: _information,
            subscribe: _subscribe
        };

        function _subscribe(channel) {
            return _pusher.subscribe(channel);
        }

        function _information() {
            return $http.get(_URL).then(function (resp) {
                return resp.data;
            });
        }

        function _activities() {
            return [
                {
                    id: 1,
                    type: 1,
                    icon: '<span class="label label-sm label-icon label-danger"> <i class="fa fa-bolt"></i> </span>',
                    message: 'Testing message 1'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-warning"> <i class="fa fa-bell-o"></i> </span>',
                    message: 'Testing message 2'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-info"> <i class="fa fa-bullhorn"></i> </span>',
                    message: 'Testing message 2'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-danger"> <i class="fa fa-bolt"></i> </span>',
                    message: 'Testing message 2'
                },
                {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-warning"> <i class="fa fa-bell-o"></i> </span>',
                    message: 'Testing message 2'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-info"> <i class="fa fa-bullhorn"></i> </span>',
                    message: 'Testing message 2'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-danger"> <i class="fa fa-bolt"></i> </span>',
                    message: 'Testing message 2'
                }, {
                    id: 2,
                    type: 2,
                    icon: '<span class="label label-sm label-icon label-warning"> <i class="fa fa-bell-o"></i> </span>',
                    message: 'Testing message 2'
                }
            ];
        }
    }
})();

