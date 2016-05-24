define(['core.container', 'evt.page', 'System/Dept/position.service.js'],
    function (core, pageEvent) {
        'use strict';

        core.controller('DeptPositionTabCtrl',
            function ($scope, positionService) {
                var page = core($scope, positionService);

                page.fnGetSearchParams = function (pageConfig, params) {
                    core.extend(this, params && params['core.container'])
                }

                $scope.ShowView(function (e) { page.fnSearch($scope.Dept = { DeptID: e.data.ID, DeptName: e.data.DeptName, ShortName: e.data.ShortName, DeptCode: e.data.DeptCode }) });

                $scope.fnAdd = function () {
                    var dept = $scope.Dept;
                    $scope.ShowDialog('add', { DeptCode: dept.DeptCode, DeptName: dept.DeptName, DeptID: dept.DeptID })
                }
                $scope.fnEdit = function (id) {
                    var dept = $scope.Dept;
                    $scope.ShowDialog('edit', { ID: id, DeptCode: dept.DeptCode, DeptName: dept.DeptName, DeptID: dept.DeptID })
                }
                $scope.fnDisable = function (id) {
                    page.confirm('确定要停用此项目？').pass(function () {
                        positionService.fnDisable(id).success(function () { page.successNotice('项目已经停用！'), page.fnSearch() })
                                                     .error(function () { page.successNotice('项目停用失败！') })
                    })
                }

                $scope.$on(pageEvent.OnFormSubmited, page.fnSearch.bind(page))
            })
    })