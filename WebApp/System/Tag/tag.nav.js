define(['core.nav', 'evt.page', 'System/App/app.service.js'],
function (core, pageEvent) {
    'use strict'

    core.controller('TagNavCtrl', function ($scope, $rootScope, appService) {
        var page = core($scope, appService);
        appService.fnGetAll().success(function (d) {
            $scope.apps = d, $scope.fnSelect(d[0], d[0].AppName)
        });
        $scope.fnKeySearch = function () {
            appService.fnGetAll({ Key: $scope.Key }).success(function (d) {
                $scope.apps = d;
                if (d.length > 0)
                    $scope.fnSelect(d[0], d[0].AppName);
            });
        };
    })
})