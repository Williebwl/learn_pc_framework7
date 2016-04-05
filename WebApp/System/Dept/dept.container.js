define(['core.container', 'System/Dept/dept.service.js', 'System/Account/account.service.js'],
function (core) {
    'use strict'

    core.controller('DeptContainerCtrl',
        function ($scope, authAccountService, institutionDeptService) {
            var page = core($scope, authAccountService);

            page.fnGetSearchParams = function (pageConfig, params) {
                params && fnbindInfo($scope, params["core.nav"].Active, institutionDeptService),
                core.extend(this, { DeptID: params && params["core.nav"].Active.id || 0 })
            }
        })

    function fnbindInfo($scope, active, institutionDeptService) {
        institutionDeptService.fnGet(active && active.id || 0)
                              .success(function (d) { $scope.Info = d })
                              .error(function () { $scope.Info = {} })
    }
})