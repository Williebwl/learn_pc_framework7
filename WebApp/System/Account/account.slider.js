define(['core.view', 'System/App/app.service.js', 'System/Group/group.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountSliderCtrl',
            function ($scope, $q, authAccountService, groupService, appService) {
                var page = core($scope, authAccountService);

                page.fnLoadPage = function (info, target) {
                    $scope.target = target;
                    return $q.all([authAccountService.fnGetEdit(info.ID).success(function (d) { $scope.Info = d }),
                                   groupService.fnGetByUser(info.ID).success(function (d) { $scope.Groups = d }),
                                   appService.fnGetByUser(info.ID).success(function (d) { $scope.Apps = d })])
                },
                $scope.fnCancelGroup = function (id, group) {
                    page.confirm('确定要取消【' + group.GroupName + '】权限?').pass(function () {
                        groupService.fnCancelUserGroup(id, app.ID).success(function () { $scope.Groups.remove(group) }).error(function () { page.errorNotice('角色取消失败！') })
                    })
                },
                $scope.fnCancelApp = function (id, app) {
                    page.confirm('确定要删除').pass(function () {
                        appService.fnCancelUserApp(id, app.ID).success(function () { $scope.Apps.remove(app) }).error(function () { page.errorNotice('应用取消失败！') })
                    })
                }
            })

    })