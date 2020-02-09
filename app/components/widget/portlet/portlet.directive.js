(function () {
    'use strict';
    angular
        .module('lnc.portlet')
        .directive('lncPortlet', lncPortlet);
    lncPortlet.$inject = [];

    function lncPortlet() {
        var portletTemplate = [
            '<div class="portlet">',
            '<div class="portlet-title {{tab}}">',
            '<div class="caption">', '', '</div>',
            //3 - caption
            '<div class="actions">', '',
            //6 - action
            '</div>',
            '',
            // 8 - tab
            '</div>',
            '<div class="portlet-body">', '',
            //11 - body
            '</div>',
            '</div>'
        ];

        return {
            replace: true,
            restrict: 'E',
            template: template
        };
        function template(e) {
            var portlet = {
                caption: e.find('portlet-caption') || '',
                action: e.find('portlet-action') || '',
                tab: e.find('portlet-tab') || '',
                body: e.find('portlet-body') || ''
            };

            // caption font-color
            if (lnc.hasValue(portlet.caption)) {
                var obj = portlet.caption.find('.caption-subject');
                if (lnc.hasValue(obj) && !obj.hasClass('font*')) {
                    obj.addClass('font-green-haze');
                }
            }
            // tab-nav color
            if (portlet.tab.length) {
                portletTemplate[1] = portletTemplate[1].replace('{{tab}}', 'tabbable-line');
            }

            portletTemplate[3] = portlet.caption.html();
            portletTemplate[6] = portlet.action.html();
            portletTemplate[8] = portlet.tab.html();
            portletTemplate[11] = portlet.body.html();
            return portletTemplate.join('');
        }

    }
})();
