define(['core.edit', 'System/Acl/acl.service.js'], function (core) {
    'use strict'

    core.controller('AclEditCtrl', function ($scope, $q, $timeout, aclService) {
        var page = core($scope, aclService), OperationID, app;

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
                this.PostInfo = core.extend({}, editInfo, { AppID: app.ID });
            }
        }

        $scope.fnCheck = function (change) {
            if (page.editInfo && page.editInfo.ID)
                return;
            aclService.fnGetOperationCode({
                AppID: (app && app.ID > 1) ? app.ID : null,
                AppCode: (app && app.ID > 1) ? app.AppCode : null,
                OperationID: OperationID || 0,
                OperationName: $scope.editInfo.OperationName,
                OperationCode: change ? '' : $scope.editInfo.OperationCode
            })
            .success(function (data) {
                $scope.editInfo.OperationCode = data;
            });

        }
    });
})