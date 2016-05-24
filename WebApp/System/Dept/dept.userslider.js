define(['core.view', 'evt.action', 'System/App/app.service.js', 'System/Group/group.service.js', 'System/Dept/dept.service.js'],
    function (core, actionEvent) {
        'use strict'

        core.controller('DeptUserSliderCtrl',
            function ($scope, $q, authAccountService, groupService, appService, institutionDeptService) {
                var page = core($scope, authAccountService), positionUser;

                page.fnLoadPage = function (info) {
                    positionUser = info,
                    $scope.IsValid = positionUser.IsValid
                    return $q.all([authAccountService.fnGetEdit(info.UserID).success(function (d) { $scope.Info = d }),
                                   groupService.fnGetByUser(info.UserID).success(function (d) { $scope.Groups = d }),
                                   appService.fnGetByUser(info.UserID).success(function (d) { $scope.Apps = d })])
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

                $scope.fnDisable = function (isValid) {
                    positionUser.IsValid ? fnDisable('停用', 'fnDisablePositionUser') : fnDisable('启用', 'fnEnablePositionUser')
                }

                function fnDisable(type, fn) {
                    page.confirm('确定要' + type + '该用户部门职位？').ok(function () {
                        institutionDeptService[fn](positionUser.ID).success(function () {
                            page.successNotice('已完成' + type + '操作。');
                            page.fnEmit(actionEvent.OnSearch)
                        }).error(function (e) {
                            page.errorNotice('操作无法完成，因为' + e.Message);
                        });
                    });
                }
            })

    })