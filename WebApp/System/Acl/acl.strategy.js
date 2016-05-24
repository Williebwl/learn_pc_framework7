define(['core.container', 'evt.page', 'System/Acl/acl.service.js'], function (core, pageEvent) {
    'use strict'

    core.controller('AclContainerStrategyCtrl', function ($scope, strategyService) {
        var page = core($scope, strategyService), operation = {};

        page.fnGetSearchParams = function (pageConfig, params) {
            core.extend(this, { AppID: operation.AppID, OperationID: operation.ID });
        };

        page.fnSetViewInfo = function (e) {
            $scope.Info = e.data;
        }

        $scope.ShowView(function (e) {
            operation = e.data;
            page.fnSearch(e);
        });

        $scope.$on(pageEvent.OnFormSubmited, function () {
            $scope.fnSearch();
        })
    })
})