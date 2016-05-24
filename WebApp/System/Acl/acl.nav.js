define(['core.nav', 'evt.page', 'evt.action', 'System/Acl/acl.service.js', 'System/App/app.service.js'],
function (core, pageEvent, actionEvent) {
    'use strict'

    core.controller('AclNavCtrl', function ($scope, $rootScope, aclService, appService) {
        var page = core($scope, aclService);

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
            aclService.fnGetAll({ AppID: $scope.App.ID, Key: $scope.Key }).success(function (d) {
                $scope.Operations = d;
                if (d.length > 0)
                    $scope.fnSelect(d[0], d[0].OperationName);
            });
        }

        $scope.$on(pageEvent.OnFormSubmited, function ($s, info) {
            aclService.fnGetAll({ AppID: $scope.App.ID, Key: $scope.Key }).success(function (d) {
                var current = d.filter(function (i) { return i.OperationCode == ((info && info.Source && info.Source.OperationCode) || $scope.Search.Active.OperationCode); });
                $scope.Operations = d;
                if (d.length > 0) {
                    if (current.length == 0)
                        current = [d[0]];
                    $scope.fnSelect(current[0], current[0].OperationName);
                }
            });
        }.bind($scope))
    })
})