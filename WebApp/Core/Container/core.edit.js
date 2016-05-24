/******************************************
********     编辑页面核心组件      ********
*******************************************/
define('core.edit', ['core.view', 'evt.page', 'formValidate', 'ext'], function (page, pageEvent) {
    'use strict'

    function EditPage($scope, $service, injection) {
        if (!this || this.constructor === Window) return new EditPage().super(arguments);

        this.Type = 'core.edit'

        //保存前调用
        this.fnSaveing = page.noop,

        //获取数据标示
        this.fnGetID = function (editInfo) {
            return editInfo && (editInfo.ID || editInfo.id)
        },

        //设置页面数据
        this.fnSetViewInfo = fnSetViewInfo,

        //保存
        this.fnSave = fnSave,

        //保存成功时调用
        this.fnSaveComplete = fnSaveComplete,

        //保存出错时调用
        this.fnSaveError = fnSaveError,

        //保存关联信息（附件等）
        this.fnSaveOther = fnSaveOther,

        //添加成功
        this.fnSaveAddRefresh = fnSaveAddRefresh,

        //修改成功
        this.fnSaveUpdateRefresh = fnSaveUpdateRefresh,

        this.Super = function ($scope, $service, injection) {
            //保存
            $scope.fnSave = this.fnSave.bind(this)

            fnAutoTabKey.call(this, $scope.$element)
        }
    }

    return page.ext(EditPage);

    function fnSetViewInfo(editInfo) {
        this.$scope.editInfo = this.editInfo = !!(editInfo.ID = this.fnGetID(this.$editInfo = editInfo = editInfo || {})) ? page.extend({}, editInfo) : editInfo
    }

    function fnSave() {
        fnAwait.call(this),
        this.$q.when(this.fnFormValidate(), function () {
            this.$q.all(this.Promises).then(function () {
                this.$q.when(this.fnSaveing(this.editInfo), function (r) {
                    if (this.$scope.$$destroyed) { fnAwait.call(this); return }

                    r !== false && this.$scope.$element.find(".has-error").removeClass("has-error") &&
                    ((this.isEdit = !!this.editInfo.ID) ? this.$service.fnPut(this.editInfo.ID, this.PostInfo || this.editInfo) : this.$service.fnPost(this.PostInfo || this.editInfo))
                    .success(this.fnSaveComplete.bind(this))
                    .error(this.fnSaveError.bind(this))
                }.bind(this), fnAwait.bind(this))
            }.bind(this), this.fnSaveError.bind(this))
        }.bind(this), fnAwait.bind(this))
    }

    function fnSaveComplete(result) {
        if (this.$scope.$$destroyed) { fnAwait.call(this); return }

        (result ? ($.type(result) !== 'boolean' && (this.editInfo.ID = $.isNumeric(result) && result || result.ID), this.fnSaveOther) : this.fnSaveError).apply(this, arguments)
    }

    function fnSaveError(result) {
        fnAwait.call(this)

        if (this.$scope.$$destroyed) return;

        var back = { View: this.editInfo, PostInfo: this.PostInfo }, $scope = this.$scope;

        $scope.$emit(this.isEdit ? pageEvent.OnFormPutFailed : pageEvent.OnFormPostFailed, back);
        $scope.$emit(pageEvent.OnFormSubmitFailed, back);

        if (result.Message && result.Message.indexOf('\r\n') == -1) {
            this.errorNotice('操作无法完成，因为' + result.Message);
        } else if (result.Message) {
            var msg = result.Message.split('\r\n').map(function (item) {
                var result = item.match(/^\[(\w+)\](.+)$/);
                return '·' + (result ? ($scope.$element.find(":input[name='" + result[1] + "']").parent().addClass("has-error"), result[2]) : item)
            }) || [];
            this.errorNotice(msg.join('<br/>'));
        }
    }

    function fnSaveOther() {
        fnAwait.call(this);

        if (this.$scope.$$destroyed) return;

        (this.isEdit ? this.fnSaveUpdateRefresh : this.fnSaveAddRefresh).apply(this, arguments)
    }

    function fnSaveAddRefresh(d) {
        if (d) {
            var back = { View: this.editInfo, PostInfo: this.PostInfo, Result: d }, $scope = this.$scope;

            this.successNotice('已完成保存操作。'),

            $scope.$emit(pageEvent.OnFormPosted, back),
            $scope.$emit(pageEvent.OnFormSubmited, back),
            $scope.CloseDialog(back)

        } else this.fnSaveError.apply(this, arguments)
    }

    function fnSaveUpdateRefresh(d) {
        if (d) {
            var back = { Source: this.$editInfo, View: this.editInfo, PostInfo: this.PostInfo, Result: d }, $scope = this.$scope;

            this.successNotice('已完成保存操作。'),

            $scope.$emit(pageEvent.OnFormPut, back),
            $scope.$emit(pageEvent.OnFormSubmited, back),
            $scope.CloseDialog(back)

        } else this.fnSaveError.apply(this, arguments)
    }

    function fnAwait() {
        var $await = this.$scope.$element.find('.await');

        this.await = $await.is('.btn-loading') ? ($await.removeClass('btn-loading').modal('hide'), !1) : ($await.addClass('btn-loading').modal('show'), !0);
    }

    function fnAutoTabKey($element) {
        var page = this;

        $element.off('.autoTabKey').on('keydown.autoTabKey', ':input', keydown)

        function keydown(e) {
            return e.keyCode === 13 && this.nodeName !== "TEXTAREA" ? fnMoveNextInput.call(page, $element, e.target) : !0
        }
    }

    function fnMoveNextInput($element, input) {
        if (!input.form) { this.await || input.click(), input.focus(); return !1 }

        var form = input.form.elements, i = 0, l = form.length, auto, target;
        for (; i < l; i++) {
            target = form[i];

            if (auto && (target.offsetWidth > 0 || target.offsetHeight > 0 || target.getClientRects().length > 0)) { target.focus(); break; }

            auto || (auto = target === input)
        }

        if (i === l) (target = $element.find('.await').get(0)) && (target.click(), target.focus())

        return !1
    }
})
