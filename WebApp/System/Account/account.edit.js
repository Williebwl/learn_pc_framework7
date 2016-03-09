
define(['core.edit', 'System/Account/account.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountEditCtrl',
            function ($scope, authAccountService) {
                var page = core($scope, authAccountService);
            })
    })