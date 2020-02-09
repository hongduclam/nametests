(function () {
    'use strict';

    angular
        .module('hdl.question')
        .directive('designSubImg', designSubImg);
    designSubImg.$inject = ['lncModalService'];

    function designSubImg (lncModalService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=ngModel'
            },
            templateUrl: 'components/question/design/design-sub-img-btn.html',
            link: _link
        };
        function _link(scope, e, a){
            scope.openModal = openModal;
            /////////////////

            function openModal () {
                var modalInstance = lncModalService.open({
                    templateUrl: 'components/question/design/design-sub-img-modal.html',
                    title: 'Design',
                    controller: 'DesignSubImageModalController',
                    controllerAs: 'vm',
                    size: 'modal-full',
                    bindToController: true,
                    resolve: {
                        designData: angular.copy(scope.data)
                    }
                });
                modalInstance.result.then(function (data) {
                    if(data){
                        scope.data.imageSubId = data.id;
                    }

                }, function () {
                }, function (data) {
                    if(data){
                        scope.data.imageSubId = data.id;
                    }
                });
            }

        }
    }
})();
