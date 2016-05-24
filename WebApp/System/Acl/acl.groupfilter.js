define(['core.edit', 'System/Acl/acl.service.js'], function (core) {
    'use strict'
    core.controller('AclGroupFilterCtrl', function ($scope, filterService) {
        var page = core($scope, filterService);
        //添加用户组
        $scope.fnAddGroup = function (info) { swap(info, $scope.editInfo.AllGroups, $scope.editInfo.FilterGroups) };
        //删除用户组
        $scope.fnDelGroup = function (info) { swap(info, $scope.editInfo.FilterGroups, $scope.editInfo.AllGroups) };
        //添加所有用户组
        $scope.fnAddAllGroup = function () { swap($scope.editInfo.AllGroups, $scope.editInfo.FilterGroups) };
        //删除所有用户组
        $scope.fnDelAllGroup = function () { swap($scope.editInfo.FilterGroups, $scope.editInfo.AllGroups) };

        page.$service.fnPut = page.$service.fnSaveGroupAccess;

        var fnSetViewInfo = page.fnSetViewInfo;
        page.fnSetViewInfo = function (editInfo) {
            fnSetViewInfo.call(page, $.extend(true, {}, editInfo));
        };
    })
    function swap(d, s, t) {
        if (arguments.length == 2) {
            for (var i = 0, l = d.length ; i < l; i++) s.push(d[i])

            d.length = 0;

            return;
        }

        s.remove(d), t.push(d)
    }
})
    