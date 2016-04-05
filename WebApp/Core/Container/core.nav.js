/******************************************
********     导航区域核心组件      ********
*******************************************/
define('core.nav', ['core.page', 'evt.action'], function (page, actionEvent) {
    'use strict'

    function NavPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new NavPage().super(arguments);

        this.Type = 'core.nav'

        var $self = this;

        this.Super = function ($view, $service, $scope, injection) {
            //搜索对象
            $view.Search = {
                //当前操作对象
                LastActive: null,
                Active: null,
                NavName: null
            },
            $view.fnSelected = function (active, navName) {
                this.LastActive = this.Active, this.Active = active, this.NavName = navName;
                $view.$parent.fnChanged(this);
                $self.$rootScope.$broadcast(actionEvent.OnSearch, { origin: $self.Type, data: this });
            }.bind($view.Search)
        }
    }

    return page.ext(NavPage);
})
