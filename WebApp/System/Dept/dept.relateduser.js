define(['core.edit', 'System/Dept/dept.service.js', 'System/Dept/position.service.js', 'System/Account/account.service.js'],
    function (core) {
        'use strict';

        core.controller('DeptRelatedUserCtrl',
            function ($scope, institutionDeptService, positionService, authAccountService) {
                var page = core($scope, institutionDeptService);
                page.fnSetViewInfo = function (dept) {
                    this.editInfo = $scope.editInfo = { DeptID: dept.ID, DeptCode: dept.DeptCode, DeptName: dept.DeptName }
                }
                page.$service.fnPost = page.$service.fnSavePositionUser,
                page.fnLoadPage = function (dept) {
                    page.Promises.position = positionService.fnGetAll({ DeptID: dept.ID,  })
                                                            .success(function (d) { $scope.Position = d[0], $scope.Positions = d })
                                                            .error(function () { $scope.Positions = [] }),
                    page.Promises.account = authAccountService.fnGetDeptUser({ DeptID: dept.ID })
                                                              .success(function (d) {
                                                                  //$scope.Leader = $scope.User = d[0],
                                                                  $scope.Users = d
                                                              })
                                                              .error(function () { $scope.Users = [] })
                }

                page.fnSaveing = function (editInfo) {
                    var data = this.PostInfo = core.extend({ IsPartTime: !0, IsValid: !0 }, editInfo);

                    if ($scope.Position) {
                        data.PositionID = $scope.Position.ID,
                        data.PositionName = $scope.Position.PositionName
                    }

                    if ($scope.User) {
                        data.UserID = $scope.User.UserID,
                        data.UserName = $scope.User.UserName
                    }

                    if ($scope.Leader) {
                        data.LeaderID = $scope.Leader.UserID,
                        data.LeaderName = $scope.Leader.UserName
                    }
                }

            })
    })