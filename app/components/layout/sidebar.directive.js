/**
 * Sidebar Menu
 *
 *   - Using for both Mobile Menu and Sidebar
 */

(function () {
    'use strict';
    angular.module('hdl.layout').directive('lncLayoutSidebar', lncLayoutSidebar);

    lncLayoutSidebar.$inject = ['$state', 'lncLayout', 'userService'];

    function lncLayoutSidebar ($state, lncLayout, userService) {
        return {
            link: link,
            templateUrl: 'components/layout/sidebar.tpl.html',
            restrict: 'E',
            replace: true
        };

        function link (scope, element) {
            scope.$state = $state;

            var menu = angular.element(element[0].children[0].children[0]);

            element.on('click', 'li > a', function (e) {
                var sub = angular.element(this).next();

                if (!sub.hasClass('sub-menu')) {
                    //angular.element(element).find('.responsive-toggler').trigger('click');
                    element.find('.collapse').collapse('hide');
                    return;
                }

                if (sub.hasClass('sub-menu always-open')) {
                    return;
                }

                var parentEls = angular.element(this).parent().parent();
                var the = angular.element(this);

                var autoScroll = menu.data('auto-scroll');
                var slideSpeed = parseInt(menu.data('slide-speed'));
                var keepExpand = menu.data('keep-expanded');

                if (keepExpand !== true) {
                    parentEls.children('li.open').children('a').children('.arrow').removeClass('open');
                    parentEls.children('li.open').children('.sub-menu:not(.always-open)').slideUp(slideSpeed);
                    parentEls.children('li.open').removeClass('open');
                }

                var slideOffeset = -200;

                if (sub.is(':visible')) {
                    angular.element(this).find('.arrow').removeClass('open');
                    //jQuery('.arrow', jQuery(this)).removeClass('open');
                    angular.element(this).parent().removeClass('open');
                    sub.slideUp(slideSpeed, function () {
                        if (autoScroll === true && angular.element('body').hasClass('page-sidebar-closed') === false) {
                            if (angular.element('body').hasClass('page-sidebar-fixed')) {
                                menu.slimScroll({
                                    'scrollTo': (the.position()).top
                                });
                            } else {
                                lncLayout.scrollTo(the, slideOffeset);
                            }
                        }
                    });
                } else if (sub.hasClass('sub-menu')) {
                    angular.element(this).find('.arrow').addClass('open');
                    angular.element(this).parent().addClass('open');
                    sub.slideDown(slideSpeed, function () {
                        if (autoScroll === true && angular.element('body').hasClass('page-sidebar-closed') === false) {
                            if (angular.element('body').hasClass('page-sidebar-fixed')) {
                                menu.slimScroll({
                                    'scrollTo': (the.position()).top
                                });
                            } else {
                                lncLayout.scrollTo(the, slideOffeset);
                            }
                        }
                    });
                }

                e.preventDefault();
            });
        }
    }
})();
