/******************************************
********     编辑页面核心组件      ********
*******************************************/
define('core.edit', ['core.view', 'evt.page', 'formValidate', 'ext'], function (page, pageEvent) {
    'use strict'

    function EditPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new EditPage().super(arguments);

        this.Type = 'core.edit'

        var $self = this;

        //保存前调用
        this.fnSaveing = page.noop,

        //获取数据标示
        this.fnGetID = function (editInfo) {
            return editInfo && (editInfo.ID || editInfo.id)
        },

        this.Super = function ($view, $service, $scope, injection) {
            var $current = this;

            //设置页面数据
            this.fnSetViewInfo = fnSetViewInfo,

            //保存
            $view.fnSave = this.fnSave = fnSave.bind(this),

            //保存成功时调用
            $self.fnSaveSuccess = function (d) {
                d ? ($self.$editInfo.ID = $view.editInfo.ID = d.ID || d) && $self.fnSaveOther.apply(this, arguments) : this.fnSaveError.apply(this, arguments)
            },
            //保存出错时调用
            $self.fnSaveError = function (e) {
                var back = {
                    View: $self.editInfo, PostInfo: $self.PostInfo
                };
                $scope.$emit(this.IsEdit ? pageEvent.OnFormPutFailed : pageEvent.OnFormPostFailed, back);
                $scope.$emit(pageEvent.OnFormSubmitFailed, back);

                var msg = e.Message.split('\r\n').map(function (item) {
                    var result = item.match(/^\[(\w+)\](.+)$/);
                    return '·' + (result ? ($view.$element.find(":input[name='" + result[1] + "']").parent().addClass("has-error"), result[2]) : item)
                });

                $self.errorNotice((msg.length > 1 ? '' : '操作无法完成，因为') + msg.join('<br/>'));
            },
            //保存关联信息（附件等）
            $self.fnSaveOther = function (d) {
                this.fnSaveAttach(d).success(($self.IsEdit ? $self.SaveUpdateRefresh : $self.SaveAddRefresh).bind($self)).error($self.fnSaveError.bind($self))
            },
            //添加成功
            $self.SaveAddRefresh = function (d) {
                if (d) {
                    var back = { View: $self.editInfo, PostInfo: $self.PostInfo };
                    this.successNotice('已完成保存操作。'),
                    $scope.$emit(pageEvent.OnFormPosted, back),
                    $scope.$emit(pageEvent.OnFormSubmited, back),
                    $scope.CloseDialog(back)
                } else this.fnSaveError.apply(this, arguments)
            },
            //修改成功
            $self.SaveUpdateRefresh = function (d) {
                if (d) {
                    var back = { Source: $self.$editInfo, View: $self.editInfo, PostInfo: $self.PostInfo };
                    this.successNotice('已完成保存操作。'),
                    $scope.$emit(pageEvent.OnFormPut, back),
                    $scope.$emit(pageEvent.OnFormSubmited, back),
                    $scope.CloseDialog(back)
                } else this.fnSaveError.apply(this, arguments)
            }
        }
    }



    return page.ext(EditPage);

    function fnSetViewInfo(editInfo) {
        this.$view.editInfo = this.editInfo = (this.$view.IsEdit = this.IsEdit = !!(editInfo.ID = this.fnGetID(this.$editInfo = editInfo = editInfo || {}))) ? page.extend({}, editInfo) : editInfo
    }

    function fnSave() {
        this.$q.when(this.fnFormValidate(), function () {
            this.$q.all(this.Promises).then(function () {
                this.$q.when(this.fnSaveing(this.editInfo), function (r) {
                    r !== false && this.$scope.$element.find(".has-error").removeClass("has-error") &&
                    (this.IsEdit ? this.$service.fnPut(this.editInfo.ID, this.PostInfo || this.editInfo) : this.$service.fnPost(this.PostInfo || this.editInfo))
                    .success(this.fnSaveSuccess.bind(this))
                    .error(this.fnSaveError.bind(this))
                }.bind(this))
            }.bind(this), this.fnSaveError.bind(this))
        }.bind(this))
    }
})
