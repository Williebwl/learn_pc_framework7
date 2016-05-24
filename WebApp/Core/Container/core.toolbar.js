/******************************************
********     工具栏核心组件      **********
*******************************************/
define('core.toolbar', ['core.page', 'evt.action'], function (page, actionEvent) {
    'use strict'

    function ToolbarPage($scope, $service, injection) {
        if (!this || this.constructor === Window) return new ToolbarPage().super(arguments);

        var $self = this;

        this.Type = 'core.toolbar'

        this.Super = function ($scope, $service, injection) {
            var $current = this;

            //调用父级搜索事件
            $scope.fnSearch = function () {
                $current.fnBindEmit(actionEvent.OnSearch)($scope.Params);
            }

            //重置表单并调用父级搜索事件
            $scope.fnFormReset = function () {
                $scope.form.$setPristine();
                $('select', $scope.$element).data('Reset').fnReset()
                Object.getOwnPropertyNames($scope.Params).forEach(function (paramName) {
                    $scope.Params[paramName] = null;
                });
                $scope.fnSearch();
            }
        }

    }

    return page.ext(ToolbarPage);
})
