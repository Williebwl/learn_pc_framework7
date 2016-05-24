define(['core.Service'], function (core) {
    'use strict'

    function groupService() {
        var $api = this;
        this.fnGetNav = function (key) {
            return $api.get('Get', { params: { Key: key } })
        },
        this.fnGetAppAccess = function (appid) {
            return $api.get('GetAppAccess/' + (appid || 0))
        },
        this.fnSaveAppAccess = function (groupid, data) {
            return $api.put('SaveAppAccess/' + (groupid || 0), data)
        },
        this.fnGetByUser = function (userid) {
            return $api.get('GetByUser/' + (userid || ''))
        },
        this.fnRemoveGroupUser = function (groupuserid) {
            return $api.get('RemoveGroupUser/' + (groupuserid || ''))
        },
        this.fnAssignGroupUser = function (groupid) {
            return $api.get('AssignGroupUser/' + (groupid || ''))
        }
        this.fnGrantGroupUser = function (groupid, data) {
            return $api.post('GrantGroupUser/' + (groupid || ''), data)
        }
        this.fnCancelUserGroup = function (userid, groupid) {
            return $api.put('CancelUserGroup/' + (groupid || 0), null, { params: { userId: userid } })
        },
        this.fnGetGroupCode = function (data) {
            return $api.get('GetGroupCode', { params: data })
        },
        this.fnGetGroupUser = function (data) {
            return $api.get('GetGroupUser', { params: data })
        }
    }

    core.service('group', groupService, 'Institution.Group')
});