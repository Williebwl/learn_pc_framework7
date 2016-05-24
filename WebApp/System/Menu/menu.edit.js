define(['core.edit', 'System/Menu/menu.service.js'],
    function (core) {
        'use strict';

        core.controller('AppMenuEditCtrl',
            function ($scope, $q, $timeout, menuService) {
                var page = core($scope, menuService), self = this, last;
                $scope.WidgetModes = menuService.fnGetWidgetModes();

                page.fnSetViewInfo = function (app, menu) {
                    $scope.editInfo = this.editInfo = core.extend({}, { AppName: app.AppName, AppCode: app.AppCode, AppID: app.ID, SystemID: app.SystemID, Layer: 1 }, menu)
                },
                page.fnLoadPage = function (editInfo) {
                    this.editInfo.ID && (page.Promises.Info = menuService.fnGet(this.editInfo.ID).success(function (d) { core.extend(page.editInfo, d) }))
                    || (page.Promises.MaxSequence = menuService.fnGetMaxSequence().success(function (d) { page.editInfo.Sequence = d + 1 }));
                    return $q.all(page.Promises).then(function (promises) {
                        self.WidgetMode = page.editInfo.ID && $scope.WidgetModes.grep(function () { return this.value }, page.editInfo.WidgetModeID) || $scope.WidgetModes[0],
                        self.WidgetMode.NavUrl = page.editInfo.ID && promises.Info.data.NavUrl
                    })
                },
                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = core.extend({}, editInfo);

                    if (self.WidgetMode) {
                        postInfo.WidgetModeID = self.WidgetMode.value,
                        postInfo.WidgetMode = self.WidgetMode.name
                    }

                    postInfo.PageRoute = postInfo.MenuCode

                },
                $scope.$watch('info.WidgetMode', function (n) {
                    if (n) {
                        page.editInfo.NavUrl = n.NavUrl
                    }
                })
                $scope.fnCheck = function (change) {
                    var last1 = $timeout(function () {
                        page.Promises.checkCode = menuService.fnGetMenuCode({
                            ID: page.editInfo.ID,
                            Value: page.editInfo.AppID,
                            Name: $scope.editInfo.MenuName,
                            Code: change ? '' : $scope.editInfo.MenuCode
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.MenuCode = d })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                },
                $scope.fnExistsDeptName = function () {
                    var last1 = $timeout(function () {
                        page.Promises.checkName = menuService.fnGetExistsMenuName({
                            ID: page.editInfo.ID,
                            Value: page.editInfo.AppID,
                            Name: $scope.editInfo.MenuName
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.MenuCode = d.Code, $scope.editInfo.MenuName = d.Name })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                }
            })
    })