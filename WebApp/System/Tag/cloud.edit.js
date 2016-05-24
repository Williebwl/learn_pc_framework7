define(['core.edit', 'System/Acl/acl.service.js'], function (core) {
    'use strict'

    core.controller('TagCloudEditCtrl', function ($scope, $q, $timeout, strategyService) {
        var page = core($scope, strategyService), StrategyID, operation;

        $scope.StrategyFlags = [
            { Description: "", Value: null }
        ];

        var fnSetViewInfo = page.fnSetViewInfo;
        page.fnSetViewInfo = function (editInfo) {
            if (editInfo.OperationCode) {
                operation = editInfo;
                fnSetViewInfo.call(page, {});
            } else {
                fnSetViewInfo.call(page, editInfo);
            }
        };

        page.fnSaveing = function (editInfo) {
            if (operation) {
                this.PostInfo = core.extend({}, editInfo, { AppID: operation.AppID, OperationID: operation.ID });
            }
        }

        $scope.fnCheck = function (change) {
            if (page.editInfo && page.editInfo.ID)
                return;
            strategyService.fnGetStrategyCode({
                OperationID: operation.ID,
                OperationCode: operation.OperationCode,
                StrategyID: StrategyID || 0,
                StrategyName: $scope.editInfo.StrategyName,
                StrategyCode: change ? '' : $scope.editInfo.StrategyCode
            })
            .success(function (data) {
                $scope.editInfo.StrategyCode = data;
            });

        }
    });
})