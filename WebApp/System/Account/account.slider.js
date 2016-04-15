define(['core.view', 'evt.action', 'System/App/app.service.js', 'System/Group/group.service.js'],
    function (core, actionEvent) {
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
                },
                $scope.fnLogout = function (isValid) {
                    isValid ? fnLogout('注销', 'fnLogout') : fnLogout('启用', 'fnSetEnable')
                }

                function fnLogout(type, fn) {
                    page.confirm('确定要' + type + '该用户？').ok(function () {
                        authAccountService[fn]($scope.Info.Account.ID).success(function () {
                            page.successNotice('已完成' + type + '操作。');
                            page.emit(actionEvent.OnSearch)();
                        }).error(function (e) {
                            page.errorNotice('操作无法完成，因为' + e.Message);
                        });
                    });
                }
            })

    })