define(['core.nav', 'System/Group/group.service.js'],
function (core) {
    'use strict'

    core.controller('GroupNavCtrl', function ($scope, $rootScope, groupService) {
        var page = core($scope, groupService);

        groupService.fnGetAll().success(function (d) { $scope.Groups = d, $scope.fnSearchChange(d[0]) }),
        $scope.fnAdd = function () { $scope.ShowDialog() }
    })
})