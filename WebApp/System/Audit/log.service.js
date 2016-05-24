define(['core.Service'], function (core) {
    'use strict'

    function logService() {
        var $api = this;
        this.fnGetStatus = function () {
            return [
                { Value: undefined, Name: '全部' },
                { Value: 1, Name: '错误', Code: 'Error', Icon: 'fa fa-times-circle' },
                { Value: 2, Name: '警告', Code: 'Warning', Icon: 'fa fa-warning' },
                { Value: 3, Name: '消息', Code: 'Info', Icon: 'fa fa-info-circle' },
                { Value: 4, Name: '调试', Code: 'Debug', Icon: 'fa fa-lightbulb-o' }
            ]
        },
        this.fnGetPaged = function (data, config) {
            return $api.get('GetPaged', config ? (config.params = data, config) : { params: data })
        },
        this.fnGetLogger = function () {
            return $api.get('GetLogger');
        },
        this.fnGetLoggerName = function (name) {
            return {
                Local: "本地",
                DB: "远程"
            }[name];
        }
    }

    core.service('log', logService, 'audit.Log')
})