define(['core.view', 'evt.action', 'System/App/app.service.js'],
function (core, actionEvent) {
    'use strict'

    core.controller('AppContainerCtrl', function ($scope, appService) {
        var page = core($scope, appService);

        $scope.$on(actionEvent.OnSearch, function (s, e) {
            $scope.Info = e.data;
            $scope.ShowTab(e);
        })
    })
})