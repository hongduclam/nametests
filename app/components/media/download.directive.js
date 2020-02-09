(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncDownload', lncDownload);
    lncDownload.$inject = ['$window', 'lncToastr', '$log'];
    function lncDownload($window, lncToastr, $log) {
        return {
            replace: true,
            restrict: 'A',
            link: link,
            template: ''
        };

        function link(scope, element, attrs) {
            var urlDownload = '';
            attrs.$observe('lncDownload', function (urlParam) {
                urlDownload = urlParam;
            });
            element.on('click', function () {
                $log.info('Click roi nha pa');
                if (urlDownload) {
                    downloadPage(urlDownload);
                }
            });
        }

        function downloadPage(sUrl) {
            // iOS devices do not support downloading. We have to inform user about
            // this.
            if (/(iP)/g.test(navigator.userAgent)) {
                lncToastr.alert(
                    'Your device does not support files downloading. Please try again in desktop browser.');
                return false;
            }
            $window.open(sUrl, '_blank');
            return true;
        }
    }
})();
