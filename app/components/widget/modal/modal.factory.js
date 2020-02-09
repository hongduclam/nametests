(function () {
    'use strict';
    angular
        .module('lnc.modal')
        .provider('lncModalService', lncModalService);

    function lncModalService () {
        this.$get = modalProvider;

        modalProvider.$inject = ['$log', '$injector', '$rootScope', '$q', '$templateRequest', '$controller', 'lncModalStack'];

        function modalProvider ($log, $injector, $rootScope, $q, $templateRequest, $controller, lncModalStack) {
            var promiseChain = null;
            var options = {};
            return {
                open: openModal,
                confirm: confirmModal,
                alert: alertModal
            };

            function confirmModal(opt){
                var confirmOptions = {
                    effect: false,
                    title: 'Confirm',
                    type: opt.type,
                    icon: '<i class="fa fa-question fa-fw"></i>',
                    templateUrl: 'components/widget/modal/confirm.tpl.html',
                    controller: 'ModalConfirmController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        option: function(){
                            return opt;
                        }
                    }
                };

                return openModal(confirmOptions);
            }

            function alertModal(opt){
                var confirmOptions = {
                    effect: false,
                    title: 'Alert',
                    type: opt.type,
                    icon: '<i class="fa fa-info fa-fw"></i>',
                    templateUrl: 'components/widget/modal/alert.tpl.html',
                    controller: 'ModalAlertController',
                    controllerAs: 'vm',
                    bindToController: true,
                    resolve: {
                        option: function(){
                            return opt;
                        }
                    }
                };

                return openModal(confirmOptions);
            }

            /**
             *
             * @param modalOptions {
             *      title: '',
             *      subtitle: '',
             *      icon: '',
             *      template/templateUrl: '',
             *      controller: ''
             *      controllerAs: '',
             *      bindToController: true/false,
             *      resolves: {
             *      }
             * }
             * @returns {{result: *, opened: *, rendered: *, close: Function, dismiss: Function}}
             */
            function openModal (modalOptions) {

                var modalResultDeferred = $q.defer();
                var modalOpenedDeferred = $q.defer();

                //prepare an instance of a modal to be injected into controllers and returned to a caller
                var modalInstance = {
                    id: 'modal-' + lnc.guid(),
                    result: modalResultDeferred.promise,
                    opened: modalOpenedDeferred.promise,
                    close: function (result) {
                        return lncModalStack.close(modalInstance.id, result);
                    },
                    dismiss: function (reason) {
                        return lncModalStack.dismiss(modalInstance.id, reason);
                    },
                    notify: function(data){
                        return modalResultDeferred.notify(data);
                    }
                };

                //merge and clean up options
                modalOptions = angular.extend({}, options, modalOptions);
                modalOptions.resolve = modalOptions.resolve || {};

                //verify options
                if (!modalOptions.template && !modalOptions.templateUrl) {
                    throw new Error('One of template or templateUrl options is required.');
                }

                var templateAndResolvePromise
                    = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                // Wait for the resolution of the existing promise chain.
                // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
                // Then add to $modalStack and resolve opened.
                // Finally clean up the chain variable if no subsequent modal has overwritten it.
                var samePromise;
                samePromise = promiseChain = $q.all([promiseChain])
                    .then(function () {
                        return templateAndResolvePromise;
                    }, function () {
                        return templateAndResolvePromise;
                    }).then(function resolveSuccess (tplAndVars) {

                        var modalScope = (modalOptions.scope || $rootScope).$new();

                        modalScope.$close = modalInstance.close;
                        modalScope.$dismiss = modalInstance.dismiss;
                        modalScope.$notify = modalInstance.notify;
                        modalScope.$on('$destroy', function () {
                            $log.info('Modal scope destroy');
                        });

                        var ctrlInstance, ctrlLocals = {};
                        var resolveIter = 1;

                        //controllers
                        if (modalOptions.controller) {
                            ctrlLocals.$scope = modalScope;
                            ctrlLocals.$modalInstance = modalInstance;
                            angular.forEach(modalOptions.resolve, function (value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++];
                            });

                            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                            if (modalOptions.controllerAs) {
                                if (modalOptions.bindToController) {
                                    angular.extend(ctrlInstance, modalScope);
                                }

                                modalScope[modalOptions.controllerAs] = ctrlInstance;
                            }
                        }

                        lncModalStack.open(modalInstance, {
                            scope: modalScope,
                            resultDeferred: modalResultDeferred,
                            openedDeferred: modalOpenedDeferred,
                            isTab: modalOptions.isTab || false,
                            isFullScreen: modalOptions.isFullScreen || false,
                            effect: angular.isDefined(modalOptions.effect) ? modalOptions.effect : true,
                            content: tplAndVars[0],
                            size: modalOptions.size,
                            type: modalOptions.type,
                            title: modalOptions.title,
                            subtitle: modalOptions.subtitle,
                            icon: modalOptions.icon
                        });
                    }, function resolveError (reason) {
                        modalOpenedDeferred.reject(reason);
                        modalResultDeferred.reject(reason);
                    })
                    .finally(function () {
                        if (promiseChain === samePromise) {
                            promiseChain = null;
                        }
                    });

                return modalInstance;
            }

            function getTemplatePromise (modalOptions) {
                return modalOptions.template ? $q.when(modalOptions.template)
                    : $templateRequest(angular.isFunction(modalOptions.templateUrl)
                    ? (modalOptions.templateUrl)() : modalOptions.templateUrl);
            }

            function getResolvePromises (resolves) {
                var promisesArr = [];
                angular.forEach(resolves, function (value) {
                    if (angular.isFunction(value) || angular.isArray(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    } else if (angular.isString(value)) {
                        promisesArr.push($q.when($injector.get(value)));
                    } else {
                        promisesArr.push($q.when(value));
                    }
                });
                return promisesArr;
            }
        }
    }
})();

