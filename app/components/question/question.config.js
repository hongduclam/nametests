
(function () {
    'use strict';
    angular.module('hdl.question').config(configProcess);

    configProcess.$inject = ['$stateProvider'];

    function configProcess($stateProvider) {
        $stateProvider
            .state('cms.question.main', {
                url: '',
                templateUrl: 'components/question/main.tpl.html',
                controller: 'QuestionMainController',
                controllerAs: 'qmc',
                data: {
                    pageTitle: 'Question'
                }
            }).state('cms.question.create', {
                url: '/create',
                templateUrl: 'components/question/form/form.tpl.html',
                controller: 'QuestionFormController',
                controllerAs: 'qfc',
                data: {
                    pageTitle: 'Question Create'
                },
                resolve: {
                    id: function () {
                        return null;
                    },
                    form: function () {
                        return {};
                    }
                }
            }).state('cms.question.id', {
                url: '/{id:[0-9]*}',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    id: getId,
                    form: getForm
                }
            })
            .state('cms.question.id.edit', {
                url: '',
                templateUrl: 'components/question/form/form.tpl.html',
                controller: 'QuestionFormController',
                controllerAs: 'qfc',
                data: {
                    pageTitle: 'Question Edit'
                }
            }).state('cms.question.id.answer', {
                url: '/answer',
                templateUrl: 'components/answer/main.tpl.html',
                controller: 'AnswerMainController',
                controllerAs: 'amc',
                data: {
                    pageTitle: 'Answer'
                }
            });
        getId.$inject = ['$stateParams'];

        function getId($stateParams) {
            return $stateParams.id;
        }

        getForm.$inject = ['questionService', '$stateParams'];
        function getForm(questionService, $stateParams) {
            return questionService.read($stateParams.id);
        }
    }
})();
