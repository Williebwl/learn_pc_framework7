define(['core.container', 'System/App/app.service.js'],
    function (core) {
        'use strict'        
        core.controller('AppContainerOperateCtrl', function ($scope) {
            var page = core($scope, appService);
        })
    })