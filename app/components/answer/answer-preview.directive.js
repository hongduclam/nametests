(function () {
    'use strict';

    angular
        .module('hdl.answer')
        .directive('answerPreview', answerPreview);
    answerPreview.$inject = ['lncModalService'];

    function answerPreview(lncModalService) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                answerData: '=ngModel'
            },
            templateUrl: 'components/answer/answer-preview-btn.html',
            link: _link,
        };
        function _link(scope, e, a) {
            scope.openModal = openModal;
            /////////////////

            function openModal () {

                var modalInstance = lncModalService.open({
                    templateUrl: 'components/answer/answer-preview-modal.html',
                    title: 'Answer Preview',
                    controller: 'AnswerPreviewModalController',
                    controllerAs: 'vm',
                    size: 'modal-full',
                    bindToController: true,
                    resolve: {
                        answerData: angular.copy(scope.answerData)
                    }
                });
                modalInstance.result.then(function (data) {
                }, function () {
                }, function (data) {
                });
            }

        }
    }
})();
