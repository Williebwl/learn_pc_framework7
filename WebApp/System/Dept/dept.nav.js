define(['core.nav', 'System/Dept/dept.service.js', 'smart.tree'],
function (core) {
    'use strict'

    core.controller('DeptNavCtrl', function ($scope, institutionDeptService) {
        var page = core($scope, institutionDeptService),
        treeConf = $scope.TreeConf = {
            onnodeclick: $scope.fnSearchChange
        };
        institutionDeptService.fnGetSmartTree()
                              .success(function (d) { treeConf.data = d, $scope.fnSearchChange(d[0]) })
                              .error(function () { treeConf.data = [] })
    })
})