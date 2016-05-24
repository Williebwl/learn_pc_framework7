define(['core.container', 'System/App/app.service.js'], function (core) {
    'use strict'
    core.controller('AppContainerDeployCtrl', function ($scope, appService) {
        var page = core($scope, appService), app = {};

        page.fnSetViewInfo = function (e) {
            $scope.Info = e.data;
        }

        $scope.ShowView(function (e) {
            app = e.data;
            $scope.index = {};
            $scope.ShowConfig(app.AppCode);
        });

        $scope.ShowConfig = function (configName) {
            $scope.config = {};
            page.$service.fnGetAppConfig(configName).success(function (data) {
                if (!data.Groups || data.Groups.length == 0)
                    return;

                var index = data.Groups[0];
                if (index.Key == "IndexConfig") {
                    $scope.index = index;
                    $scope.ShowConfig(index.Items[0].Value)
                }
                else
                    $scope.config = data;
            });
        }

        $scope.fnSave = function () {
            page.$service.fnSetAppConfig($scope.config).success(function (data) {
                page.successNotice('设置已保存。');
            });
        }
    })
})