define(['core.container', 'evt.page', 'System/Group/group.service.js'], function (core, pageEvent) {
    'use strict'

    core.controller('AppContainerRoleCtrl', function ($scope, groupService) {
        var page = core($scope, groupService), app = {};

        page.fnGetSearchParams = function (pageConfig, params) {
            core.extend(this, { AppID: app.ID || 0 });
        };

        page.fnSetViewInfo = function (e) {
            $scope.Info = e.data;
        }
        
        $scope.ShowView(function (e) {
            app = e.data;
            page.fnSearch(e);
        });

        $scope.$on(pageEvent.OnFormSubmited, function () {
            $scope.fnSearch();
        })
    })
})