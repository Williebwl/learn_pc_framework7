define(['core.edit', 'evt.page', 'System/Group/group.service.js'], function (core, pageEvent) {
    'use strict';

    core.controller('GroupRelatedUserCtrl', function ($scope, groupService) {
        var page = core($scope, groupService);

        page.fnLoadPage = function (editInfo) {
            if (editInfo.ID) {
                groupService.fnAssignGroupUser(editInfo.ID).success(function (data) {
                    $scope.AllUsers = data;
                });
                this.$service.fnPut = this.$service.fnGrantGroupUser;
            }
        };
        page.fnSaveing = function (editInfo) {
            this.PostInfo = {
                UserIDs: $scope.Users.map(function (item) { return item.UserID; })
            };
        }
        page.fnSaveUpdateRefresh = function (d) {
            if (d) {
                var back = { Source: page.$editInfo, View: page.editInfo, PostInfo: page.PostInfo };
                this.successNotice('已完成保存操作。'),
                $scope.$navScope.$broadcast(pageEvent.OnFormPut, back),
                $scope.$navScope.$broadcast(pageEvent.OnFormSubmited, back),
                $scope.CloseDialog(back)
            } else this.fnSaveError.apply(this, arguments)
        }
    })
})