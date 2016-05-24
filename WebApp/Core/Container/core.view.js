/******************************************
********     查看页面核心组件      ********
*******************************************/
define('core.view', ['core.page', 'ext'], function (page) {
    'use strict'

    function ViewPage($scope, $service) {
        if (!this || this.constructor === Window) return new ViewPage().super(arguments);

        this.Type = 'core.view';

        //页面加载
        this.fnLoadPage = page.noop

        this.Super = function ($scope, $service, injection) {
            $scope.ShowView && $scope.ShowView(function () { return this.fnBindPage.apply(this, arguments.length ? arguments : [{}]) }.bind(this))
        },

        //设置页面数据
        this.fnSetViewInfo = function (info) {
            this.$Info = info = info || {},
            this.$scope.Info = this.Info = !!info.ID ? page.extend({}, info) : info
        },

        this.fnBindPage = function () {
            return this.$q.all([this.fnSetViewInfo.apply(this, arguments), this.fnFormReset.apply(this, arguments), this.fnLoadPage.apply(this, arguments), this.fnLoadAttach.apply(this, arguments)])
        }
    }

    return page.ext(ViewPage)
})