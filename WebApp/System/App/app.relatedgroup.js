define(['core.edit', 'System/App/app.service.js'], function (core) {
    'use strict'
    core.controller('AppRelatedGroupCtrl', function ($scope, appService) {
        var page = core($scope, appService);
        //添加用户组
        $scope.fnAddGroup = function (info) { swap(info, $scope.GroupInfo.AllGroups, $scope.GroupInfo.AppGroups) };
        //删除用户组
        $scope.fnDelGroup = function (info) { swap(info, $scope.GroupInfo.AppGroups, $scope.GroupInfo.AllGroups) };
        //添加所有用户组
        $scope.fnAddAllGroup = function () { swap($scope.GroupInfo.AllGroups, $scope.GroupInfo.AppGroups) };
        //删除所有用户组
        $scope.fnDelAllGroup = function () { swap($scope.GroupInfo.AppGroups, $scope.GroupInfo.AllGroups) };

        page.fnLoadPage = function (editInfo) {            
            appService.fnGetAppAccess(editInfo.ID).success(function (d) { $scope.GroupInfo = d });
            return editInfo;
        }

        page.fnSaveing = function () {
            var postInfo = this.PostInfo = { App: this.editInfo };

            if ($scope.GroupInfo.AppGroups) postInfo.AppGroups = $scope.GroupInfo.AppGroups.select(function () { return { GroupID: this.ID } });
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
    