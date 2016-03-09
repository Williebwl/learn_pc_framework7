
define(['core.Service'],
    function (core) {
        'use strict'

        function groupService() {
            this.fnGetNav = function (key) {
                return this.get('Get', { params: { Key: key } })
            },
            this.fnGetAppAccess = function (appid) {
                return this.get('GetAppAccess/' + (appid || 0))
            },
            this.fnSaveAppAccess = function (groupid,data) {
                return this.put('SaveAppAccess/' + (groupid || 0), data)
            }
        }

        core.service('group', groupService, 'Institution.Group')
    });