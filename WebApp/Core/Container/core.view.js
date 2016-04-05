/******************************************
********     查看页面核心组件      ********
*******************************************/
define('core.view', ['core.page', 'ext'], function (page) {
    'use strict'

    function ViewPage($view, $service, $scope) {
        if (!this || this.constructor === Window) return new ViewPage().super(arguments);

        this.Type = 'core.view';

        var $self = this;

        //页面重置
        this.fnViewRest = page.noop,

        //页面加载
        this.fnLoadPage = page.noop

        this.Super = function ($view, $service, $scope, injection) {
            //设置页面数据
            this.fnSetViewInfo = function (info) {
                $self.$Info = info = info || {},
                $view.Info = $self.Info = !!info.ID ? page.extend({}, info) : info
            },
            $scope.ShowDialog && $scope.ShowDialog(function () { return $self.fnBindPage.apply($self, arguments) })
        },

        this.fnBindPage = function () {
            return this.$q.all([this.fnSetViewInfo.apply(this, arguments), this.fnViewRest.apply(this, arguments), this.fnLoadPage.apply(this, arguments), this.fnLoadAttach.apply(this, arguments)])
        }
    }

    return page.ext(ViewPage)
})