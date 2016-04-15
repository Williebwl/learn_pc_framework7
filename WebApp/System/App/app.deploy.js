define(['core.container', 'System/App/app.service.js'], function (core) {
    'use strict'
    core.controller('AppContainerDeployCtrl', function ($scope, appService) {
        var page = core($scope, appService);
    })
})