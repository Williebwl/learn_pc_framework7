/******************************************
********     查看页面核心组件      ********
*******************************************/
define('core.view', ['core.page', 'ext'], function (page) {
    'use strict'

    function ViewPage($view, $service, $scope) {
        if (!this || this.constructor === Window) return new ViewPage().super(arguments);

        this.Type = 'core.view';

        //页面重置
        this.fnViewRest = page.noop,

        //页面加载
        this.fnLoadPage = page.noop

        this.Super = function ($view, $service, $scope, injection) {
            var $current = this;

            //设置页面数据
            this.fnSetViewInfo = function (info) {
                $current.$Info = info = info || {},
                $view.Info = $current.Info = !!info.ID ? page.extend({}, info) : info
            },
            $scope.ShowView && $scope.ShowView(function () { return $current.fnBindPage.apply($current, arguments.length ? arguments : [{}]) })
        },

        this.fnBindPage = function () {
            return this.$q.all([this.fnSetViewInfo.apply(this, arguments), this.fnViewRest.apply(this, arguments), this.fnFormReset.apply(this, arguments), this.fnLoadPage.apply(this, arguments), this.fnLoadAttach.apply(this, arguments)])
        }
    }

    return page.ext(ViewPage)
})