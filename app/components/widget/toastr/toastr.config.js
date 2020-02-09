(function () {
    'use strict';

    angular
        .module('lnc.toastr')
        .config(configProcess);

    function configProcess() {
        /**
         * Configure toastr using for jquery, all Toast using with jquery should replace by lncLayout function
         */
        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': false,
            'progressBar': false,
            'positionClass': 'toast-top-right',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };
    }
})();
