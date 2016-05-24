define(['core.container', 'evt.action', 'System/Dept/dept.service.js'], function (core, actionEvent) {
    'use strict'

    core.controller('DeptContainerCtrl', function ($q, $scope, institutionDeptService) {
        $scope.$on(actionEvent.OnSearch, function (s, e) {
            var id = e.data && e.data.id;
            id && institutionDeptService.fnGet(id).success(function (d) {
                $scope.Info = d;
                $scope.ShowTab({ origin: e.origin, data: d });
            }).error(error) || error()

            function error() {
                $scope.Info = { ID: id };
                $scope.ShowTab({ origin: e.origin, data: { ID: id } })
            }
        })
    })
})