define(['core.container', 'System/Dept/dept.service.js', 'System/Account/account.service.js'],
function (core) {
    'use strict'

    core.controller('DeptContainerCtrl',
        function ($scope, authAccountService, institutionDeptService) {
            var page = core($scope, authAccountService);

            page.GetSearchParams = function (pageConfig, params) {
                params && fnbindInfo($scope, params.data.Active, institutionDeptService),
                core.extend(this, { DeptID: params && params.data.Active.id })
            }


        })

    function fnbindInfo($scope, active, institutionDeptService) {
        institutionDeptService.fnGet(active.id)
                              .success(function (d) { $scope.Info = d })
                              .error(function () { $scope.Info = {} })
    }
})