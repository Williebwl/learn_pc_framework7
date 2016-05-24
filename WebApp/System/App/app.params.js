define(['core.view', 'evt.page', 'System/App/app.service.js', 'System/Menu/menu.service.js'],
    function (core, pageEvent) {
        'use strict'

        core.controller('AppContainerParamsCtrl',
            function ($q, $scope, appService, menuService) {
                var page = core($scope, menuService), data;

                page.fnSetViewInfo = function (e) {
                    $scope.Info = data = e.data;
                },
                page.fnLoadPage = function (e) {
                    return $q.all([fnLoadAppAccess(), fnLoadMenus()])
                },
                $scope.fnDelete = function (id) {
                    page.fnConfirmAction('删除', page.$service.fnDelete, id).success(function (r) { r ? fnLoadMenus() : errMsg() }).error(errMsg)

                },
                $scope.fnSequence = function (data, canSort) {
                    if (!(canSort || $scope.View.CanSort)) {
                        page.alert('请选择需要排序的项目！');
                        return;
                    }

                    $scope.fnAction('排序', page.$service.fnSequence, [data.grepAll(function () { return this.change; }, 1).select(function () { return { ID: this.ID, Sequence: this.Sequence } })]);
                }
                $scope.$on(pageEvent.OnFormSubmited, fnLoadMenus)

                function fnLoadAppAccess() {
                    appService.fnGetAppAccess(data.ID).success(function (d) { $scope.GroupInfo = d });
                }

                function fnLoadMenus() {
                    return menuService.fnGetAll({ AppID: data.ID, Layer: 0 }).success(function (d) {
                        $scope.Menu = d.filter(function (item) {
                            return item.Layer == 0;
                        })[0];
                        $scope.Menus = d.filter(function (item) {
                            return item.Layer == 1;
                        });
                    })
                }

                function errMsg() { page.errorNotice('菜单删除失败！') }
            })
    });