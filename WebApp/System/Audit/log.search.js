define(['core.toolbar', 'System/Audit/log.service.js'], function (core) {
    'use strict'

    core.controller('LogSearchCtrl', function ($scope, logService) {
        var page = core($scope, logService);
        $scope.LogLevels = logService.fnGetStatus();
    })
})