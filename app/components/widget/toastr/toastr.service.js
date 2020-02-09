(function () {
    'use strict';
    angular
        .module('lnc.toastr')
        .factory('lncToastr', lncToastr);

    function lncToastr () {
        return {
            success: toastr.success,
            warning: toastr.warning,
            error: toastr.error,
            info: toastr.info
        };
    }
})();

