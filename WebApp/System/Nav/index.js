define(['core.nav', 'evt.action', 'System/Menu/menu.service.js'], function (core, actionEvent) {
    'use strict'

    core.controller('IndexNavCtrl', function ($scope, menuService, $routeParams, $route) {
        var page = core($scope, menuService);

        $scope.$on(actionEvent.OnSelect, function ($s, data, title) {
            $scope.View = { NavName: title };
        });

        menuService.fnGetTreeByAppId($route.current.$$route.AppID)
            .success(function (d) {
                $scope.moduleInfo = d && d[0] || {}, Array.isArray($scope.moduleInfo.Children) && $scope.moduleInfo.Children.forEach(function (o) {
                    if (!o.NavUrl) return;

                    var a = o.NavUrl.toLowerCase(), b = a.length, c = a.substr(b - 3), d = a.substr(b - 4), e = a.substr(b - 5);

                    if (c === '.js') o.NavUrl = o.NavUrl.substr(0, b - 3);
                    else if (d === '.htm' || e === '.html') return;

                    o.NavUrl = o.NavUrl + '.html'
                });
            })
            .error(function () {
                $scope.moduleInfo = {}
            });
    })
})