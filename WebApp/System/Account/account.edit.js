define(['core.edit', 'System/Account/account.service.js', 'System/Dept/dept.service.js', 'System/Dept/position.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountEditCtrl',
            function ($scope, $q, $timeout, authAccountService, institutionDeptService, positionService) {
                var page = core($scope, authAccountService),
                    AccountID, last, dept, auto = !0;

                page.Promises.depts = institutionDeptService.fnGetAll().success(function (d) { $scope.Depts = d }),
                page.fnLoadPage = function (editInfo) {
                    editInfo.ID && (page.Promises.edit = authAccountService.fnGetEdit(AccountID = editInfo.ID).success(function (d) { page.extend(page.editInfo, d.Account), page.editInfo.Positions = d.Positions })),
                    $q.all(page.Promises).then(function (promises) {
                        $scope.Depted = !editInfo.ID ? (page.editInfo.Positions = [], []) :
                        (dept = promises.edit.data.Positions.map(function (d) { return { DeptID: d.DeptID, target: d } }),
                        $scope.Depts.grepAll(function () { var p = dept.removeGrepAll(function () { return this.DeptID; }, this.ID); return p && p.forEach(function (p) { p.target.dept = this }, this), !!p.length; }, !0))
                    })
                },
                $scope.$watchCollection('Depted', function (n, o) {
                    if (!Array.isArray(n) && !Array.isArray(o)) return;

                    if (auto) { auto = !1; return }

                    n = n || [], o = o || []

                    if (n.length < o.length) page.editInfo.Positions.removeGrepAll(function () { return !!n.grep(function () { return this.ID }, this.DeptID) }, !1)

                    if (n.length > o.length) {
                        var dept = n.grep(function () { return $.inArray(this, o) < 0 }, !0);
                        page.editInfo.Positions.push({ dept: dept, DeptName: dept.DeptName, DeptID: dept.ID, IsPartTime: 1 })
                    }
                }),
                $scope.$watchCollection('editInfo.Positions', function (n, o) {
                    if (!Array.isArray(n)) return;

                    var main;
                    n.forEach(function (p) {
                        (!main || !p.IsPartTime) && (main = p, p.IsPartTime = 0),
                        p.dept && fnLoadDeptPosition(p.dept, p)
                    })

                    $scope.editInfo.MainSuties = main;
                })

                $scope.$watch('editInfo.MainSuties', function (n, o) {
                    if (!n || !o || n === o) return;

                    n.IsPartTime = !(o.IsPartTime = 1)
                })

                function fnLoadDeptPosition(dept, p) {
                    dept.promises || (dept.promises = positionService.fnGetAll({ DeptID: dept.ID })),
                    dept.promises.success(function (d) { p.Position = d.grep(function () { return this.ID }, p.PositionID), p.Positions = d })
                }

                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = { Account: core.extend({}, editInfo, { Positions: !1, MainSuties: !1 }) };

                    $scope.fnCheck()

                    if (Array.isArray(editInfo.Positions)) {
                        postInfo.Positions = editInfo.Positions.map(function (o) {
                            return {
                                DeptID: o.DeptID,
                                DeptName: o.DeptName,
                                LeaderID: o.dept && o.dept.LeaderID,
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