define(['core.view', 'evt.action', 'System/Group/group.service.js'],
function (core, actionEvent) {
    'use strict'

    core.controller('GroupContainerCtrl', function ($scope, groupService) {
        var page = core($scope, groupService);

        $scope.$on(actionEvent.OnSearch, function ($s, e) {
            $scope.Info = e.data;
            $scope.ShowTab(e);
        })
    })

})