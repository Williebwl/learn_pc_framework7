define(['core.nav', 'evt.page', 'System/Menu/menu.service.js'],
function (core, pageEvent) {
    'use strict';
    return core.controller('ListNavCtrl', function ($scope, menuService) {
        var page = core($scope, menuService);
    })
})