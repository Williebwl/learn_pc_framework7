﻿define(['core.container', 'System/App/app.service.js'],
    function (core) {
        'use strict'
        
        core.controller('AppContainerRoleCtrl', function ($scope, appService) {
            var page = core($scope, appService);
        })
    })