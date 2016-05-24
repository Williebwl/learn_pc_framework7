define(['core.container', 'evt.page', 'System/Dept/position.service.js'],
    function (core, pageEvent) {
        'use strict';

        core.controller('DeptPositionTabCtrl',
            function ($scope, positionService) {
                var page = core($scope, positionService), dept;

                page.fnGetSearchParams = function (pageConfig, params) {
                    core.extend(this, params && params['core.container'])
                }

                $scope.ShowView(function (e) { dept = e.data, page.fnSearch({ DeptID: e.data && e.data.ID }) });

                $scope.fnAdd = function () {
                    $scope.ShowDialog('add', { DeptID: dept && dept.ID, DeptName: dept && dept.DeptName, ShortName: dept && dept.ShortName, DeptCode: dept && dept.DeptCode })
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