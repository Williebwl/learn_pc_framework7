define(['core.container', 'evt.action', 'System/Group/group.service.js', 'System/Account/account.service.js'], function (core, actionEvent) {
    'use strict';

    core.controller('GroupModuleContainerCtrl', function ($scope, groupService) {
        var page = core($scope, groupService);

        $scope.ShowView(function (e) {
            groupService.fnGetAppAccess(e.data.ID)
                        .success(function (d) { $scope.AppAccess = d })
                        .error(function () { $scope.AppAccess = {} })
        });

        //添加App
        $scope.fnAddApp = function (info) { swap(info, $scope.AppAccess.AllApps, $scope.AppAccess.GroupApps) },
        //删除App
        $scope.fnDelApp = function (info) { swap(info, $scope.AppAccess.GroupApps, $scope.AppAccess.AllApps) },
        //添加所有App
        $scope.fnAddAllApp = function () { swap($scope.AppAccess.AllApps, $scope.AppAccess.GroupApps) },
        //删除所有App
        $scope.fnDelAllApp = function () { swap($scope.AppAccess.GroupApps, $scope.AppAccess.AllApps) },
        $scope.fnSaveAppAccess = function () {
            var groupID = $scope.AppAccess.GroupID;
            groupService.fnSaveAppAccess(groupID, $scope.AppAccess.GroupApps.select(function () { return { GroupID: groupID, AppID: this.ID }; }))
                        .success(function (d) { d ? page.successNotice('保存成功。') : page.errorNotice('保存失败！') })
                        .error(function () { page.errorNotice('保存失败！') })
        }
    })

    function swap(d, s, t) {
        if (arguments.length == 2) {
            for (var i = 0, l = d.length ; i < l; i++) s.push(d[i])

            d.length = 0;

            return;
        }

        s.remove(d), t.push(d)
    }
})