(function () {
    'use strict';
    angular
        .module('lnc.media')
        .controller('MediaPropertiesController', MediaPropertiesController);

    MediaPropertiesController.$inject = ['lncMediaService', '$log', 'media'];

    function MediaPropertiesController(lncMediaService, $log, media) {
        $log.info(media);
        var vm = this;
        vm.isLoading = false;
        vm.submit = submit;
        vm.properties = {};
        if (media.original.shareType) {
            vm.properties.shareType = media.original.shareType.toString();
        } else {
            vm.properties.shareType = media.original.shareType;
        }

        function submit(properties) {
            $log.info(properties);
            vm.isLoading = true;
            lncMediaService.setProperties(media.id, properties).then(function (resp) {
                vm.$close(resp.data);
            }).finally(function () {
                vm.isLoading = false;
            });
        }
    }
})();
