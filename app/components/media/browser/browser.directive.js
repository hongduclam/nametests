(function () {
    'use strict';

    angular
        .module('lnc.media')
        .directive('lncBrowser', lncBrowser);

    lncBrowser.$inject = ['$log', 'lncMediaService', '$timeout', 'lncToastr', '$window', 'lncModalService', '$cookies'];

    function lncBrowser($log, lncMediaService, $timeout, lncToastr, $window, lncModalService, $cookies) {
        var SELECT = {
            SINGLE: 'single',
            MULTIPLE: 'multiple'
        };

        var MIMETYPE = {
            image: 'image/*',
            video: 'video/*',
            xml: 'application/xml'
        };

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/media/browser/browser.tpl.html',
            link: linkFunc,
            scope: true,
            bindToController: {
                api: '=?'
            },
            controller: 'BrowserController',
            controllerAs: 'bc'
        };

        ////////////////

        function linkFunc(scope, element, attrs, ctrl) {
            var supportMimetype = attrs.mimetype ? MIMETYPE[attrs.mimetype] : null;
            var selectType = attrs.select || SELECT.MULTIPLE;

            var bc = ctrl;
            var dropzoneEls = element[0].querySelector('.dropzone');
            var dropzoneContainer = dropzoneEls.querySelector('.previewsContainer');
            var dropzone;
            Dropzone.autoDiscover = false;

            var config = {
                url: '/media/upload',
                maxFilesize: 5,
                paramName: 'file',
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
                autoProcessQueue: true,
                headers: {
                    'X-XSRF-TOKEN': $cookies.get('XSRF-TOKEN')
                },
                thumbnailWidth: 200,
                thumbnailHeight: 200,
                dictDefaultMessage: '',
                previewsContainer: dropzoneContainer,
                previewTemplate: [
                    '<div class="col-sm-6 col-md-2 col-xs-4">',
                    '<div class="preview">',
                    '<div class="image-holder">',
                    '<img data-dz-thumbnail/>',
                    '</div>',
                    '<div class="caption">',
                    '<p data-dz-name></p>',
                    '</div>',
                    '<div class="progress">',
                    '<div class="progress-bar" role="progressbar" data-dz-uploadprogress>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join(''),
                thumbnail: thumbnail
            };

            if (supportMimetype) {
                config.acceptedFiles = supportMimetype;
            }

            dropzone = new Dropzone(dropzoneEls, config);
            dropzone.on('addedfile', onAddedFile);
            dropzone.on('processing', onProcessing);
            dropzone.on('success', onUploadSuccess);
            dropzone.on('error', onError);


            setCurrentPath();

            bc.perms = lncMediaService.getMediaPermission();
            bc.setCurrentPath = setCurrentPath;
            bc.showChooseFiles = showChooseFiles;
            bc.totalFilesSelected = 0;
            bc.download = download;
            bc.delete = deleteFiles;
            bc.api = {
                getSelectedFiles: getSelectedFiles
            };

            scope.$on('$destroy', destroy);

            function thumbnail(file, url) {
                var img = file.previewElement.querySelector('[data-dz-thumbnail]');
                if (img) {
                    img.dataset.src = url;
                    img.classList.add('lazyload');
                }
            }

            function showChooseFiles() {
                dropzone.hiddenFileInput.click();
            }

            function deleteFiles() {
                var files = getSelectedFiles();

                var messages = 'Do you want to delete these files: <br/>';
                messages += '<ul>';
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    messages += '<li>' + file.name + '</li>';
                }
                messages += '</ul>';

                var confirmModal = lncModalService.confirm({
                    type: 'danger',
                    message: messages
                });
                confirmModal.result.then(function () {
                    $log.info('Delete on server');
                    $log.info(files);
                    angular.forEach(files, function (item) {
                        lncMediaService.delete(item.original.id).then(function () {
                            $log.info('Delete at local');
                            dropzone.removeFile(item);
                        });
                    });
                }, function () {

                });
            }

            function download() {
                var files = getSelectedFiles();
                if (files.length > 0) {
                    downloadPage(files[0].original.name, lncMediaService.download(files[0].original.id));
                }
            }

            function downloadPage(filename, sUrl) {
                // iOS devices do not support downloading. We have to inform user about
                // this.
                if (/(iP)/g.test(navigator.userAgent)) {
                    lncToastr.alert(
                        'Your device does not support files downloading. Please try again in desktop browser.');
                    return false;
                }
                /*var isChrome = $window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                 var isSafari = $window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;
                 // If in Chrome or Safari - download via virtual link click
                 if (isChrome || isSafari) {
                 var link = angular.element('<a/>');
                 link.attr('href', sUrl);
                 if (angular.isDefined(link.attr('download'))) {
                 link.attr('download', filename);
                 }

                 // Dispatching click event.
                 if (link.trigger) {
                 link.trigger('click');
                 return true;
                 }
                 }*/
                $window.open(sUrl, '_blank');
                return true;
            }

            function getSelectedFiles() {
                var files = [];
                for (var i = 0; i < dropzone.files.length; i++) {
                    var file = dropzone.files[i];
                    if (angular.element(file.previewElement).hasClass('dz-selected')) {
                        files.push(file);
                    }
                }
                return files;
            }

            function setCurrentPath(path) {
                bc.totalFilesSelected = 0;
                bc.isLoading = true;
                $log.info('Set current path: ' + path);
                var fnGetFile;
                if (lnc.hasValue(path)) {
                    dropzone.options.url = '/media/' + path + '/upload';
                    fnGetFile = lncMediaService.getTree(path, lncMediaService.TYPE.FILE);
                } else {
                    dropzone.options.url = '/media/upload';
                    fnGetFile = lncMediaService.getRoot(lncMediaService.TYPE.FILE);
                }

                fnGetFile.then(function (res) {
                    dropzone.removeAllFiles();
                    for (var i = 0; i < res.length; i++) {
                        var fileServer = res[i];
                        var mimeTypePattern = null;
                        if (supportMimetype) {
                            mimeTypePattern = new RegExp(supportMimetype);
                        }

                        if (!mimeTypePattern || mimeTypePattern.test(fileServer.mimetype)) {
                            var mockFile = {
                                name: fileServer.name,
                                size: fileServer.size,
                                original: fileServer
                            };
                            dropzone.emit('addedfile', mockFile);
                            dropzone.emit('thumbnail', mockFile, lncMediaService.thumbnailFile(fileServer));
                            dropzone.files.push(mockFile);
                        }
                    }
                }).finally(function () {
                    bc.isLoading = false;
                });
            }

            function onError(file, errorMsg, xhr) {
                if (lnc.hasValue(xhr)) {
                    errorMsg = xhr.error;
                }
                $log.info(file);
                $log.info(errorMsg);
                $log.info(xhr);
                dropzone.removeFile(file);
                lncToastr.error(errorMsg);
            }

            function onProcessing(file) {
                $log.info('onProcessing');
                $log.info(file);
                dropzone.emit('thumbnail', file, 'image/filetype/upload.svg');
            }

            function onAddedFile(file) {
                var els = angular.element(file.previewElement);
                els.on('click', function (e) {
                    e.preventDefault();
                    var isHasClass = els.hasClass('dz-selected');
                    if (!e.ctrlKey || selectType === SELECT.SINGLE) {
                        clearAllSelected();
                    }
                    if (!isHasClass) {
                        els.toggleClass('dz-selected');
                    }

                    $timeout(function () {
                        totalFilesSelected();
                    }, 20);
                });

                try {
                    var original = file.original;
                    var filename = file.name;
                    var size = file.size;
                    var mimetype = file.type;
                    if (original) {
                        filename = original.name || filename;
                        size = original.size || size;
                        mimetype = original.mimetype || mimetype;
                    }

                    var tooltipHtml = '<table class="media-table-tooltip">'
                        + '<tr><th colspan="2">' + filename + '</th></tr>'
                        + '<tr><td>Size:</td><td>' + formatBytes(size) + '</td></tr>'
                        + '<tr><td>Type:</td><td>' + mimetype + '</td></tr>'
                        + '</table>';
                    els.find('.caption').tooltip({
                        title: tooltipHtml,
                        placement: 'auto bottom',
                        container: 'body',
                        html: true
                    });
                } catch (e) {
                    $log.warning(e);
                }
            }

            function formatBytes(bytes, decimals) {
                if (bytes <= 1) {
                    return bytes + ' Byte';
                }
                var k = 1000;
                var dm = decimals + 1 || 3;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
            }

            function totalFilesSelected() {
                var els = angular.element(dropzoneEls);
                bc.totalFilesSelected = els.find('.dz-selected').length;
            }

            function clearAllSelected() {
                var els = angular.element(dropzoneEls);
                els.find('.dz-selected').removeClass('dz-selected');
            }

            function onUploadSuccess(file, resp) {
                $log.info(file);
                $log.info(resp);
                file.original = resp;
                $timeout(function () {
                    angular.element(file.previewElement).removeClass('dz-processing');
                }, 500);

                dropzone.emit('thumbnail', file, lncMediaService.thumbnailFile(resp));
            }

            function destroy() {
                $log.info('Browser destroy');
                dropzone.destroy();
                element.find('.caption').tooltip('destroy');
            }
        }
    }
})();
