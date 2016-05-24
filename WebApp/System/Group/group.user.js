define(['core.container', 'evt.page', 'System/Group/group.service.js'], function (core, pageEvent) {
    'use strict';

    core.controller('GroupUserContainerCtrl', function ($scope, groupService) {
        var page = core($scope, groupService), group;
        
        page.$service.fnGetPaged = page.$service.fnGetGroupUser;

        page.fnGetSearchParams = function (pageConfig, params) {
            params["core.nav"] && core.extend(this, { GroupID: $scope.GroupID = params && params["core.nav"].ID });
        };
        $scope.fnRelateduser = function () {
            $scope.ShowDialog('relatedUser', group)
        }
        $scope.ShowView(function (e) {
            group = e.data;
            page.fnSearch(e);
        });
        page.fnSetViewInfo = function (e) {
            $scope.Info = e.data;
        }
        $scope.fnDelete = function (data) {
            $scope.fnConfirmAction('删除', groupService.fnRemoveGroupUser, [data])
                .success(function (success) {
                    $scope.$navScope.$broadcast(pageEvent.OnFormDeleted, [data]);
                    $scope.$navScope.$broadcast(pageEvent.OnFormSubmited, [data]);
                }).error(function (error) {
                    $scope.$emit(pageEvent.OnFormDeleteFailed, [data]);
                    $scope.$emit(pageEvent.OnFormSubmitFailed, [data]);
                    $self.errorNotice('操作无法完成，因为' + error.Message);
                });
        }
    })
})