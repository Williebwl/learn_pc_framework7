define(['core.edit', 'System/Dept/position.service.js', 'System/Group/group.service.js'],
    function (core) {
        'use strict'

        core.controller('PositionEditCtrl',
            function ($scope, positionService, groupService, $q, $timeout) {
                var page = core($scope, positionService), last, ID;

                page.fnLoadPage = function (editInfo) {
                    (editInfo.ID && (page.Promises.Info = positionService.fnGet(ID = editInfo.ID).success(function (d) { core.extend(page.editInfo, d) }))) ||
                    (editInfo.IsValid = !0, page.Promises.MaxSequence = positionService.fnGetMaxSequence().success(function (d) { page.editInfo.Sequence = d + 1 })),
                    page.Promises.GetAll = positionService.fnGetAll({ CurrentID: editInfo.id || 0 }).success(function (d) { $scope.Positions = d });
                    return $q.all(page.Promises).then(function () {
                        editInfo.ID && editInfo.ParentID && ($scope.Parent = $scope.Positions.grep(function () { return this.ID; }, page.editInfo.ParentID))
                    })
                },
                page.fnSaveing = function (editInfo) {
                    var postInfo = this.PostInfo = core.extend({}, editInfo);

                    postInfo.ParentID = $scope.Parent && $scope.Parent.ID || 0
                },
                $scope.fnCheck = function (change) {
                    var last1 = $timeout(function () {
                        page.Promises.checkDeptCode = positionService.fnGetPositionCode({
                            ID: ID,
                            Name: page.editInfo.PositionName,
                            Code: change ? '' : page.editInfo.PositionCode
                        })
                        .success(function (d) { if (last === last1) page.editInfo.PositionCode = d })
                    }, 200);

                    last && $timeout.cancel(last), last = last1
                }
            })
    })