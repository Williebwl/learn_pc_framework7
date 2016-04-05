
define(['page'],
    function (app) {
        'use strict'

        app.service('indexService', function ($$http) {

            this.fnGetCurrentUserMenus = function () {
                return $$http.get('Tenant/Menu/GetRoot')
            }
        });
    });