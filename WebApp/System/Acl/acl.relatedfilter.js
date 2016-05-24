define(['core.edit', 'System/Acl/acl.service.js'], function (core) {
    'use strict'

    core.controller('AclRelatedFilterCtrl', function ($scope, $q, $timeout, filterService) {
        var page = core($scope, filterService), filterID = null, operation;

        $scope.LogicOperations = page.$service.fnGetLogicOperations();
        $scope.FilterOperations = page.$service.fnGetFilterOperations();

        var fnSetViewInfo = page.fnSetViewInfo;
        page.fnSetViewInfo = function (editInfo) {
            if (editInfo.OperationCode) {
                operation = editInfo;
                fnSetViewInfo.call(page, { Conditions: [] });
                $scope.fnAddGroup(0);
            } else {
                filterID = editInfo.ID;
                page.$service.get(editInfo.ID).success(function (data) {
                    data.Conditions = page.sort(data.Conditions);
                    fnSetViewInfo.call(page, data);
                })
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
            filterService.fnGetFilterCode({
                OperationID: operation.ID,
                OperationCode: operation.OperationCode,
                FilterID: filterID || 0,
                FilterName: $scope.editInfo.FilterName,
                FilterCode: change ? '' : $scope.editInfo.FilterCode
            })
            .success(function (data) {
                $scope.editInfo.FilterCode = data;
            });
        }

        page.sort = function (arrs) {
            arrs = arrs.filter(function (item) {
                return item;
            });
            arrs.sort(function (a, b) {
                if (a.GroupIndex != b.GroupIndex)
                    return a.GroupIndex - b.GroupIndex;
                else if (a.FilterIndex != b.FilterIndex)
                    return a.FilterIndex - b.FilterIndex;
                else
                    return 0;
            });
            return arrs;
        };
        $scope.fnAddGroup = function (groupIndex) {
            var newConditions = page.editInfo.Conditions.map(function (condition, index) {
                return angular.extend({}, condition, { GroupIndex: condition.GroupIndex + (condition.GroupIndex > groupIndex ? 1 : 0) });
            });
            newConditions.push({
                FilterID: filterID,
                GroupIndex: groupIndex + 1,
                FilterIndex: 1,
                LogicOperation: 'and',
                PropertyName: 'ID',
                FilterOperation: '=',
                FilterValue: '0'
            });
            page.editInfo.Conditions = page.sort(newConditions);
        };
        $scope.fnDelGroup = function (groupIndex) {
            var newConditions = page.editInfo.Conditions.map(function (condition, index) {
                if (condition.GroupIndex == groupIndex)
                    return;
                return angular.extend({}, condition, { GroupIndex: condition.GroupIndex - (condition.GroupIndex > groupIndex ? 1 : 0) });
            });
            page.editInfo.Conditions = page.sort(newConditions);
        };
        $scope.fnAddCondition = function (groupIndex, filterIndex) {
            var newConditions = page.editInfo.Conditions.map(function (condition, index) {
                return angular.extend({}, condition, { FilterIndex: condition.FilterIndex + (condition.GroupIndex == groupIndex && condition.FilterIndex > filterIndex ? 1 : 0) });
            });
            newConditions.push({
                FilterID: filterID,
                GroupIndex: groupIndex,
                FilterIndex: filterIndex + 1,
                LogicOperation: 'and',
                PropertyName: 'ID',
                FilterOperation: '=',
                FilterValue: '0'
            });
            page.editInfo.Conditions = page.sort(newConditions);
        };
        $scope.fnDelCondition = function (groupIndex, filterIndex) {
            var newConditions = page.editInfo.Conditions.map(function (condition, index) {
                if (condition.GroupIndex == groupIndex && condition.FilterIndex == filterIndex)
                    return;
                return angular.extend({}, condition, { FilterIndex: condition.FilterIndex - (condition.GroupIndex == groupIndex && condition.FilterIndex > filterIndex ? 1 : 0) });
            });
            page.editInfo.Conditions = page.sort(newConditions);
        };
    });

})