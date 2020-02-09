(function () {
    'use strict';
    angular
        .module('hdl.user')
        .factory('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        var _isLogined = false;
        var folder = {};

        var _profile = {
            userId: 0,
            display: 'Canh Le Tan Tran Lam Hong ',
            avatar: '',
            username: '',
            companyId: 0
        };

        var _permission = {};

        return {
            logout: _logout,
            getDisplay: getDisplay,
            getAvatar: getAvatar,
            getUsername: getUsername,
            getCompanyId: getCompanyId,
            isLogined: getLogin,
            setLogin: setLogin,
            getId: _getId,
            setFolder: setFolder,
            getFolder: getFolder
        };

        ////////////////

        function init() {
            _isLogined = false;
            _profile = {
                display: 'Canh Le',
                avatar: '',
                username: '',
                companyId: 0
            };
            _permission = {};
        }

        function _getId() {
            return _profile.userId;
        }

        function getCompanyId() {
            return _profile.companyId;
        }

        function getLogin() {
            return _isLogined;
        }

        function setLogin(logInStatus) {
            _isLogined = logInStatus;
        }

        function setFolder(data) {
            folder.folderQuestion = data.folderQuestion;
            folder.folderAnswer = data.folderAnswer;
            folder.folderGlobal = data.folderGlobal;
        }

        function getFolder(data) {
            return folder;
        }

        function getDisplay() {
            var rs = '';
            if (lnc.hasValue(_profile.display)) {
                rs = _profile.display;
            } else {
                rs = _profile.username;
            }

            return rs;
        }

        function getAvatar() {
            return _profile.avatar;
        }

        function getUsername() {
            return _profile.getUsername;
        }

        function _logout() {
            return $http.post('/logout').then(function () {
                return init();
            });
        }
    }
})();

