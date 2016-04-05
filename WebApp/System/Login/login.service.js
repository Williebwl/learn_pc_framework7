
define(['page'],
    function (app) {
        'use strict'

        app.service('LoginService', function ($$http) { this.fnLogin = function (d) { return $$http.post('Auth/Login/Login', d) } });
    });