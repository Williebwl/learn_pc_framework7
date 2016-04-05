define(['core.container', 'System/App/app.service.js'],
    function (core) {
        'use strict'
        core.controller('AppContainerDeployCtrl', function ($scope) {
            var page = core($scope, appService);
        })
    })