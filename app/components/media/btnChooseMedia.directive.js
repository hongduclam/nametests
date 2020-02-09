(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('btnChooseMedia', btnAddMedia);

    btnAddMedia.$inject = ['lncMediaService'];

    function btnAddMedia (lncMediaService) {
        return {
            scope: {
                image: '=ngModel',
                callback: '&'
            },
            replace: true,
            require: 'ngModel',
            restrict: 'E',
            link: link,
            template: '<button type="button" data-ng-click="chooseImage($event)" class="btn btn-primary">Choose Images </button>'
        };

        function link (scope, element, attrs, ngModel) {
            var mimetype = attrs.mimetype || 'image';
            scope.chooseImage = function (e) {
                ngModel.$setDirty();
                e.stopPropagation();
                var modal = lncMediaService.modal(mimetype, 'single');
                modal.result.then(function (data) {
                    scope.image = data;
                    if(angular.isFunction(scope.callback)){
                        scope.callback({
                           data: scope.image
                        });
                    }
                });
            };
        }
    }
})();
