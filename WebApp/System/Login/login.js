
define(['page', 'Login/login.service'],
	function (app) {
	    'use strict';

	    app.controller('LoginCtrl', ['LoginService', function (loginService) {
	        var $scope = this, uid = loginForm.uid, pwd = loginForm.pwd;
	        this.fnLogin = function (isValid) {
	            if (this.error = !isValid) return;

	            loginService.fnLogin({ LoginName: this.UID, Password: this.PWD })
                            .success(function (token) {
                                if (token) {
                                   ($scope.RememberPWD ? window.localStorage : window.sessionStorage).Token = token,
                                   location.href = window.sessionStorage.referrer !== location.href && window.sessionStorage.referrer || 'index.html'
                                }
                            })
                            .error(function (a, b) { $scope.errMsg = b === -1 ? '请检查WebApi是否可以访问！' : a.Message });
	        }

	    }]);
	});