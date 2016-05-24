define(['core.nav', 'evt.action', 'System/Menu/menu.service.js'],
    function (core, actionEvent) {
        'use strict'

        core.controller('IndexNavCtrl', ['$scope', 'menuService', '$route',
            function ($scope, menuService, $route) {
                $scope.View = {},
                $scope.$on(actionEvent.OnSelect, function ($s, data, title) {
                    $scope.$applyAsync(function () {
                        $scope.View.NavName = title
                    })
                });

                menuService.fnGetTreeByAppId($route.current.$$route.AppID)
                           .success(function (d) {
                               $scope.moduleInfo = d && d[0] || {},
                               Array.isArray($scope.moduleInfo.Children) &&
                               $scope.moduleInfo.Children.forEach(function (o) {
                                   if (!o.NavUrl || /(.+)\.htm+l?$/i.test(o.NavUrl)) return;

                                   o.NavUrl = /(.+)\.js?$/i.test(o.NavUrl) ?
                                       o.NavUrl.substr(0, o.NavUrl.length - 3) :
                                       (o.NavUrl + '.html')
                               });
                           }).error(function () { $scope.moduleInfo = {} });
            }])
    })