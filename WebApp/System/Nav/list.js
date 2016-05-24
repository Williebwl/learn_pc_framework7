define(['core.nav', 'evt.page', 'System/Menu/menu.service.js'],
    function (core, pageEvent) {
        'use strict';

        core.controller('ListNavCtrl', function ($scope, menuService) {
            core($scope, menuService);

            var menu = $scope.module.Children[0];
            
            menu && $scope.fnSelect(menu.ID, menu.MenuName)
        })
    })