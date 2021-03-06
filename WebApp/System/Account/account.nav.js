﻿define(['core.nav', 'evt.page', 'System/Account/account.service.js'],
function (core, pageEvent) {
    'use strict'

    core.controller('AccountNavCtrl', function ($scope, authAccountService) {
        core($scope, authAccountService);

        $scope.Status = authAccountService.fnGetStatus(),
        $scope.fnSelect($scope.Status[0], $scope.Status[0].Name),
        $scope.$on(pageEvent.OnFormPosted, function () { this.fnSelect(this.Search.Active, this.Search.Active.Name) }.bind($scope))
    })
})