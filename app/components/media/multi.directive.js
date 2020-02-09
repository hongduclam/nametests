(function(){
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncMediaMulti', lncMediaMulti);

    lncMediaMulti.$inject = ['lncMediaService', '$window'];
    function lncMediaMulti(lncMediaService, $window) {
        return {
            scope: {
                images: '=ngModel'
            },
            restrict: 'E',
            link: link,
            replace: true,
            templateUrl: 'components/media/multi.tpl.html'
        };

        function link(scope, els, attrs) {
            var mimeType = attrs.mimeType || 'all';
            scope.addImages = function (e) {
                var modal = lncMediaService.modal(mimeType, 'multiple');
                e.stopPropagation();
                modal.result.then(function(data){
                    if (!lnc.hasValue(scope.images)) {
                        scope.images = [];
                    }

                    angular.forEach(data, function (item) {
                        if (scope.images.indexOf(item) === -1) {
                            scope.images.push(item);
                        }
                    });
                });
            };
            scope.remove = function (item) {
                var index = scope.images.indexOf(item);
                if (index > -1) {
                    scope.images.splice(index, 1);
                }
            };
            scope.download = function (item) {
                $window.open(lncMediaService.download(item));
            };
        }
    }
})();
