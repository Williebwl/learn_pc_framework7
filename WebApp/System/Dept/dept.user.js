define(['core.container', 'System/Account/account.service.js'],
    function (core) {
        'use strict';

        core.controller('DeptUserTabCtrl',
            function ($scope, authAccountService) {
                var page = core($scope, authAccountService), dept;

                page.fnGetSearchParams = function (pageConfig, params) {
                    core.extend(this, params && params['core.container'])
                }

                $scope.ShowView(function (e) {
                    dept = e.data,
                    page.fnSearch({ DeptID: e.data && e.data.ID })
                });

                $scope.fnRelateduser = function () {
                    $scope.ShowDialog('relatedUser', dept)
                }
            })
    })