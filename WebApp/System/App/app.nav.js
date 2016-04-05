define(['core.nav', 'evt.page', 'System/App/app.service.js'],
function (core, pageEvent) {
    'use strict'

    core.controller('AppNavCtrl', function ($scope, $rootScope, appService) {
        var page = core($scope, appService);
        appService.fnGetAll().success(function (d) { $scope.apps = d, $scope.fnSelected(d[0],d[0].AppName) }),
        $scope.fnAdd = function () {
            $scope.ShowDialog()
        },
        $scope.fnEdit = function (app) {
            $scope.ShowDialog(app)
        },
        $scope.fnDel = function (e, app) {
            page.confirm('确定要禁用该应用？').ok(function (e) {
                if (!e.s) return;

                var s = app.IsValid ? 0 : 1;
                appService.fnSetStatus(app.ID, s, function (d) { d ? app.IsValid = s : error; }, error)
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

        function error() { page.errorNotice('应用禁用失败！'); }
    })
})