(function () {
    'use strict';
    angular
        .module('hdl.question')
        .controller('DesignSubImageModalController', DesignSubImageModalController);

    DesignSubImageModalController.$inject = ['designData', 'lncMediaService', '$timeout', '$window'];

    function DesignSubImageModalController(designData, lncMediaService, $timeout, $window) {
        var vm = this;
        vm.data = designData;
        vm.addText = addText;
        vm.removeText = removeText;
        vm.preview = preview;
        vm.save = save;
        var canvas = null;
        $timeout(function () {
            viewCanvas();
        }, 200);
        //////////////////
        function save() {
            vm.isLoading = true;
            lncMediaService.uploadCanvas({
                base64Data: vm.file,
                name: 'image-sub'
            }).then(function (rp) {
                console.log(rp);
                vm.isLoading = false;
                vm.$close(rp.data);
            });
        }

        function preview() {
            canvas.deactivateAll().renderAll();
            $timeout(function () {
                vm.file = canvas.toDataURL('png');
            });
        }

        function viewCanvas() {
            canvas = new fabric.Canvas('canvas');
            canvas.setWidth(vm.data.imgSubWidth);
            canvas.setHeight(vm.data.imgSubHeight);
            canvas.selectionColor = 'rgba(0,255,0,0.3)';
            canvas.selectionBorderColor = 'red';
            canvas.selectionLineWidth = 1;

            addImgBack(vm.data.imageHomeId);
            addImgMid(vm.data.imageMainId);
            addImgFooter(vm.data.imageSubFooterId);
            canvas.renderAll();
        }

        function addImgBack(mediaId) {
            canvas.deactivateAll();
            var imgTemp = new Image();
            imgTemp.crossOrigin = "Anonymous";
            imgTemp.src = lncMediaService.download(mediaId);
            imgTemp.onload = function () {
                var oImg = new fabric.Image(imgTemp);
                oImg.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    selection: false,
                    evented: false,
                    hasControls: false,
                    width: canvas.width,
                    height: canvas.height,
                    userData: {
                        type: 'img'
                    }
                }).scale(1);
                canvas.add(oImg);
                //canvas.setActiveObject(oImg);
                canvas.moveTo(oImg, 0);
            }
        }

        function addImgMid(mediaId) {
            canvas.deactivateAll();
            var imgTemp = new Image();
            imgTemp.crossOrigin = "Anonymous";
            imgTemp.src = lncMediaService.download(mediaId);
            imgTemp.onload = function () {
                var oImg = new fabric.Image(imgTemp);
                oImg.set({
                    left: 0,
                    top: canvas.height / 4,
                    angle: 0,
                    width: canvas.width,
                    height: canvas.height / 2,
                    userData: {
                        type: 'img'
                    }
                }).scale(1);
                canvas.add(oImg);
                //  canvas.setActiveObject(oImg);
                canvas.moveTo(oImg, 1);
            }
        }

        function addImgFooter(mediaId) {
            canvas.deactivateAll();
            var imgTemp = new Image();
            imgTemp.crossOrigin = "Anonymous";
            imgTemp.src = lncMediaService.download(mediaId);
            imgTemp.onload = function () {
                var oImg = new fabric.Image(imgTemp);
                oImg.set({
                    left: 0,
                    top: canvas.height - (canvas.height / 4),
                    angle: 0,
                    width: canvas.width,
                    height: canvas.height / 4,
                    userData: {
                        type: 'img'
                    }
                }).scale(1);
                canvas.add(oImg);
                //  canvas.setActiveObject(oImg);
                canvas.moveTo(oImg, 2);
            }
        }

        function removeText() {
            var obj = canvas.getActiveObject();
            //if (obj && obj.userData && obj.userData.type == 'text') {
                canvas.remove(obj);
                canvas.renderAll();
          //  }
        }

        function addText(text) {
            canvas.deactivateAll();
            var text = new fabric.Text(text, {
                left: 10,
                top: canvas.height - 30,
                fontSize: 20,
                fontWeight: 'normal',
                hasRotatingPoint: true,
                fill: 'white',
                fontFamily: 'Sans-Serif',
                textAlign: 'center',
                userData: {
                    type: 'text',
                    id: 1
                }
            });
            text.left = (canvas.width - text.width) / 2;
            text.top = (canvas.height - text.height);

            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.moveTo(text, 3);
            canvas.renderAll();
        }
    }
})();
