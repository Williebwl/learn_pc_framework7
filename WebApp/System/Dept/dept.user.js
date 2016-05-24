define(['core.container', 'evt.page', 'System/Account/account.service.js'],
    function (core, pageEvent) {
        'use strict';

        core.controller('DeptUserTabCtrl',
            function ($scope, authAccountService) {
                var page = core($scope, authAccountService), dept;
                page.$service.fnGetPaged = page.$service.fnGetDeptUserPaged,
                page.fnGetSearchParams = function (pageConfig, params) {
                    core.extend(this, params && params['core.container'])
                }

                $scope.ShowView(function (e) {
                    dept = e && e.data,
                    page.fnSearch({ DeptID: e && e.data && e.data.ID || 0 })
                });

                $scope.fnRelateduser = function () {
                    $scope.ShowDialog('relatedUser', dept)
                }

                $scope.$on(pageEvent.OnFormSubmited, page.fnSearch)
            })
    })