define(['core.edit', 'System/Dept/dept.service.js'],
    function (core) {
        'use strict'

        core.controller('DeptEditCtrl',
            function ($scope, institutionDeptService, $q) {
                var page = core($scope, institutionDeptService);

                page.fnLoadPage = function (editInfo) {
                    page.Promises.GetAll = institutionDeptService.fnGetAll({ CurrentID: editInfo.id || 0 }).success(function (d) { $scope.Depts = d })
                    editInfo.id && (page.Promises.Info = institutionDeptService.fnGet(editInfo.id).success(function (d) { core.extend(page.editInfo, d) }))
                    !editInfo.id && (page.Promises.MaxSequence = institutionDeptService.fnGetMaxSequence()),
                    $q.all(page.Promises).then(function (promises) {
                        $scope.Parent = $scope.Depts.grep(function () { return this.ID; }, page.editInfo.ID) || $scope.Depts[0],
                        promises.MaxSequence && (page.editInfo.Sequence = promises.MaxSequence.data)
                    })
                    return { ID: editInfo.id }
                },
                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = core.extend({}, editInfo);

                    if ($scope.Parent) { postInfo.ParentID = $scope.Parent.ID }

                    if (!postInfo.hasOwnProperty('IsEnabled')) postInfo.IsEnabled = 1;

                    postInfo.ShortName = postInfo.DeptName
                }
            })
    })