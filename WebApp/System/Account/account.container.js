define(['core.container', 'System/Account/account.service.js'],
function (core) {
    'use strict'

    core.controller('AccountContainerCtrl',
        function ($scope, authAccountService) {
            var page = core($scope, authAccountService);

            page.GetSearchParams = function (pageConfig, params) {
                core.extend(this, { Status: params && params.data.Active.Value })
            },
            $scope.CheckConf = {},
            $scope.fnLogout = function () {
                if (!$scope.CheckConf.ids.length) {
                    page.alert('请选择需要注销的通行证！')
                    return
                }

                page.confirm('确定要注销选择的通行证？',
                    function (e) {
                        if (e.s) {
                            authAccountService.fnLogout($scope.CheckConf.ids.select(function () { return this.key; }).join(','))
                                              .success(function (d) {
                                                  if (!d) page.alert('通行证注销失败！')
                                                  else {
                                                      $scope.CheckConf.ids.forEach(function (o) { o.info.IsValid = !1 })
                                                  }
                                              })
                                              .error(function () { page.alert('通行证注销失败！') })
                        }
                    })
            }
        })
})