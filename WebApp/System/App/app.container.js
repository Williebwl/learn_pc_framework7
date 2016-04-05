define(['core.view', 'System/App/app.service.js'],
function (core) {
    'use strict'

    core.controller('AppContainerCtrl', function ($scope, appService) {
        var page = core($scope, appService);
        //page.fnSearch = function () {
        //    //$scope.View = { NavName: this.data.NavName };
        //    $scope.Info = this.data.Active,
        //    $scope.ShowDialog2(lastId, last = this.data.Active)
        //}

        var lastId = '', last;
        $scope.ShowDialog2 = function (id, info) {
            lastId = id;
            $('.tab-content>div', $scope.$element).hide();
            $scope.ShowDialog(id, info || last);
        }
        //$scope.ShowDialog2('params');
    })
})