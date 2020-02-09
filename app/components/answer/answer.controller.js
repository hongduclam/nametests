(function () {
    'use strict';
    angular
        .module('hdl.answer')
        .controller('AnswerMainController', AnswerMainController);

    AnswerMainController.$inject = ['lncModalService', 'answerService', 'questionService', 'dataFilterService',
        'lncMediaService', '$timeout', 'Facebook', 'lncLayout', 'id', 'form'];

    function AnswerMainController(lncModalService, answerService,
                                  questionService, dataFilterService, lncMediaService, $timeout,
                                  Facebook, lncLayout, id, form) {
        var scope = this;
        var canvas = null;

        var dataTest = {
            username: 'admin',
            avatar: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p720x720/12510488_987402538006338_6781918153504332534_n.jpg?oh=74b35da68b770eab33470287ed9d96b6&oe=58D7503F',
            cover: 'https://scontent.xx.fbcdn.net/v/t31.0-8/s720x720/10275432_987402808006311_2456501096365797544_o.jpg?oh=0f369a0018a1b03f07eae3a9b6508838&oe=59155F67'
        };

        $timeout(function () {
            initCanvas();
            initEventInput();
            loadCanvas();
        }, 500);

        scope.photoFb = {
            width: 500,
            height: 400
        };

        scope.questionData = angular.copy(form);
        scope.questionData.id = id;
        scope.answer = form.itemAnswer || {};
        scope.addResultToCanvas = addResultToCanvas;
        scope.addImageSys = addImageSys;
        scope.openPopupFile = openPopupFile;
        scope.addToFaceDataEdit = addToFaceDataEdit;
        scope.addFbToCanvas = addFbToCanvas;
        scope.canvasRemoveObj = canvasRemoveObj;
        scope.updateOpt = _updateOpt;
        scope.addDataFilterToEdit = addDataFilterToEdit;
        scope.filterDataSys = filterDataSys;
        scope.filterChar = filterChar;
        scope.addToEdit = addToEdit;
        scope.save = save;
        scope.canvasRemoveAllObj = canvasRemoveAllObj;
        scope.options = {
            opacity: 1
        };

        var FILTER_TYPE = {
            ONLY_SYS: 0,
            ONLY_FB: 1,
            FB_FILTER_ALL_SYS: 2,
            FB_FILTER_CHAR_SYS: 3,
            FILTER_RANDOM_SYS: 4,
            FILTER_RANDOM_PERCENT: 5
        };

        scope.filterTypeOpts = [
            {id: FILTER_TYPE.ONLY_SYS, name: 'ONLY_SYS'},
            {id: FILTER_TYPE.ONLY_FB, name: 'ONLY_FB'},
            {id: FILTER_TYPE.FB_FILTER_ALL_SYS, name: 'FB_FILTER_ALL_SYS'},
            {id: FILTER_TYPE.FB_FILTER_CHAR_SYS, name: 'FB_FILTER_CHAR_SYS'},
            {id: FILTER_TYPE.FILTER_RANDOM_SYS, name: 'FILTER_RANDOM_SYS'},
            {id: FILTER_TYPE.FILTER_RANDOM_PERCENT, name: 'FILTER_RANDOM_PERCENT'}
        ];

        var ANSWER_TYPE = {
            NORMAL: 0,
            SLIDE: 1
        };


        /////////////////////////////
        function loadCanvas() {
            if (scope.answer && scope.answer.id) {
             /*   scope.answer.itemAnswerImages.sort(function (a, b) {
                    return parseInt(JSON.parse(a.imageOpts).order) - parseInt(JSON.parse(b.imageOpts).order);
                });*/
                for (var i = 0; i < scope.answer.itemAnswerImages.length; i++) {
                    var itemImage = scope.answer.itemAnswerImages[i];
                    var imgTemp = new Image();
                    imgTemp.crossOrigin = "Anonymous";
                    imgTemp.onload = (function (val) {
                        var item = scope.answer.itemAnswerImages[val];
                        var opt = JSON.parse(item.imageOpts);
                        var oImg = new fabric.Image(imgTemp);
                        oImg.set({
                            left: opt.left,
                            top: opt.top,
                            angle: 0,
                            width: opt.width,
                            height: opt.height,
                            scaleX: opt.scaleX,
                            scaleY: opt.scaleY,
                            opacity: opt.opacity,
                            userData: {
                                type: 'img',
                                filterType: item.filterType,
                                fbKey: item.field,
                                id: item.imageId,
                                order: item.order
                            }
                        });
                        canvas.add(oImg);
                        canvas.setActiveObject(oImg);
                        if (scope.answer.itemAnswerImages.length == canvas.getObjects().length) {
                            for (var i = 0; i < scope.answer.itemAnswerTexts.length; i++) {
                                var itemText = scope.answer.itemAnswerTexts[i];
                                var opt = JSON.parse(itemText.textOpts);
                                var text = itemText.filterType == FILTER_TYPE.ONLY_FB ? dataTest.username : itemText.text;
                                if (!text) text = opt.text;

                                var textObj = new fabric.Text(text, {
                                    left: opt.left,
                                    top: opt.top,
                                    fontSize: opt.fontSize || 20,
                                    fontWeight: opt.fontWeight,
                                    hasRotatingPoint: true,
                                    fill: opt.fill,
                                    fontFamily: opt.fontFamily,
                                    textAlign: opt.textAlign,
                                    scaleX: opt.scaleX,
                                    scaleY: opt.scaleY,
                                    opacity: opt.opacity,
                                    userData: {
                                        type: 'text',
                                        filterType: itemText.filterType,
                                        fbKey: itemText.field,
                                        id: canvas.getObjects().length,
                                        order: itemText.order
                                    }
                                });
                                canvas.add(textObj);
                                canvas.setActiveObject(textObj);
                            }
                            canvas.renderAll();
                        }
                        canvas.renderAll();
                    })(i)
                    imgTemp.src = itemImage.filterType == FILTER_TYPE.ONLY_FB ? dataTest.avatar : lncMediaService.imageUrl(itemImage.imageId);
                }
            }
        }

        //////////////////////////////////////////////////////////////
        function canvasRemoveAllObj() {
            canvas.clear();
            if (scope.answer) {
                scope.answer.itemAnswerTexts = [];
                scope.answer.itemAnswerImages = [];
            }
            canvas.renderAll();
        }

        function addToEdit(filterType) {
            switch (filterType) {
                case FILTER_TYPE.FB_FILTER_CHAR_SYS:
                    filterChar(scope.answer.facebookCode);
                    break;
                case FILTER_TYPE.FILTER_RANDOM_SYS:
                    filterDataSys();
                    break;
                case FILTER_TYPE.FILTER_RANDOM_PERCENT:
                    filterRandomPercent();
                    break;
            }
        }

        function save() {
            /*
             * */
            scope.isLoading = true;
            var objects = canvas.getObjects();
            var itemAnswerTexts = [], itemAnswerImages = [];
            for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                if (obj.userData.type == 'text') {
                    var itemText = {
                        text: obj.userData.filterType == FILTER_TYPE.ONLY_SYS ? obj.text : '',
                        textOpts: JSON.stringify(obj),
                        filterType: obj.userData.filterType,
                        field: obj.userData.fbKey,
                        order: obj.userData.order
                    };
                    itemAnswerTexts.push(itemText);

                } else if (obj.userData.type == 'img') {
                    var itemImage = {
                        imageOpts: JSON.stringify(obj),
                        filterType: obj.userData.filterType,
                        imageId: obj.userData.id,
                        field: obj.userData.fbKey,
                        order: obj.userData.order
                    };
                    itemAnswerImages.push(itemImage);
                }
            }
            scope.answer.type = ANSWER_TYPE.NORMAL;
            scope.answer.itemAnswerTexts = itemAnswerTexts;
            scope.answer.itemAnswerImages = itemAnswerImages;
            var processPromise = null;

            if (!scope.answer.id) {
                processPromise = answerService.create(scope.questionData.id, scope.answer).then(function (rp) {
                    console.log(rp);
                    scope.answer.id = rp.data;
                    return rp;
                });
            } else {
                processPromise = answerService.update(scope.questionData.id, scope.answer.id, scope.answer).then(function (rp) {
                    console.log(rp);
                    scope.answer.id = rp.data;
                    return rp;
                });
            }

            processPromise.then(function (data) {
                lncLayout.toastr(data.message, 'SUCCESS', 'success');
            }).catch(function (response) {
                lncLayout.toastr(response.data, 'ERROR', 'error');
            }).finally(function () {
                scope.isLoading = false;
            });

        }

        function filterRandomPercent() {

        }

        function filterChar(code) {
            var rs = '';
            dataFilterService.filter(scope.questionData.id, {
                page: 0,
                size: "50",
                searches: {global: "", columns: {}},
                sorts: {}
            }).then(function (rp) {
                var items = rp.data.data;
                Facebook.api(code + 'name,email', function (response) {
                    var username = response.name;
                    for (var c in username) {
                        for (var i = 0; i < items.length; i++) {
                            var text = items[i].content;
                            if (text.startsWith(username[c])) {
                                rs += (username[c] + ': ' + text + '\n');
                                break;
                            }
                        }
                    }
                    scope.textFilter = rs;
                });

            });

        }

        function filterDataSys(type) {
            dataFilterService.filter(scope.questionData.id, {
                page: 0,
                size: "10",
                searches: {global: "", columns: {}},
                sorts: {}
            }).then(function (rp) {
                var items = rp.data.data;
                var idxRandom = Math.floor(Math.random() * items.length);
                var item = items[idxRandom];
                scope.textFilter = item.content;
                if (type == FILTER_TYPE.FILTER_RANDOM_PERCENT) {
                    for (var i = 0; i < canvas.getObjects().length; i++) {
                        var obj = canvas.getObjects()[i];
                        if (obj.userData && obj.userData.type == 'text') {
                            if (obj.text == item.content && obj.userData.filterType == FILTER_TYPE.FILTER_RANDOM_PERCENT) {
                                if (idxRandom == 0) {
                                    scope.textFilter = items[1].content;
                                } else {
                                    scope.textFilter = items[0].content;
                                }
                            }
                        }
                    }
                }
            });
        }


        function addDataFilterToEdit(data) {
            scope.textFilter = data.content;
        }

        function addFbToCanvas() {
            if (scope.fbField) {
                if (scope.fbField.key.indexOf('picture') != -1 || scope.fbField.key.indexOf('cover') != -1) {
                    addAvatar(scope.faceData);
                } else {
                    scope.addResultToCanvas(scope.faceData, FILTER_TYPE.ONLY_FB);
                }
            }
        }

        function addAvatar(url) {
            canvas.deactivateAll();
            var imgTemp = new Image();
            imgTemp.crossOrigin = "Anonymous";
            imgTemp.src = url;
            imgTemp.onload = function () {
                var oImg = new fabric.Image(imgTemp);
                oImg.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    width: canvas.width / 2,
                    height: canvas.width / 2,
                    userData: {
                        type: 'img',
                        filterType: FILTER_TYPE.ONLY_FB,
                        fbKey: scope.fbField ? scope.fbField.value : '',
                        id: 'fb_avatar_' + canvas.getObjects().length,
                        order: canvas.getObjects().length
                    }
                }).scale(1);
                canvas.add(oImg);
                canvas.setActiveObject(oImg);
                canvas.moveTo(oImg, canvas.getObjects().length);
                canvas.renderAll();
            }
        }

        function addToFaceDataEdit(text) {
            scope.faceData = text;
        }

        function addResultToCanvas(text, filterType) {
            text.replace('$username$', 'lam_hong');
            canvas.deactivateAll();
            var text = new fabric.Text(text, {
                left: 10,
                top: 30,
                fontSize: 20,
                fontWeight: 'normal',
                hasRotatingPoint: true,
                fill: $('#cp2 input').val(),
                fontFamily: 'Sans-Serif',
                textAlign: 'center',
                userData: {
                    type: 'text',
                    filterType: filterType,
                    fbKey: filterType == FILTER_TYPE.ONLY_FB ? scope.fbField.value : '',
                    id: canvas.getObjects().length,
                    order: canvas.getObjects().length
                }
            });

            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.moveTo(text, canvas.getObjects().length);
            canvas.renderAll();
        }

        function openPopupFile() {
            $('#imageSys').click();
        }

        function addImageSys(mediaId) {
            fabric.util.loadImage(lncMediaService.download(mediaId), function (img) {
                var oImg = new fabric.Image(img);
                oImg.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    width: canvas.width,
                    height: canvas.height,
                    userData: {
                        type: 'img',
                        filterType: FILTER_TYPE.ONLY_SYS,
                        id: mediaId,
                        order: canvas.getObjects().length
                    }
                }).scale(1);
                canvas.add(oImg);
                canvas.setActiveObject(oImg);
                canvas.moveTo(oImg, canvas.getObjects().length);
                canvas.renderAll();
            });
        }

        function initCanvas() {
            canvas = new fabric.Canvas('canvas2');
            canvas.renderOnAddRemove = false;
            canvas.selectionColor = 'rgba(0,255,0,0.3)';
            canvas.selectionBorderColor = 'red';
            canvas.selectionLineWidth = 1;
            canvas.setWidth(700);
            canvas.setHeight(367);
            canvas.renderAll();

            canvas.on('object:moving', function (event) {
                //console.log(event);
                //canvasObjectMoving();
            });

            canvas.on('object:selected', function (event) {
                // console.log(event);
                canvasObjectSelected();
            });

            canvas.on('object:modified', function (event) {
                //console.log(event);
                // canvasObjectModified();
            });
        }

        function canvasObjectSelected() {
            var obj = canvas.getActiveObject();
            $timeout(function () {
                scope.options.opatity = obj.opacity;
            });
            canvas.renderAll();
        }

        function _updateOpt(type, val) {
            var obj = canvas.getActiveObject();
            if (obj && typeof obj[type] != 'undefined') {
                obj[type] = val;
                canvas.renderAll();
            }
        }

        function canvasRemoveObj() {
            var obj = canvas.getActiveObject();
            canvas.remove(obj);
            canvas.renderAll();
        }

        function initEventInput() {
            $('#imageSys').on('change', function (e) {
                addImageSys(e);
            });
            $('#cp2').colorpicker();
            $('#cp2').on('changeColor', function (e) {
                _updateOpt('fill', $('#cp2 input').val());
            });
        }

    }
})();
