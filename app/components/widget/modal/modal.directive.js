(function () {
    'use strict';

    angular
        .module('lnc.modal')
        .directive('lncModal', lncModal)
        .directive('lncModalTab', lncModalTab);

    function lncModal() {
        var modalStack = [];
        var modalTemplate = [
            '<div class="modal modal-scroll fade" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">',
            '<div class="modal-dialog ',
            //2
            '{{::size}}',
            '">',
            '<div class="modal-content">',
            '<div class="modal-body">',
            //Start portlet
            '<div class="portlet box blue-madison">',
            '<div class="portlet-title">',
            '<div class="caption">',
            //9
            '{{::icon}}',
            '<span class="caption-subject bold uppercase">',
            //11
            '{{::title}}',
            '</span>',
            '<span class="caption-helper">',
            //14
            '{{subtitle}}',
            '</span>',
            '</div>',
            '<div class="actions">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>',
            '</div>',
            '</div>',
            '<div class="portlet-body">',
            //22
            '{{::body}}',
            '</div>',
            '</div>',
            //End portlet
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ];

        return {
            restrict: 'EA',
            replace: true,
            template: template,
            compile: compile
        };

        ////////////////
        function template(e, a) {
            var icon = e.find('icon');
            var body = e.find('modal-body');
            var title = e.find('title');
            var subtitle = e.find('subtitle');
            var modalSize = a.size || '';

            modalTemplate[2] = modalSize;
            modalTemplate[9] = icon.html();
            modalTemplate[11] = title.html();
            modalTemplate[14] = subtitle.html();
            modalTemplate[22] = body.html();

            return modalTemplate.join('');
        }

        function compile() {
            return {
                pre: linkFunc
            };
        }

        function linkFunc(scope, element) {
            element.on('show.bs.modal', modalShow);

            element.on('hide.bs.modal', modalHide);

            scope.$on('$destroy', function () {
                element.off('hide.bs.modal');
                element.off('show.bs.modal');
            });
        }

        function modalHide() {
            var body = angular.element('body');
            var currentSize = modalStack.length - 1;
            if (currentSize >= 1) {
                var previousDialog = modalStack[currentSize - 1];
                previousDialog.removeClass('aside');
            } else {
                body.removeClass('modal-open modal-open-noscroll');
            }
            modalStack.splice(currentSize, 1);
        }

        function modalShow(e) {
            var body = angular.element('body');
            var isModalOpen = body.hasClass('modal-open');

            var stackSize = modalStack.length;
            var newDialog = angular.element(e.currentTarget).find('.modal-dialog');
            if (stackSize > 0) {
                var currentDialog = modalStack[stackSize - 1];
                currentDialog.addClass('aside');
                currentDialog.addClass('aside-' + stackSize);
            }

            if (!isModalOpen) {
                body.addClass('modal-open modal-open-noscroll');
            }

            modalStack.push(newDialog);
        }
    }

    function lncModalTab() {
        var modalStack = [];
        var modalTemplate = [
            '<div class="modal modal-scroll fade in" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">',
            '<div class="modal-dialog ',
            //2
            '{{::size}}',
            '">',
            '<div class="modal-content">',
            '<div class="modal-body">',
            //Start portlet
            '<div class="portlet box blue-madison">',
            '<div class="portlet-title">',
            '<div class="caption">',
            //9
            '{{::icon}}',
            '<span class="caption-subject bold uppercase">',
            //11
            '{{::title}}',
            '</span>',
            '<span class="caption-helper">',
            //14
            '{{subtitle}}',
            '</span>',
            '</div>',
            '<div class="actions">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>',
            '</div>',
            //20 tab navigation
            '{{::tabNavigation}}',
            '</div>',
            '<div class="portlet-body">',
            //23
            '{{::body}}',
            '</div>',
            '</div>',
            //End portlet
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ];

        return {
            restrict: 'EA',
            replace: true,
            template: template,
            compile: compile
        };

        ////////////////
        function template(e, a) {
            var icon = e.find('icon');
            var body = e.find('modal-body');
            var title = e.find('title');
            var subtitle = e.find('subtitle');
            var modalSize = a.size || '';
            var tabNavigation = e.find('tab-navigation');

            modalTemplate[2] = modalSize;
            modalTemplate[9] = icon.html();
            modalTemplate[11] = title.html();
            modalTemplate[14] = subtitle.html();
            modalTemplate[20] = tabNavigation.html();
            modalTemplate[23] = body.html();

            return modalTemplate.join('');
        }

        function compile() {
            return {
                pre: linkFunc
            };
        }

        function linkFunc(scope, element) {
            element.on('show.bs.modal', modalShow);

            element.on('hide.bs.modal', modalHide);

            scope.$on('$destroy', function () {
                element.off('hide.bs.modal');
                element.off('show.bs.modal');
            });
        }

        function modalHide() {
            var body = angular.element('body');
            var currentSize = modalStack.length - 1;
            if (currentSize >= 1) {
                var previousDialog = modalStack[currentSize - 1];
                previousDialog.removeClass('aside');
            } else {
                body.removeClass('modal-open modal-open-noscroll');
            }
            modalStack.splice(currentSize, 1);
        }

        function modalShow(e) {
            var body = angular.element('body');
            var isModalOpen = body.hasClass('modal-open');

            var stackSize = modalStack.length;
            var newDialog = angular.element(e.currentTarget).find('.modal-dialog');
            if (stackSize > 0) {
                var currentDialog = modalStack[stackSize - 1];
                currentDialog.addClass('aside');
                currentDialog.addClass('aside-' + stackSize);
            }

            if (!isModalOpen) {
                body.addClass('modal-open modal-open-noscroll');
            }

            modalStack.push(newDialog);
        }
    }
})();

