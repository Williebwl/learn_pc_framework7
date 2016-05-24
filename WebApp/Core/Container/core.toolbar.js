/******************************************
********     工具栏核心组件      **********
*******************************************/
define('core.toolbar', ['core.page', 'evt.action'], function (page, actionEvent) {
    'use strict'

    function ToolbarPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new ToolbarPage().super(arguments);

        var $self = this;

        this.Type = 'core.toolbar'

        this.Super = function ($view, $service, $scope, injection) {
            var $current = this;

            //调用父级搜索事件
            $view.fnSearch = function () {
                $current.fnBindEmit(actionEvent.OnSearch)($view.Params);
            }

            //重置表单并调用父级搜索事件
            $view.fnReset = function () {
                $view.form.$setPristine();
                $('select', $scope.$element).data('Reset').fnReset()
                Object.getOwnPropertyNames($view.Params).forEach(function (paramName) {
                    $view.Params[paramName] = null;
                });
                $view.fnSearch();
            }
        }

    }

    return page.ext(ToolbarPage);
})
