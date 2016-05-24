define(['core.container', 'evt.page', 'System/Audit/log.service.js'], function (core, pageEvent) {
    'use strict'

    function Controller($scope, logService) {
        var page = core($scope, logService), entityModule;

        $scope.CheckConf = {};

        page.fnGetSearchParams = function (pageConfig, params) {
            params["core.nav"] && core.extend(this, { EntityModule: $scope.entityModule = entityModule = params && params["core.nav"].AppCode });
            params["core.toolbar"] && core.extend(this, params["core.toolbar"]);
        }
        $scope.fnGetLogLevel = function (i) {
            return logService.fnGetStatus()[i];
        }
        $scope.$on(pageEvent.OnFormDeleted, page.fnSearch);
        $scope.$on(pageEvent.OnFormPut, page.fnSearch);
    }

    core.controller('LogContainerCtrl', Controller);
})