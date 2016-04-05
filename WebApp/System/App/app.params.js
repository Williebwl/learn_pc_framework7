define(['core.container', 'evt.page', 'System/App/app.service.js', 'System/Menu/menu.service.js'],
    function (core, pageEvent) {
        'use strict'

        core.controller('AppContainerParamsCtrl', function ($scope, appService, menuService) {
            var page = core($scope, menuService)

            page.ShowDialog = function (info) {
                var appInfo = info

                appService.fnGet(info.ID)
                            .success(function (d) { $scope.AppInfo = info = d })
                            .error(function () { $scope.AppInfo = info = {} }),
                menuService.fnGetInfoByAppId(info.ID)
                            .success(function (d) {
                                $scope.MeunInfo = d[0] || {},
                                $scope.View.Items = $scope.MeunInfos = d
                            }).error(function () {
                                $scope.MeunInfo = {}, $scope.View.Items = $scope.MeunInfos = []
                            })
                $scope.fnEdit = function () {
                    if (!appInfo) return;

                    $scope.ShowDialog(appInfo)
                },
                $scope.$on(pageEvent.OnFormPut, function (s, e) {
                    core.extend(e.Source, e.View.App)
                })
            }

        })

    })