(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncThumbnail', lncThumbnail);

    lncThumbnail.$inject = ['lncMediaService', '$timeout'];

    function lncThumbnail(lncMediaService) {
        return {
            link: linkFunc,
            restrict: 'A'
        };

        ////////////////

        function linkFunc(scope, element, attrs) {
            attrs.$observe('lncThumbnail', function (id) {
                parseImgId(id);
            });

            function parseImgId(id) {
                if (lnc.hasValue(id)) {
                    element.removeAttr('holder');
                    element.attr('src', lncMediaService.thumbnail(id));
                } else {
                    var curHolder = element.attr('holder');
                    if (!lnc.hasValue(curHolder)) {
                        //attrs.$set('data-src', 'holder.js/150x150?auto=yes&text=No File&size=25');
                        /* eslint-disable */
                        //Holder.run(element[0]);
                        /* eslint-enable */
                        element.attr('src', 'image/no-image.svg');
                    }
                }
            }
        }
    }
})();
