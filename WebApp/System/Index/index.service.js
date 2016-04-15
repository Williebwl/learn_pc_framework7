
define(['page'],
    function (app) {
        'use strict'

        app.service('indexService', function ($$http) {

            this.fnGetCurrentUserMenus = function () {
                return $$http.get('Tenant/Menu/GetRoot')
            },
            this.fnGetCurrentUser = function () {
                return $$http.get('Auth/Account/GetCurrentUser')
            }
        });
    });