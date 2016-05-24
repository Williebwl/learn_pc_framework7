define(['core.Service'], function (core) {
    'use strict'

    function authAccountService() {
        var $api = this;
        this.fnGetStatus = function () {
            return [{ Value: 1, Name: '有效的用户' }, { Value: 0, Name: '已注销的用户' }]
        },
        this.fnLogout = function (ids) {
            return $api.put('Logout?ids=' + ids)
        },
        this.fnPost = function (data) {
            return $api.post('PostAccount', data)
        },
        this.fnPut = function (id, data) {
            return $api.put('PutAccount/' + id, data)
        },
        this.fnGetLoginName = function (data) {
            return $api.get('GetLoginName', { params: data })
        },
        this.fnGetEdit = function (id) {
            return $api.get('GetEdit/' + (id || ''))
        },
        this.fnGetPaged = function (data, config) {
            return $api.get('GetPaged', config ? (config.params = data, config) : { params: data })
        },
        this.fnSetEnable = function (ids) {
            return $api.put('SetEnable?ids=' + ids)
        },
        this.fnUnlock = function (ids) {
            return $api.put('Unlock?ids=' + ids)
        },
        this.fnGetDeptUser = function (q) {
            return $api.get('GetDeptUser', { params: q })
        },
        this.fnGetDeptUserPaged = function (q) {
            return $api.get('GetDeptUserPaged', { params: q })
        }
    }

    core.service('auth/Account', authAccountService)
})