define(['core.container', 'System/Group/group.service.js'], function (core) {
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
    })
})