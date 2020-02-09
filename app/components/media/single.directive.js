(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncMediaSingle', lncMediaSingle);

    lncMediaSingle.$inject = ['lncMediaService'];

    function lncMediaSingle (lncMediaService) {
        return {
            scope: {
                image: '=ngModel'
            },
            replace: true,
            require: 'ngModel',
            restrict: 'E',
            link: link,
            templateUrl: 'components/media/single.tpl.html'
        };

        function link (scope, element, attrs, ngModel) {
            var mimetype = attrs.mimetype || 'image';
            scope.chooseImage = function (e) {
                ngModel.$setDirty();
                e.stopPropagation();
                var modal = lncMediaService.modal(mimetype, 'single');
                modal.result.then(function (data) {
                    scope.image = data;
                });
            };

            scope.removeSingle = function (e) {
                ngModel.$setDirty();
                e.stopPropagation();
                scope.image = null;
            };
        }
    }
})();
