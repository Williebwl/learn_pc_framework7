define(['page', 'ext', 'uploader', 'evt.attach', 'css!Assets/Css/attach.css'],
    function (app, ext, uploader, attachEvent) {
        'use strict'

        var biAttachTemplate = '<div class="attach">\
                                    <div id="file"></div>\
                                    <ul class="ViewFile">\
                                        <li ng-repeat="file in files" id="{{file.id}}">\
                                             <a href="javascript:;" ng-click="fnDownload(file)">\
                                                <i class="ioc" ng-class="file.Icon"></i>\
                                                <span ng-bind="file.name"></span>\
                                             </a>\
                                             <span class="fileSize" ng-bind="file.formatSize"></span>\
                                             <em ng-click="fnDel(file)" title="删除"></em>\
                                         </li>\
                                    </ul>\
                                    <div class="Download"></div>\
                                </div>';

        var biAttachDirective = function ($rootScope, attachService) {

            var uploaderOpt = {
                auto: true,
                swf: 'Assets/Swf/Uploader.swf',
                server: null,
                threads: 5
            }

            return {
                restrict: 'ECA',
                template: biAttachTemplate,
                replace: true,
                scope: {
                    Config: '='
                },
                controller: function ($scope) {
                    var files = $scope.files = [], $self = this, DelIDs = $self.DelIDs = [];

                    $scope.fnDownload = function (file) {
                        file.ID && $('<iframe src="' + attachService.fnGetDownSrc(file.ID) + '"></iframe>').appendTo($self.$Down);
                    }

                    $scope.fnDel = function (file) {
                        files.remove(file) && file.ID && DelIDs.push(file.ID),
                        $self.uploader.cancelFile(file),
                        $self.uploader.removeFile(file)
                    }

                    this.fnGetAttach = function (d) {
                        this.sucNumber += 1,
                        $self.uploader.options.server = attachService.fnGetUploadSrc($self.Key = d.Key), files = $scope.files = d.Files || [],
                        $self.uploader.refresh(),
                        $self.uploader.reset(),
                        (this.sucNumber + this.errNumber) === this.sumNumber && (this.sumNumber === this.sucNumber && isFunction(this.success) && this.success() || isFunction(this.error) && this.error())
                    }

                    this.fnGetAttachError = function (d) {
                        this.errNumber += 1,
                        $self.uploader.refresh(),
                        $self.uploader.reset(),
                        (this.sucNumber + this.errNumber) === this.sumNumber && isFunction(this.error) && this.error()
                    }

                    this.bindUploader = function (upload) {
                        ($self.Config.Uploader = $self.uploader = upload)
                            .on('fileQueued', function (file) {
                                file.formatSize = uploader.formatSize(file.size),
                                file.Icon = file.ext + $self.IconSize,
                                isFunction($self.Config.fileQueued) && $self.Config.fileQueued(files, DelIDs),
                                files.push(file),
                                $scope.$digest(),
                                file.Percent = (file.Progress = $('<div class="progress"><div class="progress-bar"></div></div>')).appendTo(file.info = $self.$View.find('#' + file.id)).find('.progress-bar')
                            }).on('uploadProgress', function (file, percentage) {
                                file.Percent.css('width', percentage * 100 + '%')
                            }).on('uploadSuccess', function (file, d) {
                                d.Files && (file.ID = d.Files[0].ID)
                            }).on('uploadError', function (file) {
                                file.info.addClass('error')
                            }).on('uploadComplete', function (file) {
                                file.Progress.remove(),
                                delete file.Progress,
                                delete file.Percent
                            }),
                            isFunction($self.Config.bindUploader) && $self.Config.bindUploader(upload)
                    }

                    $rootScope.$on(attachEvent.OnSave, function (e, d) {
                        d.sumNumber += 1,
                        attachService.fnSaveAttach([{ TableID: d.ID || 0, TableName: $self.TableName, CustomType: $self.CustomType, AttachKey: $self.Key, FileIDs: DelIDs }],
                            function (isOk) {
                                isOk ? d.sucNumber += 1 : d.errNumber += 1,
                                (d.sucNumber + d.errNumber) === d.sumNumber && (d.sumNumber === d.sucNumber && isFunction(d.success) && d.success() || isFunction(d.error) && d.error())
                            },
                            function (d) {
                                d.errNumber += 1,
                                (d.sucNumber + d.errNumber) === d.sumNumber && isFunction(d.error) && d.error()
                            })
                    })
                },
                compile: function compile(element, attr) {
                    return function (scope, $element, attr, ctrl) {
                        ctrl.TableName = $.trim(attr.biAttach) || $.trim(attr.table),
                        ctrl.CustomType = parseInt(attr.type) || 0,
                        ctrl.IconSize = attr.iconsize || '16',
                        ctrl.$Down = $element.find('.Download:first'),
                        ctrl.$View = $element.find('.ViewFile:first'),
                        ctrl.Config = ext.extend(scope.Config || {}, uploaderOpt);
                        ctrl.Config.pick = (ctrl.multiple = ($.trim(attr.multiple).toLowerCase() !== 'false')) ? $element.find('#file') : { id: $element.find('#file'), multiple: false },
                        scope.$eval(attr.isimg) && (ctrl.Config.accept = { title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*' }),
                        ctrl.bindUploader(uploader.create(ctrl.Config)),
                        $rootScope.$on(attachEvent.OnLoad, function (e, d) {
                            d.sumNumber += 1,
                            attachService.fnGetAttach(ctrl.TableName, d.ID || 0, ctrl.CustomType, ctrl.fnGetAttach.bind(d), ctrl.fnGetAttachError.bind(d))
                        })
                    }
                }
            };

            function isFunction(o) {
                return typeof o === 'function'
            }
        }

        app.directive('biAttach', biAttachDirective);
    })