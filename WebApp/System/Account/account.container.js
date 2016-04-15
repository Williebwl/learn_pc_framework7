define(['core.container', 'evt.page', 'System/Account/account.service.js'],
    function (core, pageEvent) {
    'use strict'

    function Controller($scope, authAccountService) {
        var page = core($scope, authAccountService, $scope), type;
        $scope.CheckConf = {};

        page.fnGetSearchParams = function (pageConfig, params) {
            params["core.nav"] && core.extend(this, { Status: $scope.isValid = type = params && params["core.nav"].Value });
            params["core.toolbar"] && core.extend(this, params["core.toolbar"]);
        },
        $scope.fnLogout = function () {
            type ?
            $scope.fnBulkAction('注销', authAccountService.fnLogout) :
            $scope.fnBulkAction('启用', authAccountService.fnSetEnable);
        },
        $scope.fnUnlock = function (user) {
            $scope.fnConfirmAction('解锁', authAccountService.fnUnlock, [user.Account.ID]);
        },
        $scope.$on(pageEvent.OnFormPut, page.fnSearch)
    }

    core.controller('AccountContainerCtrl', Controller);
})