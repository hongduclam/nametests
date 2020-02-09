(function (wObj) {
    'use strict';

    var from = 'AĂÂÁẮẤÀẰẦẢẲẨÃẴẪẠẶẬEÊẸỆÈỀẼỄẺỂÉẾIÍÌỊĨỈOÔƠÓỐỚÒỒỜỎỔỞÕỖỠỌỢỘUƯÚỨÙỪỦỬŨỮỤỰYÝỶỸỴỲĐaăâáắấàằầảẳẩạặậãẵẫeêẹệèềẽễẻểéếiíìịĩỉoôơóốớòồờỏổởọộợõỗỡuưúứùừủửụựũữyýỷỹỵỳđ·/,:;';
    var to = 'AAAAAAAAAAAAAAAAAAEEEEEEEEEEEEIIIIIIOOOOOOOOOOOOOOOOOOUUUUUUUUUUUUYYYYYYDaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeiiiiiioooooooooooooooooouuuuuuuuuuuuyyyyyyd-----';

    var _module = {
        ACCOUNTANT: {
            ACCOUNT: 'accountant_account',
            BANK_ACCOUNT: 'accountant_bank_account',
            CURRENCY: 'accountant_currency',
            CURRENCY_COMPANY: 'accountant_currency_company',
            INVOICE: 'accountant_invoice',
            TAX: 'accountant_tax',
            MONEY_TRANSACTION: 'accountant_money_transaction'
        },
        COMPANY: {
            BRANCH: 'company_branch',
            DEPARTMENT: 'company_department',
            POSITION: 'company_position',
            PROFILE: 'company_profile',
            STAFF: 'company_staff',
            WAREHOUSE: 'company_warehouse'
        },
        CUSTOMER: {
            COMPANY: 'customer_company',
            COMPANY_BRANCH: 'customer_company_branch',
            COMPANY_CATEGORY: 'customer_company_category',
            PERSON: 'customer_person',
            WARRANTY: {
                INBOUND: 'customer_warrantyIn',
                OUTBOUND: 'customer_warrantyOut'
            }
        },
        INVENTORY: {
            SUMMARY: 'inventory_summary',
            VOUCHER: 'inventory_voucher',
            VOUCHER_INPUT: 'inventory_voucher_input',
            VOUCHER_OUTPUT: 'inventory_voucher_output'
        },
        MEDIA: 'media',
        PRODUCT: {
            TYPE: 'product_type',
            CATEGORY: 'product_category',
            METADATA: 'product_metadata',
            DETAIL: 'product_detail'
        },
        PURCHASE: {
            CONTRACT: 'purchase_contract',
            ORDER: 'purchase_order'
        },
        SALE: {
            CONTRACT: 'sale_contract',
            COUPON: 'sale_coupon',
            ORDER: 'sale_order',
            PROJECT: 'sale_project',
            QUOTATION: 'sale_quotation'
        },
        SYSTEM: {
            ACCOUNT: 'system_account',
            GROUP: 'system_permission'
        },
        COMMENT: 'comment'
    };

    var _action = {
        CREATE: 'CREATE',
        CREATE_QUICK: 'CREATE_QUICK',
        READ: 'READ',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE',
        CONFIGURE: 'CONFIGURE',
        UPDATE_PRICE: 'UPDATE_PRICE',
        UPDATE_PROCESS_DATE: 'UPDATE_PROCESS_DATE',
        DOWNLOAD: 'DOWNLOAD',
        UPDATE_STATUS: 'UPDATE_STATUS'
    };

    var lncObj = {
        hasValue: hasValue,
        getInputSelection: getInputSelection,
        setInputSelection: setInputSelection,
        str2Slug: str2Slug,
        str2Id: str2Id,
        deleteArray: deleteArray,
        size: size,
        guid: guid,
        getScrollBarSize: getScrollBarSize,
        MODULE: _module,
        ACTION: _action
    };

    /**
     * Using http status code for application
     *
     * 420 Using for Local ERROR Status
     * @type {{unauthorized: number, initcompany}}
     */

    wObj.LNC_HTTP_STATUS = {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        ACCESS_DENIED: 403,
        INIT_COMPANY: 420,
        SESSION_TIMEOUT: 421,
        INTERNAL_ERROR: 500
    };

    wObj.LNC_EVENT = {
        LOGIN_REQUIRED: 'event:auth-loginRequired',
        DROPDOWN_CLOSE: 'event:dropdown-close',
        SESSION_TIMEOUT: 'event:sessionTimeout'
    };

    wObj.lnc = lncObj;
    /* eslint-enable */

    ////////////////////////////////
    /**
     * Generates a GUID string.
     * @returns {String} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser (slavik@meltser.info).
     * @link http://slavik.meltser.info/?p=142
     */
    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + '000000000').substr(2, 8);
            return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    function size(obj) {
        var rs = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                rs++;
            }
        }

        return rs;
    }

    /* eslint-disable */
    function getScrollBarSize() {
        var inner = document.createElement('p');
        inner.style.width = '100%';
        inner.style.height = '100%';

        var outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0px';
        outer.style.left = '0px';
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.height = '100px';
        outer.style.overflow = 'hidden';
        outer.appendChild(inner);

        document.body.appendChild(outer);

        var w1 = inner.offsetWidth;
        var h1 = inner.offsetHeight;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        var h2 = inner.offsetHeight;
        if (w1 === w2) w2 = outer.clientWidth;
        if (h1 === h2) h2 = outer.clientHeight;

        document.body.removeChild(outer);

        return [(w1 - w2), (h1 - h2)];
    }

    /** eslint-enable */

    function hasValue(item) {
        var rs = false;
        var itemType = typeof item;
        if (itemType !== 'undefined' && item !== null) {
            if (angular.isString(item) || angular.isArray(item)) {
                if (item.length > 0) {
                    rs = true;
                }
            } else {
                rs = true;
            }
        }
        return rs;
    }

    function deleteArray(obj) {
        if (angular.isArray(obj)) {
            obj.splice(0, obj.length);
        }
    }

    function getInputSelectionIE(input) {
        /* eslint-disable */
        var bookmark = document.selection.createRange().getBookmark();
        var range = input.createTextRange();
        var range2 = range.duplicate();

        range.moveToBookmark(bookmark);
        range2.setEndPoint('EndToStart', range);

        var start = range2.text.length;
        var end = start + range.text.length;
        return {
            start: start,
            end: end
        };
        /* eslint-enable */
    }

    function getInputSelection(input) {
        input = input[0];

        if (hasValue(input.selectionStart) && hasValue(input.selectionEnd)) {
            return {
                start: input.selectionStart,
                end: input.selectionEnd
            };
        }
        /* eslint-disable */
        if (document.selection) {
            return getInputSelectionIE(input);
        }
        /* eslint-enable */
    }

    function setInputSelectionIE(input, range) {
        var select = input.createTextRange();
        select.moveStart('character', range.start);
        select.collapse();
        select.moveEnd('character', range.end - range.start);
        select.select();
    }

    function setInputSelection(input, range) {
        input = input[0];

        if (input.setSelectionRange) {
            input.setSelectionRange(range.start, range.end);
        } else if (input.createTextRange) {
            setInputSelectionIE(input, range);
        }
    }

    function str2Slug(str) {
        str = str.replace(/^\s+|\s+$/g, '');
        // remove accents, swap ñ for n, etc
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^A-Za-z0-9 -]/g, '')
            // collapse whitespace and replace by -
            .replace(/\s+/g, '-')
            // collapse dashes
            .replace(/-+/g, '-');

        return str;
    }

    /*
     * This is convert any utf8 string to ascii, remove any space and keep only a-z,
     * A-Z, 0-9
     */
    function str2Id(str) {
        // trim
        str = str.replace(/^\s+|\s+$/g, '');

        // remove accents, swap ñ for n, etc
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^A-Za-z0-9]/g, '');

        return str;
    }
})(window);
