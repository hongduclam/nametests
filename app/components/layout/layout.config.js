(function () {
    'use strict';

    angular.module('hdl.layout').config(configProcess);

    configProcess.$inject = ['$stateProvider', '$urlRouterProvider', '$provide', 'FacebookProvider'];

    function configProcess($stateProvider, $urlRouterProvider, $provide, FacebookProvider) {
        FacebookProvider.init('197358550721348');

        $.fn.select2.defaults.set('theme', 'bootstrap');

        $provide.decorator('taOptions', taOptionsSetup);

        // Redirect any unmatched url
        $urlRouterProvider.otherwise('/account/login');

        $stateProvider
            .state('cms', {
                url: '',
                templateUrl: 'components/layout/main.tpl.html',
                abstract: true
            })
            .state('cms.log', {
                url: '/log',
                templateUrl: 'components/dashboard/log/log.tpl.html',
                controller: 'LogController',
                controllerAs: 'lc',
                data: {
                    pageTitle: 'Activity History'
                }
            })
            .state('cms.search', {
                url: '/search/all/{text}',
                templateUrl: 'components/dashboard/search/search.result.tpl.html',
                controller: 'SearchResultController',
                controllerAs: 'src',
                data: {
                    pageTitle: 'Search Result'
                }
            })
            .state('cms.accessDenied', {
                url: '/403',
                template: '<span>Access Denied</span>'
            })
            .state('cms.notfound', {
                url: '/404',
                template: '<span>Not found</span>'
            })
            .state('cms.question', {
                url: '/question',
                template: '<ui-view/>',
                abstract: true
            });
    }

    taOptionsSetup.$inject = ['$delegate', 'taRegisterTool', 'lncMediaService', '$log'];

    function taOptionsSetup(taOptions, taRegisterTool, lncMediaService, $log){
        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'],
            ['bold', 'italics', 'underline', 'ul', 'ol'],
            ['justifyLeft', 'justifyCenter', 'justifyRight'],
            ['undo', 'redo', 'html']
        ];

        taOptions.forceTextAngularSanitize = false;

        taOptions.classes = {
            focussed: 'focussed',
            toolbar: 'btn-toolbar',
            toolbarGroup: 'btn-group',
            toolbarButton: 'btn btn-default',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'form-control',
            htmlEditor: 'form-control'
        };

        taRegisterTool('lncInsertImage', {
            iconclass: 'fa fa-picture-o fa-fw',
            action: function (deferred, restoreSelection) {
                var textAngular = this;

                var modal = lncMediaService.modal('image');

                modal.result.then(function (data) {
                    $log.info(data);
                    restoreSelection();
                    textAngular.$editor().wrapSelection('insertImage', lncMediaService.download(data), true);
                    deferred.resolve();
                }, function(){
                    deferred.reject();
                });

                return false;
            }
        });

        // Now add the button to the default toolbar definition
        // Note: It'll be the last button
        taOptions.toolbar[3].push('lncInsertImage');

        return taOptions;
    }
})();
