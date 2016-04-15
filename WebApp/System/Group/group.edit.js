define(['core.edit', 'System/Group/group.service.js'],
function (core) {
    'use strict'

    core.controller('GroupEditCtrl', function ($scope, $q, $timeout, groupService) {
        var page = core($scope, groupService), GroupID, last;

        $scope.GroupTypes = [
            { Description: "所有人", Value: 1 },
            { Description: "来宾", Value: 2 },
            { Description: "普通用户", Value: 3 },
            { Description: "高级用户", Value: 4 },
            { Description: "管理员", Value: 5 },
            { Description: "系统用户", Value: 6 }
        ];

        page.fnLoadPage = function (editInfo) {
            if (editInfo.ID) {
            }
        };

        $scope.fnCheck = function (change) {
            var last1 = $timeout(function () {
                page.Promises.checkGroupCode = groupService.fnGetGroupCode({
                    GroupID: GroupID || 0,
                    GroupName: $scope.editInfo.GroupName,
                    GroupCode: change ? '' : $scope.editInfo.GroupCode
                })
                .success(function (d) {
                    if (last === last1)
                        $scope.editInfo.GroupCode = d
                })
            }, 200);

            last && $timeout.cancel(last), last = last1
        }
    });
})