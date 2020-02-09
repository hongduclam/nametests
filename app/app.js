(function () {
  'use strict';

  angular.module('hdl', [
    'hdl.core', 'hdl.user', /*'hdl.template'*/
  ]);

  /* Init global settings and run the app */
  angular.module('hdl').run(main);

  getUserData().then(function () {
    bootstrapApplication();
  });

  /////////////////////////////
  main.$inject = ['$rootScope', 'userService', 'userData'];

  function main($rootScope, userService, userData) {
    if (userData && userData.login) {
      userService.setLogin(userData.login);
      userService.setFolder(userData);
    }
    console.log('call main need to do init setting for app');
  }

  /* Manual bootstrap angular for load user data first. */
  function getUserData() {
    var initInjector = angular.injector([
      'ng'
    ]);
    var $http = initInjector.get('$http');

    return $http.get('/user/checkLogin').then(function (data) {
      console.log('isLogin:', data.data);
     angular.module('hdl').value('userData', data.data);
    }, function () {
      console.log('not yet login');
      angular.module('hdl').value('userData', null);
    });
  }

  function bootstrapApplication() {
    angular.element(document).ready(function () {
      angular.bootstrap(document, [
        'hdl'
      ]);
      /* eslint-disable */
      try {
        $(document.body).attr('ng-app', 'hdl');
      } catch (e) {
      }
      /* eslint-enable */
    });
  }
})();
