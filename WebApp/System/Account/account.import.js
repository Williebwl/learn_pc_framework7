
define(['core.import', 'System/Account/account.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountImportCtrl',
            function ($scope, authAccountService) {
                core($scope, authAccountService)
            })
    })