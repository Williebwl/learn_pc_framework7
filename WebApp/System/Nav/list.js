define(['core.nav', 'evt.page', 'System/Menu/menu.service.js'],
function (core, pageEvent) {
    'use strict';
    return core.controller('ListNavCtrl', function ($scope, menuService) {
        var page = core($scope, menuService);
        //moduleService.fnGetChildren($scope.$parent.$parent.module && $scope.$parent.$parent.module.ID || 0,
        //    function (d) {
        //        $scope.Modules = d || []
        //    }, function () {
        //        $scope.Modules = []
        //    })
        $scope.$on(pageEvent.OnFormPosted, $scope.fnSelected);
    })
})