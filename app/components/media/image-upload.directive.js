/**
 * This directive using for upload system image like:
 *  - Company Image Logo
 *  - User Avatar
 */

(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncImageUpload', lncImageUpload);

    lncImageUpload.$inject = ['$log', 'lncMediaService', '$timeout'];

    function lncImageUpload($log, lncMediaService, $timeout) {
        var defaultOption = {
            width: 200,
            height: 200
        };

        return {
            restrict: 'E',
            require: '?ngModel',
            replace: true,
            templateUrl: 'components/media/image-upload.tpl.html',
            link: linkFunc
        };

        ////////////////

        function linkFunc(scope, element, attrs, ctrl) {
            var fileInput = element.find('input[type="file"]');
            var isNeedOpenCropper = true;
            var currentSelectFile;
            var img = element.find('img');

            var buttons = element.find('.image-buttons');
            var checkBtn = buttons.find('button[name="check"]');
            var cancelBtn = buttons.find('button[name="cancel"]');

            var imageHolder = element.find('.image-holder');
            var option = scope.$eval(attrs.option);
            option = angular.extend({}, defaultOption, option);

            init();

            scope.$on('$destroy', destroy);
            if (ctrl) {
                /* View to Model */
                ctrl.$parsers.push(function (value) {
                    $log.info('View -> Model: ' + value);
                    setImage(value);
                    return value;
                });

                /* Model to View */
                ctrl.$formatters.push(function (value) {
                    $log.info('Model -> View: ' + value);
                    setImage(value);

                    return null;
                });
            }

            function init() {
                buttons.hide();

                fileInput.on('change', function () {
                    var files = fileInput.prop('files');
                    if (files && files.length > 0) {
                        var file = currentSelectFile = files[0];
                        handleFile(file);
                    }
                });
                img.on('click', function (e) {
                    $log.info('image select');
                    fileInput.val('');
                    fileInput.click();
                    e.stopPropagation();
                    e.preventDefault();
                });
            }

            function setImage(value) {
                //isNeedOpenCropper = false;
                if (lnc.hasValue(value)) {
                    img.attr('src', lncMediaService.download(value));
                } else {
                    setNoImage();
                }
            }

            function destroy() {
                destroyCropper();
                fileInput.off('click');
                img.off('click');
            }

            function handleFile(f) {
                $log.info(f);
                var imageType = /^image\//;

                if (!imageType.test(f.type)) {
                    return;
                }

                var reader = new FileReader();

                reader.onload = function () {
                    var dataURL = reader.result;
                    var image = img[0];
                    image.onload = function () {
                        if (isNeedOpenCropper) {
                            var imgWidth = this.width;
                            var imgHeight = this.height;
                            $log.info('Width: ' + imgWidth);
                            $log.info('Height: ' + imgHeight);
                            if (imgWidth === option.width && imgHeight === option.height) {
                                var canvasData = this.src;
                                uploadCanvas({
                                    base64Data: canvasData,
                                    name: currentSelectFile.name
                                });
                            } else {
                                initCropper();
                            }
                        }
                        isNeedOpenCropper = true;
                    };
                    img.attr('src', dataURL);
                };
                reader.readAsDataURL(f);
            }

            function initCropper() {
                buttons.css({'display': 'block'});
                element.css({
                    'width': element.parent().innerWidth(),
                    'height': element.parent().innerWidth(),
                    'max-width': ''
                });
                imageHolder.css({'width': element.width(), 'height': element.width()});

                img.cropper({
                    aspectRatio: option.width / option.height,
                    center: true,
                    autoCropArea: 0.8,
                    strict: false,
                    guides: false,
                    highlight: false,
                    dragCrop: false,
                    cropBoxMovable: false,
                    cropBoxResizable: false,
                    build: function () {
                        checkBtn.on('click', getCroppedCanvas);
                        cancelBtn.on('click', cancel);
                    }
                });
            }

            function cancel() {
                destroyCropper();
                isNeedOpenCropper = false;
                if (ctrl) {
                    setImage(ctrl.$modelValue);
                }
            }

            function setNoImage() {
                img.attr('data-src', 'holder.js/' + option.width + 'x' + option.height + '?auto=yes&text=' + option.width + 'px / ' + option.height + 'px');
                /* eslint-disable */
                Holder.run(img[0]);
            }

            function destroyCropper() {
                checkBtn.off('click');
                cancelBtn.off('click');
                element.css({'width': 'auto', 'max-width': '100%', 'height': ''});
                imageHolder.css({'width': '', 'height': ''});
                img.cropper('destroy');
                buttons.css({'display': 'none'});
            }

            function getCroppedCanvas() {
                var cropperCanvas = img.cropper('getCroppedCanvas', {
                    width: option.width,
                    height: option.height
                });

                var canvasData = cropperCanvas.toDataURL();
                uploadCanvas({
                    base64Data: canvasData,
                    name: currentSelectFile.name
                });

                destroyCropper();
            }

            function uploadCanvas(obj) {
                obj.parentId = attrs.parentId || null;
                lncMediaService.uploadCanvas(obj).then(function (resp) {
                    $log.info(resp.data);
                    $timeout(function () {
                        isNeedOpenCropper = false;
                        ctrl.$setViewValue(resp.data.id);
                    });
                }, function () {
                    $log.error('Upload fail');
                });
            }
        }
    }
})();
