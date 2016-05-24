define(['core.view', 'evt.action', 'System/Acl/acl.service.js'],
function (core, actionEvent) {
    'use strict'

    core.controller('AclContainerCtrl', function ($scope, aclService) {
        var page = core($scope, aclService);

        $scope.$on(actionEvent.OnSearch, function ($s, e) {
            $scope.Info = e.data;
            $scope.ShowTab(e);
        })
    })

})