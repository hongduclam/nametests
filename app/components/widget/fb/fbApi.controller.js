(function () {
    'use strict';
    angular
        .module('lnc.widget')
        .controller('FbApiController', FbApiController);

    FbApiController.$inject = ['Facebook', '$timeout'];

    function FbApiController(Facebook) {
        var scope = this;

        scope.fbFields = [];
        scope.fbFields = [
            {id: 2, key: 'id', value: 'id'},
            {id: 3, key: 'email', value: 'email'},
            {id: 4, key: 'name', value: 'name'},
            {id: 5, key: 'gender', value: 'gender'},
            {id: 6, key: 'birthday', value: 'birthday'},
            {id: 7, key: 'picture.width(500)', value: 'picture.data.url'},
            {id: 8, key: 'locale', value: 'locale'},
            {id: 9, key: 'first_name', value: 'first_name'},
            {id: 10, key: 'last_name', value: 'last_name'},
            {id: 11, key: 'updated_time', value: 'updated_time'},
            {id: 12, key: 'timezone', value: 'timezone'},
            {id: 13, key: 'link', value: 'link'},
            {id: 14, key: 'location', value: 'location.name'},
            {id: 15, key: 'cover', value: 'cover.source'},
            {id: 16, key: 'currency', value: 'currency.user_currency'}
        ];

        scope.getData = getData;
        scope.login = login;
        scope.facebookCode = urlApi();
        /////////////////////////////////////
        function getData(field) {

            if (scope.fbData && field) {
               var keyStr = field.value;
                var keys = keyStr.split('.');
                var rs = {};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!rs[key]) {
                        rs = scope.fbData[key];
                    }else {
                        rs = rs[key];
                    }
                }
                scope.callToOutput({
                    data: rs
                });
            }else {
                scope.callToOutput({
                    data: ''
                });
            }
        }

        function _getInfo() {
            Facebook.api(scope.facebookCode, function (response) {
                scope.fbData = response;
            });
        }

        function urlApi() {
            var fields = '';
            for (var i = 0; i < scope.fbFields.length; i++) {
                fields += scope.fbFields[i].key;
                if (i < scope.fbFields.length - 1) {
                    fields += ',';
                }
            }
            var url = '/me?fields=' + fields;
            return url;
        }

        function login() {
            Facebook.login(function (response) {
                scope.isLogin = response.status;
                _getInfo();
            }, {
                scope: 'user_friends,email,public_profile,user_location',
                auth_type: 'rerequest'
            });
        }
    }
})();