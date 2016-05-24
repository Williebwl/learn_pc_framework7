define(['core.Service'], function (core) {
    'use strict'

    function aclService() {
        var $api = this;
        this.fnGetOperationCode = function (data) {
            return $api.get('GetOperationCode', { params: data })
        }
    }

    core.service('acl', aclService, 'Permission.Operation');


    function strategyService() {
        var $api = this;
        this.fnGetStrategyCode = function (data) {
            return $api.get('GetStrategyCode', { params: data })
        },
        this.fnSaveGroupAccess = function (id, data, config) {
            return $api.put('SaveGroupAccess' + (id ? '/' + id : ''), data, config)
        }
    }

    core.service('strategy', strategyService, 'Permission.Strategy');


    function filterService() {
        var $api = this;
        this.fnGetFilterCode = function (data) {
            return $api.get('GetFilterCode', { params: data })
        },
        this.fnGetFilterOperations = function () {
            return [
                { Description: "等于", Value: "=" },
                { Description: "不等于", Value: "!=" },
                { Description: "大于", Value: ">" },
                { Description: "大于等于", Value: ">=" },
                { Description: "小于", Value: "<" },
                { Description: "小于等于", Value: "<=" },
                { Description: "包含", Value: "like" },
                { Description: "不包含", Value: "not like" }
            ];
        },
        this.fnGetLogicOperations = function () {
            return [
                { Description: "并且", Value: "and" },
                { Description: "或者", Value: "or" }
            ];
        },        
        this.fnSaveGroupAccess = function (id, data, config) {
            return $api.put('SaveGroupAccess' + (id ? '/' + id : ''), data, config)
        }
    }

    core.service('filter', filterService, 'Permission.Filter');
})