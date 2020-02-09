(function () {
    'use strict';
    angular
        .module('lnc.modal')
        .factory('lncModalStack', lncModalStack);

    lncModalStack.$inject = ['$log', '$compile', '$templateRequest', '$interpolate', '$document'];

    function lncModalStack($log, $compile, $templateRequest, $interpolate, $document) {
        var modalStore = [];
        var fromBootStrapEvent = true;
        var TYPE = {
            'PRIMARY': 'primary',
            'INFO': 'info',
            'WARNING': 'warning',
            'DANGER': 'danger',
            'SUCCESS': 'success'
        };
        var STYLE = {
            'NORMAL': 'normal',
            'TAB': 'tab',
            'FULLSCREEN': 'fullscreen'
        };

        var body = $document.find('body').eq(0);
        return {
            open: openModal,
            close: closeModal,
            dismiss: dismissModal
        };

        ////////////////

        function openModal(modalInstance, opts) {
            stackAdd(modalInstance, opts);

            var modalStyle = STYLE.NORMAL;
            if (opts.isTab) {
                modalStyle = STYLE.TAB;
            } else if (opts.isFullScreen) {
                modalStyle = STYLE.FULLSCREEN;
            }

            getModalTemplate(modalStyle).then(function (template) {
                var context;
                if (opts.isTab) {
                    var tabElement = angular.element(opts.content);
                    var tabNavigation = tabElement.find('tab-navigation').html();
                    var tabContent = tabElement.find('tab-content').html();
                    context = {
                        id: modalInstance.id,
                        type: opts.type || TYPE.PRIMARY,
                        size: opts.size || 'modal-md',
                        title: opts.title || '',
                        subtitle: opts.subtitle || '&nbsp;',
                        icon: opts.icon || '',
                        tabNavigation: tabNavigation,
                        tabContent: tabContent
                    };
                } else {
                    context = {
                        id: modalInstance.id,
                        type: opts.type || TYPE.PRIMARY,
                        size: opts.size || 'modal-md',
                        title: opts.title || '',
                        subtitle: opts.subtitle || '&nbsp;',
                        icon: opts.icon || '',
                        content: opts.content
                    };
                }

                var templateB4Comp = $interpolate(template)(context);
                var modalEls = createModal(opts.scope, templateB4Comp);
                modalEls.modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
                $log.info(modalEls);
                body.append(modalEls);
                stackGet(modalInstance.id).els = modalEls;

            });
        }

        function closeModal(modalId, result) {
            fromBootStrapEvent = false;
            var modalObj = stackGet(modalId);
            modalObj.els.modal('hide');
            modalObj.options.resultDeferred.resolve(result);
        }

        function dismissModal(modalId, reason) {
            fromBootStrapEvent = false;
            var modalObj = stackGet(modalId);
            modalObj.els.modal('hide');
            modalObj.options.resultDeferred.reject(reason);
        }

        function createModal(scope, template) {
            var modalEls = $compile(template)(scope);

            modalEls.on('show.bs.modal', modalShow);
            modalEls.on('shown.bs.modal', modalShown);

            modalEls.on('hide.bs.modal', modalHide);
            modalEls.on('hidden.bs.modal', modalHidden);

            modalEls.on('$destroy', function () {
                $log.info('modal destroy');
                modalEls.on('hide.bs.modal');
                modalEls.off('hidden.bs.modal');
                modalEls.off('show.bs.modal');
                modalEls.off('shown.bs.modal');
            });

            return modalEls;
        }

        function addStylePreviousModal() {
            var previousModal = stackGetPrevious();
            if (previousModal !== null) {
                var index = previousModal.index;
                if (previousModal.modal.els) {
                    var els = previousModal.modal.els.find('.modal-dialog');

                    var modalTranslateZ = -340 + index * 40;
                    var modalTranslateZCss = modalTranslateZ.toString() + 'px';

                    els.css({
                        '-webkit-transform-style': 'preserve-3d',
                        '-ms-transform-style': 'preserve-3d',
                        '-o-transform-style': 'preserve-3d',
                        'transform-style': 'preserve-3d'
                    });
                    els.css({
                        '-webkit-transform': modalTranslateZCss,
                        '-moz-transform': modalTranslateZCss,
                        '-o-transform': modalTranslateZCss,
                        '-ms-transform': modalTranslateZCss,
                        'transform': modalTranslateZCss
                    });
                    els.css({
                        '-webkit-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                        '-ms-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                        '-o-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                        'transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')'
                    });
                }
            }
        }

        function removeStylePreviousModal() {
            var previousModal = stackGetPrevious();
            if (previousModal !== null) {
                var els = previousModal.modal.els.find('.modal-dialog');

                els.css({
                    /*'-webkit-transform-style': 'preserve-3d',
                     '-ms-transform-style': 'preserve-3d',
                     '-o-transform-style': 'preserve-3d',*/
                    'transform-style': 'flat'
                });
                els.css({
                    /*'-webkit-transform': modalTranslateZCss,
                     '-moz-transform': modalTranslateZCss,
                     '-o-transform': modalTranslateZCss,
                     '-ms-transform': modalTranslateZCss,*/
                    'transform': ''
                });
                /*els.css({
                 '-webkit-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                 '-ms-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                 '-o-transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')',
                 'transform': 'scale(0.8) rotateY(45deg) translateZ(' + modalTranslateZCss + ')'
                 });*/
            }
        }

        function modalHide() {
            removeStylePreviousModal();
            if (stackIsLast()) {
                body.removeClass('modal-open modal-open-noscroll');
                //body.attr('style', '');
            }
        }

        function modalHidden(e) {
            var modalId = getModalElementId(e);
            var modalObj = stackGet(modalId);
            if (fromBootStrapEvent) {
                modalObj.options.resultDeferred.reject('');
            }

            fromBootStrapEvent = true;
            modalObj.options.scope.$destroy();
            modalObj.els.remove();
            stackRemove(modalId);
        }

        function modalShow(e) {
            var modalId = getModalElementId(e);
            var isModalOpen = body.hasClass('modal-open');
            if (!isModalOpen) {
                body.addClass('modal-open modal-open-noscroll');
                //var scrollbarSize = lnc.getScrollBarSize();
                //body.attr('style', 'padding-right: ' + scrollbarSize[0] + 'px !important');
            }
            var modalOptions = stackGet(modalId).options;
            if (modalOptions.effect) {
                addStylePreviousModal();
            }
        }

        function modalShown(e) {
            var modalId = getModalElementId(e);
            $log.info(modalId);
            var modalOptions = stackGet(modalId).options;
            modalOptions.openedDeferred.resolve(e);
        }

        function getModalElementId(e) {
            return e.currentTarget.dataset.modal || '';
        }

        function getModalTemplate(style) {
            if (style === STYLE.TAB) {
                return $templateRequest('components/widget/modal/modal-tab.tpl.html');
            } else if (style === STYLE.FULLSCREEN) {
                return $templateRequest('components/widget/modal/modal-fullscreen.tpl.html');
            }

            return $templateRequest('components/widget/modal/modal.tpl.html');
        }

        function stackAdd(modalInstance, options) {
            var stackItem = {
                instance: modalInstance,
                options: options
            };
            modalStore.push(stackItem);
            return stackItem;
        }

        function stackGet(lncModalId) {
            var rs = null;
            for (var i = 0; i < modalStore.length; i++) {
                if (modalStore[i].instance.id === lncModalId) {
                    rs = modalStore[i];
                    break;
                }
            }
            return rs;
        }

        function stackGetPrevious() {
            var rs = null;
            if (modalStore.length >= 2) {
                rs = {
                    index: modalStore.length - 2,
                    modal: modalStore[modalStore.length - 2]
                };
            }

            return rs;
        }

        function stackIsLast() {
            if (modalStore.length === 1) {
                return true;
            }
            return false;
        }

        function stackRemove(lncModalId) {
            var pos = -1;

            for (var i = 0; i < modalStore.length; i++) {
                if (modalStore[i].instance.id === lncModalId) {
                    pos = i;
                    break;
                }
            }
            if (pos > -1) {
                modalStore.splice(pos, 1);
            }
        }
    }
})();

