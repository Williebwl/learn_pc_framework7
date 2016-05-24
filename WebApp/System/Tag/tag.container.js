define(['core.view', 'evt.action', 'evt.page', 'System/App/app.service.js'],
function (core, actionEvent, pageEvent) {
    'use strict'

    core.controller('TagContainerCtrl', function ($scope, appService) {
        var page = core($scope, appService), lastKey;

        $scope.$on(pageEvent.OnInit, function ($s, key) {
            lastKey = key;
        });

        $scope.$on(actionEvent.OnSearch, function (s, e) {
            $scope.Info = e.data;
            $scope.ShowTab(e);
        })
    })
})