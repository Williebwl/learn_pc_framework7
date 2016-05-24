define(['core.container', 'evt.page', 'System/Tag/tag.service.js'], function (core, pageEvent) {
    'use strict'

    core.controller('TagContainerDictCtrl', function ($scope, tagClassService) {
        var page = core($scope, tagClassService), app = {};

        page.fnGetSearchParams = function (pageConfig, params) {
            core.extend(this, { AppID: app.ID, DisplayLevel: 3 });
        };

        page.fnSetViewInfo = function (e) {
            $scope.Info = e.data;
        }

        $scope.ShowView(function (e) {
            $scope.app = app = e.data;
            page.fnSearch(e);
        });

        $scope.$on(pageEvent.OnFormSubmited, function () {
            $scope.fnSearch();
        })
    })
})