/******************************************
********     编辑页面核心组件      ********
*******************************************/
define('core.edit', ['core.page', 'evt.page', 'formValidate', 'ext'], function (page, pageEvent) {
    'use strict'

    function EditPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new EditPage().super(arguments);

        this.Type = 'core.edit'

        var $self = this, id;

        this.Super = function ($view, $service, $scope, injection) {

            //保存前调用
            $self.fnSaveing = $self.fnViewRest = page.noop,
            //在上级页面中注册ShowDialog方法
            $scope.ShowDialog(function (editInfo) { editInfo || (editInfo = {}), $self.fnBindPage($self.fnLoadPage(editInfo) || editInfo) }),
            //页面加载
            $self.fnLoadPage = page.noop,
            //绑定页面数据
            $self.fnBindPage = function (editInfo) {
                $self.$valid = !1,//是否验证通过
                $self.fnSetEditInfo(editInfo),//设置编辑信息
                $self.fnViewRest(),//重置视图
            $self.fnFormReset(),//表单重置
            $self.fnLoadAttach($view.editInfo.ID)//加载附件资源
            },
            //设置页面数据
            $self.fnSetEditInfo = function (editInfo) {
                $self.$editInfo = editInfo = editInfo || {},
                $view.editInfo = $self.editInfo = ($view.IsEdit = $self.IsEdit = !!(id = editInfo.ID)) ? page.extend({}, editInfo) : editInfo
            },
            //保存
            $view.fnSave = function () {
                $self.fnFormValidate() || $self.$q.all($self.Promises)
                    .then(function () {
                        $self.fnSaveing($self.editInfo) !== false &&
                        $view.$element.find(".has-error").removeClass("has-error") &&
                        ($self.IsEdit ? $service.fnPut(id, $self.PostInfo || $view.editInfo) : $service.fnPost($self.PostInfo || $view.editInfo))
                        .success($self.fnSaveSuccess.bind($self)).error($self.fnSaveError.bind($self))
                    }, $self.fnSaveError.bind($self))
            },
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

                var msg = "";
                e.Message.split('\r\n').map(function (item) {
                    var result = item.match(/^\[(\w+)\](.+)$/);
                    if (result) {
                        $view.$element.find(":input[name='" + result[1] + "']").parent().addClass("has-error");
                        msg += '·' + result[2] + '<br />';
                    }
                    else
                        msg += '·' + item + '<br />';
                });
                if (msg)
                    $self.errorNotice(msg);
                else
                    $self.errorNotice('操作无法完成，因为' + msg);
            },
            //保存关联信息（附件等）
            $self.fnSaveOther = function (d) {
                this.fnSaveAttach(d, ($self.IsEdit ? $self.SaveUpdateRefresh : $self.SaveAddRefresh).bind($self), $self.fnSaveError.bind($self))
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
})
