(function(){
    'use strict';
    angular.module('hdl.layout').directive('lncLayoutFooter', lncLayoutFooter);

    lncLayoutFooter.$inject = ['$window', 'lncLayout'];

    function lncLayoutFooter($window, lncLayout){
        return {
            link: link,
            templateUrl: 'components/layout/footer.tpl.html',
            restrict: 'E',
            replace: true
        };

        function link(scope, element){
            var offset = 100;
            var duration = 500;
            var windowEl = angular.element($window);

            var scrollToTop = element.find('.scroll-to-top');
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                windowEl.on('touchend touchcancel touchleave', function(){
                    if (windowEl.scrollTop() > offset) {
                        scrollToTop.fadeIn(duration);
                    } else {
                        scrollToTop.fadeOut(duration);
                    }
                });
            } else {
                windowEl.on('scroll', function() {
                    if (windowEl.scrollTop() > offset) {
                        scrollToTop.fadeIn(duration);
                    } else {
                        scrollToTop.fadeOut(duration);
                    }
                });
            }

            scrollToTop.on('click', function(e) {
                e.preventDefault();
                lncLayout.scrollTo();
                return false;
            });

        }
    }
})();
