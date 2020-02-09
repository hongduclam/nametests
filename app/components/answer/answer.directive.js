(function () {
    'use strict';

    angular
        .module('hdl.answer')
        .directive('answer', answer);
  //   answer.$inject = ['lncModalService', 'answerService', 'questionService'];

    function answer() {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                questionData: '=ngModel'
            },

            bindToController: true,
            templateUrl: 'components/answer/main.tpl.html',
            //link: _link,
            controller: 'AnswerMainController',
            controllerAs: 'amc'
        };
    }
})();
