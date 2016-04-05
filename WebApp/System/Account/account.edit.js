
define(['core.edit', 'System/Account/account.service.js', 'System/Dept/dept.service.js', 'System/Tag/tag.service.js'],
    function (core) {
        'use strict'

        core.controller('AccountEditCtrl',
            function ($scope, $q, $timeout, authAccountService, institutionDeptService, tagService) {
                var page = core($scope, authAccountService),
                    AccountID, last, promises = {
                        deptp: institutionDeptService.fnGetAll().success(function (d) { $scope.Depts = d }),
                        positions: tagService.fnGetTagByTagClass('USER_ZW').success(function (d) { $scope.Positions = d, $scope.Positions.push({}) })
                    };

                page.fnLoadPage = function (editInfo) {
                    editInfo.ID && (promises.Edit = authAccountService.fnGetEdit(AccountID = editInfo.ID).success(function (d) { core.extend(page.editInfo, d.Account) }))
                    $q.all(promises)
                      .then(function (promises) {
                          var dept, positions = promises.positions.data;
                          $scope.Depted = promises.Edit && promises.Edit.data.Positions.select(function () {
                              var p = $scope.Depts.grep(function () { return this.ID }, this.DeptID);
                              if (this.isMainSuties) page.editInfo.MainSuties = p
                              return p.Position = positions.grep(function () { return this.TagName }, this.PositionName) || null, p
                          }),
                          !($scope.Depted && $scope.Depted.length) && (dept = $scope.Depts[0] || {}, page.editInfo.MainSuties = dept, dept.Position = positions[0] || {}, $scope.Depted = [dept])
                      })
                },
                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = { Account: editInfo };

                    $scope.fnCheck()

                    if (Array.isArray($scope.Depted)) {
                        postInfo.Positions = $scope.Depted.select(function (o) {
                            return {
                                DeptID: o.ID,
                                DeptName: o.DeptName,
                                LeaderID: o.LeaderID,
                                PositionName: o.Position && o.Position.TagName || '',
                                isMainSuties: editInfo.MainSuties === o
                            }
                        })
                    }
                },
                $scope.fnCheck = function (change) {
                    var last1 = $timeout(function () {
                        page.Promises.checkLoginName = authAccountService.fnGetLoginName({
                            AccountID: AccountID || 0,
                            RealName: $scope.editInfo.RealName,
                            LoginName: change ? '' : $scope.editInfo.UserName
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.UserName = d })
                    }, 700);

                    last && $timeout.cancel(last), last = last1
                },
                $scope.$watchCollection('Depted', function (n, o) { Array.isArray(n) && n != o && n.select(function(d) { !d.Position && (d.Position = $scope.Positions[0]) }) })
            })

    })