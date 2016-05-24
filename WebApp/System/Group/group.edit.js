define(['core.edit', 'System/Group/group.service.js'], function (core) {
    'use strict'

    core.controller('GroupEditCtrl', function ($scope, $q, $timeout, groupService) {
        var page = core($scope, groupService), GroupID, app;

        $scope.GroupTypes = [
            { Description: "", Value: null },
            { Description: "所有人", Value: 1 },
            { Description: "来宾", Value: 2 },
            { Description: "普通用户", Value: 3 },
            { Description: "高级用户", Value: 4 },
            { Description: "管理员", Value: 5 },
            { Description: "系统用户", Value: 6 }
        ];

        var fnSetViewInfo = page.fnSetViewInfo;
        page.fnSetViewInfo = function (editInfo) {
            if (editInfo.AppCode) {
                app = editInfo;
                fnSetViewInfo.call(page, {});
            } else {
                fnSetViewInfo.call(page, editInfo);
            }
        };

        page.fnSaveing = function (editInfo) {
            if (app) {
                this.PostInfo = core.extend({}, editInfo, { AppID: app.ID, GroupFlagID: 3 });
            }
        }

        $scope.fnCheck = function (change) {
            if (page.editInfo && page.editInfo.ID)
                return;
            groupService.fnGetGroupCode({
                AppID: (app && app.ID > 1) ? app.ID : null,
                AppCode: (app && app.ID > 1) ? app.AppCode : null,
                GroupID: GroupID || 0,
                GroupName: $scope.editInfo.GroupName,
                GroupCode: change ? '' : $scope.editInfo.GroupCode
            })
            .success(function (data) {
                $scope.editInfo.GroupCode = data;
            });

        }
    });
})