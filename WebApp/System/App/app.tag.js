define(['core.container', 'System/App/app.service.js', 'System/Tag/tag.service.js'],
    function (core) {
        'use strict'
        core.controller('AppContainerTagCtrl', function ($scope, tagClassService) {
            var page = core($scope, tagClassService);
        })

    })