(function () {
    'use strict';
    angular.module('hdl.core', [
        'ngSanitize', 'ngMessages', 'ngAnimate',
        'ui.router',
        'lnc.widget',
        'hdl.layout', 'hdl.account' /*'lnc.widget'*/
    ]);
})();
