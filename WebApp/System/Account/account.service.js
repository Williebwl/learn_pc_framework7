define(['core.Service'],
    function (core) {
        'use strict'

        function authAccountService() {
            this.fnGetAllStatus = function () {
                return this.get('GetAllStatus')
            },
            this.fnLogout = function (ids) {
                return this.put('Logout?ids=' + ids);
            }
        }

        core.service('auth/Account', authAccountService)
    })