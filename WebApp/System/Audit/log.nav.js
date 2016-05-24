define(['core.nav', 'evt.page', 'System/Audit/log.service.js', 'System/App/app.service.js'],
function (core, pageEvent) {
    'use strict'

    core.controller('LogNavCtrl', function ($scope, logService, appService) {
        var page = core($scope, logService);
        logService.fnGetLogger().success(function (d) {
            $scope.logger = d
        });
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
        $scope.fnGetLoggerName = logService.fnGetLoggerName;
    })
})