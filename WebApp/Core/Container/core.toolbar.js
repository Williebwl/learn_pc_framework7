/******************************************
********     工具栏核心组件      **********
*******************************************/
define('core.toolbar', ['core.page', 'evt.action'], function (page, actionEvent) {
    'use strict'

    function ToolbarPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new ToolbarPage().super(arguments);

        this.Type = 'core.toolbar'

        this.Super = function ($view, $service, $scope, injection) {
            var $self = this;

            //调用父级搜索事件
            $view.fnSearch = function () {
                $self.base.emit(actionEvent.OnSearch)($view.Params);
            }

            //重置表单并调用父级搜索事件
            $view.fnReset = function () {
                $view.form.$setPristine();
                Object.getOwnPropertyNames($view.Params).forEach(function (paramName) {
                    $view.Params[paramName] = null;
                });
                $view.fnSearch();
            }
        }

    }

    return page.ext(ToolbarPage);
})
