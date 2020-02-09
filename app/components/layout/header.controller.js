(function () {
    'use strict';
    angular
        .module('hdl.layout')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$state', 'userService', 'lncLayout', 'lncMediaService'];

    function HeaderController($state, userService, lncLayout, lncMediaService) {
        var vm = this;

        vm.username = userService.getDisplay;
        vm.avatar = _avatar;

        vm.logout = logout;

        function _avatar() {
            var avatarUrl = userService.getAvatar();

            if (avatarUrl && avatarUrl.length) {
                avatarUrl = lncMediaService.thumbnail(avatarUrl);
            } else {
                avatarUrl = 'image/avatar.png';
            }

            return avatarUrl;
        }
        function logout() {
            lncLayout.blockUI();
            userService.logout().finally(function () {
                userService.getSettings();
                $state.go('account.login');
                lncLayout.unblockUI();
            });
        }
    }
})();
