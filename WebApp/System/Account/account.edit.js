define(['core.edit', 'System/Account/account.service.js', 'System/Dept/dept.service.js', 'System/Dept/position.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountEditCtrl',
            function ($scope, $q, $timeout, authAccountService, institutionDeptService, positionService) {
                var page = core($scope, authAccountService),
                    AccountID, last, dept;

                page.Promises.depts = institutionDeptService.fnGetAll().success(function (d) { $scope.Depts = d }),
                page.fnLoadPage = function (editInfo) {
                    editInfo.ID && (page.Promises.edit = authAccountService.fnGetEdit(AccountID = editInfo.ID).success(function (d) { page.extend(page.editInfo, d.Account) })),
                    $q.all(page.Promises).then(function (promises) {
                        $scope.Depted = !editInfo.ID ? [] :
                        (dept = promises.edit.data.Positions.map(function (d) { return { PositionID: d.PositionID, DeptID: d.DeptID, IsPartTime: d.IsPartTime } }),
                        $scope.Depts.grepAll(function () {
                            var p = dept.removeGrep(function () { return this.DeptID; }, this.ID);
                            this.Position = p && p.PositionID;
                            if (p && !p.IsPartTime) $scope.editInfo.MainSuties = this;
                            return !!p;
                        }, !0).reverse()) //$scope.editInfo.MainSuties = $scope.Depts[0]
                    })
                },
                $scope.$watchCollection('Depted', function (n, o) {
                    if (!Array.isArray(n) || n === o) return;

                    var main;
                    for (var p in n) {
                        var dept = n[p];
                        !main && (main = $scope.editInfo.MainSuties === dept);
                        if (dept && !Array.isArray(dept.Positions) && !dept.promises) {
                            fnLoadDeptPosition.call(dept, dept)
                        }
                    }
                    if (!main) $scope.editInfo.MainSuties = n[0];
                })

                function fnLoadDeptPosition(dept) {
                    this.promises = positionService.fnGetAll({ DeptID: this.ID })
                                                   .success(function (d) {
                                                       dept.Positions = d,
                                                       dept.Position = dept.Position && d.grep(function () { return this.ID; }, dept.Position)
                                                   }).error(function () { dept.Positions = [] })
                }

                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = { Account: editInfo };

                    $scope.fnCheck()

                    if (Array.isArray($scope.Depted)) {
                        postInfo.Positions = $scope.Depted.select(function (o) {
                            return {
                                DeptID: o.ID,
                                DeptName: o.DeptName,
                                LeaderID: o.LeaderID,
                                PositionID: o.Position && o.Position.ID,
                                PositionName: o.Position && o.Position.PositionName,
                                IsPartTime: $scope.editInfo.MainSuties !== o
                            }
                        })

                        if (postInfo.Positions.length) postInfo.Account.Dept = 'Dept'
                    }
                },
                $scope.fnCheck = function (change) {
                    var last1 = $timeout(function () {
                        page.Promises.checkLoginName = authAccountService.fnGetLoginName({
                            ID: AccountID || 0,
                            Name: $scope.editInfo.RealName,
                            Code: change ? '' : $scope.editInfo.UserName
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.UserName = d })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                }
            })

    })