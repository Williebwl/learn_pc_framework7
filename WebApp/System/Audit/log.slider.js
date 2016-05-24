define(['core.view', 'System/Audit/log.service.js'], function (core) {
    'use strict'

    core.controller('LogSliderCtrl', function ($scope, $q, logService) {
        var page = core($scope, logService);

        $scope.showDetail = false;

        $scope.fnGetLogLevel = function (i) {
            return logService.fnGetStatus()[i];
        }
        $scope.getDetail = function (str) {
            if (!str)
                return str;
            var result = '';
            str.split(/\r\n/).some(function (item, index) {
                if (item.indexOf('位置') > 0 || $scope.showDetail) {
                    result += (index > 0 ? '\r\n\r\n' : '') + item;
                    return false;
                }
                else
                    return true;
            });
            return result;
        }
        $scope.isEmptyObject = function (obj) {
            return $.isEmptyObject(obj);
        }
    })

})