define(['core.toolbar', 'System/Account/account.service.js'], function (core) {
    'use strict'

    core.controller('AccountSearchCtrl', function ($scope, authAccountService) {
        var page = core($scope, authAccountService);
    })
})