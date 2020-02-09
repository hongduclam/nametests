(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('btnDeleteMedia', btnDeleteMedia);

    btnDeleteMedia.$inject = ['lncMediaService', '$log'];

    function btnDeleteMedia(lncMediaService, $log) {
        return {
            scope: {
                imageId: '=ngModel'
            },
            replace: true,
            require: 'ngModel',
            restrict: 'E',
            link: link,
            template: '<button type="button" data-ng-click="deleteImage($event)" class="btn btn-danger">Delete </button>'
        };

        function link(scope, element, attrs, ngModel) {
            scope.deleteImage = function (e) {
                lncMediaService.delete(scope.imageId).then(function () {
                    scope.imageId = null;
                }, function () {
                    $log.error('error delete');
                });
            };
        }
    }
})();
