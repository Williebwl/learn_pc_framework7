define(['core.nav', 'evt.page', 'evt.action', 'System/Group/group.service.js', 'System/App/app.service.js'],
function (core, pageEvent, actionEvent) {
    'use strict'

    core.controller('GroupNavCtrl', function ($scope, $rootScope, groupService, appService) {
        var page = core($scope, groupService);

        appService.fnGetAll().success(function (d) {
            $scope.Apps = d;
            $scope.App = d.filter(function (item) {
                return item.AppCode == 'SYS';
            })[0];
            $scope.fnKeySearch();
        });
        $scope.setApp = function (app) {
            $scope.App = app;
            $scope.fnKeySearch();
        };
        $scope.fnKeySearch = function () {
            groupService.fnGetAll({ AppID: $scope.App.ID, Key: $scope.Key }).success(function (d) {
                $scope.Groups = d;
                if (d.length > 0)
                    $scope.fnSelect(d[0], d[0].GroupName);
            });
        }

        $scope.$on(pageEvent.OnFormSubmited, function ($s, info) {
            groupService.fnGetAll({ AppID: $scope.App.ID, Key: $scope.Key }).success(function (d) {
                var current = d.filter(function (i) { return i.GroupCode == ((info && info.Source && info.Source.GroupCode) || $scope.Search.Active.GroupCode); });
                $scope.Groups = d;
                if (d.length > 0) {
                    if (current.length == 0)
                        current = [d[0]];
                    $scope.fnSelect(current[0], current[0].GroupName);
                }
            });
        }.bind($scope))
    })
})