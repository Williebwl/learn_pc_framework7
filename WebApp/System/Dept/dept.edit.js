define(['core.edit', 'System/Dept/dept.service.js'],
    function (core) {
        'use strict'

        core.controller('DeptEditCtrl',
            function ($scope, institutionDeptService, $q, $timeout) {
                var page = core($scope, institutionDeptService), last, ID;

                page.fnLoadPage = function (editInfo, parent) {
                    page.Promises.GetAll = institutionDeptService.fnGetAll({ CurrentID: ID = editInfo.ID || 0 }).success(function (d) { $scope.Depts = d }),
                    editInfo.ID && (page.Promises.Info = institutionDeptService.fnGet(editInfo.ID).success(function (d) { core.extend(page.editInfo, d) }))
                    || (page.Promises.MaxSequence = institutionDeptService.fnGetMaxSequence().success(function (d) { page.editInfo.Sequence = d + 1 }));
                    return $q.all(page.Promises).then(function () {
                        $scope.Parent = page.editInfo.ParentID && $scope.Depts.grep(function () { return this.ID; }, page.editInfo.ParentID) ||
                            parent && $scope.Depts.grep(function () { return this.ID; }, parent.id) ||
                            $scope.Depts[0]
                    })
                },
                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = core.extend({}, editInfo);

                    if ($scope.Parent) { postInfo.ParentID = $scope.Parent.ID }

                    if (!postInfo.hasOwnProperty('IsEnabled')) postInfo.IsEnabled = 1;

                    postInfo.ShortName = postInfo.DeptName
                },
                $scope.fnCheck = function (change) {
                    var last1 = $timeout(function () {
                        page.Promises.checkDeptCode = institutionDeptService.fnGetDeptCode({
                            ID: ID,
                            Name: $scope.editInfo.DeptName,
                            Code: change ? '' : $scope.editInfo.DeptCode
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.DeptCode = d })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                },
                $scope.fnExistsDeptName = function () {
                    var last1 = $timeout(function () {
                        page.Promises.checkDeptCode = institutionDeptService.fnGetExistsDeptName({
                            ID: ID,
                            Name: $scope.editInfo.DeptName
                        })
                        .success(function (d) { if (last === last1) $scope.editInfo.DeptCode = d.Code, $scope.editInfo.DeptName = d.Name })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                }
            })
    })