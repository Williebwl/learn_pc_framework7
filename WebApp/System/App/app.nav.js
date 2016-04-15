define(['core.nav', 'evt.page', 'System/App/app.service.js'],
function (core, pageEvent) {
    'use strict'

    core.controller('AppNavCtrl', function ($scope, $rootScope, appService) {
        var page = core($scope, appService);
        appService.fnGetAll().success(function (d) {
            $scope.apps = d, $scope.fnSelect(d[0], d[0].AppName)
        });
        $scope.fnKeySearch = function () {
            appService.fnGetAll({Key:$scope.Key}).success(function (d) {
                $scope.apps = d, $scope.fnSelect(d[0], d[0].AppName)
            });
        };
        $scope.fnAdd = function () {
            $scope.ShowDialog()
        };
        $scope.fnEdit = function (app) {
            $scope.ShowDialog(app)
        },
        $scope.fnDel = function (e, app) {
            page.confirm('确定要' + (app.IsValid?'禁用':'启用') + '该应用？').ok(function (e) {
                var s = app.IsValid ? false : true;
                appService.fnSetStatus(app.ID, s).success(function () {
                    app.IsValid = s;
                }).error(function () {
                    page.errorNotice('应用禁用失败！');
                });
            });
        },
        $scope.$on(pageEvent.OnFormPosted, function (s, e) {
            $scope.apps.push({
                ID: e.View.ID,
                AppName: e.View.App.AppName,
                AppCode: e.View.App.AppCode,
                AppType: e.PostInfo.App.AppType,
                AppTypeID: e.PostInfo.App.AppTypeID,
                IsValid: 1
            })
        }),
        $scope.$on(pageEvent.OnFormPut, function (s, e) {
            core.extend(e.Source, e.View.App)
        })
    })
})