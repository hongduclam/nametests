(function () {
    'use strict';
    angular
        .module('lnc.media')
        .controller('LncSliderController', LncSliderController);

    LncSliderController.$inject = ['$log', 'images', 'lncMediaService', '$window'];

    function LncSliderController($log, images, lncMediaService, $window) {
        $log.info($window.innerHeight);
        var vm = this;
        vm.images = images;

        if (images.length) {
            sliderSelect(0, images[0]);
        }
        vm.sliderSelect = sliderSelect;

        function sliderSelect(i, id) {
            vm.selectedItem = i;
            vm.preview = lncMediaService.download(id);
        }
    }
})();

