define(['core.Service'],
    function (core) {
        'use strict'

        function appService() {
            var $api = this;
            this.fnGet = function (id) {
                return $api.get('Get/' + id);
            },
           this.fnGetAll = function (data) {
               return $api.get('GetAll', { params: data });
           },
           this.fnSetStatus = function (id, status) {
               return $api.put('SetStatus/' + id + '?status=' + status)
           },
           this.fnGetAppAccess = function (id) {
               return $api.get('GetAppAccess/' + (id || 0))
           },
           this.fnGetIcons = function () {
               return [{ name: '任务', icon: 'fa fa-paper-plane', background: 'background-a' },
                       { name: '审批', icon: 'fa fa-users', background: 'background-b' },
                       { name: '通讯录', icon: 'fa fa-users', background: 'background-c' },
                       { name: '文件', icon: 'fa fa-users', background: 'background-h' },
                       { name: '日程', icon: 'fa fa-users', background: 'background-l' },
                       { name: '项目', icon: 'fa fa-users', background: 'background-p' },
                       { name: '日报', icon: 'fa fa-users', background: 'background-x' },
                       { name: '报表', icon: 'fa fa-users', background: 'background-d' }]
           },
           this.fnGetDisplayModes = function () {
               return [
                   { v: 0, n: '默认' },
                   { v: 1, n: '自定义' },
                   { v: 2, n: '链接' }
               ];
           },
           this.fnGetEditInfo = function (id) {
               return $api.get('GetEditInfo/' + id)
           },
           this.fnGetByUser = function (userid) {
               return $api.get('GetByUser/' + (userid || ''))
           },
           this.fnCancelUserApp = function (userid, appid) {
               return $api.put('CancelUserApp/' + (appid || 0), null, { params: { userId: userid } })
           },
           this.fnGetAppConfig = function (appCode) {
               return $api.get('GetAppConfig?appCode=' + appCode)
           },
           this.fnSetAppConfig = function (data) {
               return $api.put('SetAppConfig', data);
           }
        }

        core.service('app', appService, 'tenant.AppMgr')
    })