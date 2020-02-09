/**
 * @Desc
 *  Manage the whole layout, this service will replace Metronic.js
 */
(function(){
    'use strict';
    angular.module('hdl.layout').service('lncLayout', lncLayout);

    lncLayout.$inject = ['$timeout', 'lncToastr'];
    function lncLayout($timeout, toastrService){
        var loadingSpinner = 'image/loading-spinner-grey.gif';

        return {
            pageAutoScrollOnLoad: 1000,
            scrollTo: layoutScrollTo,
            blockUI: blockUI,
            unblockUI: unblockUI,
            alert: alertMsg,
            toastr: showToastr,
            getUniqueID: getUniqueID
        };

        function showToastr(message, title, type, opts){
            var fn;
            switch (type){
                case 'success':
                    fn = toastrService.success;
                    break;
                case 'warning':
                    fn = toastrService.warning;
                    break;
                case 'error':
                    fn = toastrService.error;
                    break;
                default:
                    fn = toastrService.info;
                    break;
            }
            fn(message, title, opts);
        }

        function getUniqueID() {
            var time = (new Date()).getTime();
            return 'prefix_' + time + Math.floor(Math.random() * time);
        }

        function alertMsg(options){
            options = angular.extend({
                container: '',
                place: 'append',
                type: 'success',
                message: '',
                close: true,
                reset: true,
                focus: true,
                closeInSeconds: 0,
                icon: ''
            }, options);

            var alertEls = angular.element('<div class="lnc-alert alert-dismissible alert alert-' + options.type + ' fade in">'
                + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                + '<span aria-hidden="true">&times;</span></button>' : '')
                + (options.icon !== '' ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '')
                + options.message + '</div>');

            if (options.reset) {
                angular.element('.lnc-alert').remove();
            }

            if (!options.container) {
                var pageContent = angular.element('.page-content');
                pageContent.prepend(alertEls);
            } else {
                var container = angular.element(options.container);
                if (options.place === 'append') {
                    container.append(alertEls);
                } else {
                    container.prepend(alertEls);
                }
            }

            if (options.focus) {
                layoutScrollTo(alertEls);
            }

            if (options.closeInSeconds > 0) {
                $timeout(function() {
                    alertEls.remove();
                }, options.closeInSeconds * 1000);
            }

            return alertEls;
        }

        function blockUI(options) {
            options = angular.extend({}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">'
                    + '<div class="block-spinner-bar">'
                    + '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
                    + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '')
                    + '"><img src="' + loadingSpinner + '" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '')
                    + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '')
                    + '"><img src="' + loadingSpinner + '" align=""><span>&nbsp;&nbsp;'
                    + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) {
                var el = angular.element(options.target);
                if (el.height() <= (angular.element(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY || false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else {
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        }

        function unblockUI(target) {
            if (target) {
                angular.element(target).unblock({
                    onUnblock: function() {
                        angular.element(target).css('position', '');
                        angular.element(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        }

        function layoutScrollTo(el, offeset) {
            var body = angular.element('html,body');
            var pos = (el && el.size() > 0) ? el.offset().top : 0;
            if (el) {
                var pageHeader = body.find('.page-header');
                var pageHeaderTop = body.find('.page-header-top');
                var pageHeaderMenu = body.find('.page-header-menu');
                if (body.hasClass('page-header-fixed')) {
                    pos = pos - pageHeader.height();
                } else if (body.hasClass('page-header-top-fixed')) {
                    pos = pos - pageHeaderTop.height();
                } else if (body.hasClass('page-header-menu-fixed')) {
                    pos = pos - pageHeaderMenu.height();
                }
                pos = pos + (offeset || -1 * el.height());
            }

            body.animate({
                scrollTop: pos
            }, 'fast');
        }
    }
})();
