define(['core.edit', 'System/Dept/dept.service.js', 'System/Dept/position.service.js', 'System/Account/account.service.js'],
    function (core) {
        'use strict';

        core.controller('DeptRelatedUserCtrl',
            function ($scope, institutionDeptService, positionService, authAccountService) {
                var page = core($scope, institutionDeptService), editInfo;

                page.fnLoadPage = function (dept) {
                    editInfo = $scope.editInfo = { DeptID: dept.ID, },
                    $scope.Dept = dept,
                    page.Promises.position = positionService.fnGetAll({ DeptID: dept.ID })
                                                            .success(function (d) { $scope.Position = d[0], $scope.Positions = d })
                                                            .error(function () { $scope.Positions = [] }),
                    page.Promises.account = authAccountService.fnGetDeptUser({ DeptID: dept.ID })
                                                              .success(function (d) {
                                                                  editInfo.Leader = editInfo.User = d[0],
                                                                  $scope.Users = d
                                                              })
                                                              .error(function () { $scope.Users = [] })
                }

                $scope.$watch('Position', function (n, o) {
                    if (!n || n === o) return;

                    // $scope.editInfo.Leader = n.LeaderName
                })

                $scope.fnSave = function () {
                    //error()

                    //if (editInfo.Leader === editInfo.User) page.errorNotice('用户和直属领导不能为通一人！');


                }


            })
    })