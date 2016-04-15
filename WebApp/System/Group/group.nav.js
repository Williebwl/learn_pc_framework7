define(['core.nav', 'evt.page', 'evt.action', 'System/Group/group.service.js'],
function (core, pageEvent, actionEvent) {
    'use strict'

    core.controller('GroupNavCtrl', function ($scope, $rootScope, groupService) {
        var page = core($scope, groupService);

        groupService.fnGetAll({ AppID: 1 }).success(function (d) {
            $scope.Groups = d, $scope.fnSelect(d[0], d[0].GroupName);
        });

        $scope.fnKeySearch = function () {
            groupService.fnGetAll({ AppID: 1, Key: $scope.Key }).success(function (d) {
                $scope.Groups = d, $scope.fnSelect(d[0], d[0].GroupName);
            });
        }

        $scope.$on(pageEvent.OnFormSubmited, function () {
            groupService.fnGetAll({ AppID: 1 }).success(function (d) {
                var current = d.filter(function (i) { return i.ID == $scope.Search.Active.ID; });
                if (current.length == 0)
                    current = [d[0]];
                $scope.Groups = d, $scope.fnSelect(current[0], current[0].GroupName);
            });
        }.bind($scope))
    })
})