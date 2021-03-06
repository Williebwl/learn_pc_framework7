﻿/******************************************
********     导航区域核心组件      ********
*******************************************/
define('core.nav', ['core.page', 'evt.action'],
    function (page, actionEvent) {
        'use strict'

        function NavPage($scope, $service, injection) {
            if (!this || this.constructor === Window) return new NavPage().super(arguments);

            this.Type = 'core.nav'

            var $self = this;

            this.Super = function ($scope, $service, injection) {
                var $current = this;

                $scope.fnSelect = function (data, title) {
                    $scope.Active = data,
                    $current.$rootScope.$broadcast(actionEvent.OnSelect, { origin: $current.Type, data: data }, title);
                    $current.$rootScope.$broadcast(actionEvent.OnSearch, { origin: $current.Type, data: data });
                }
            }
        }

        return page.ext(NavPage);
    })
