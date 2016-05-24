define(['core.Service'], function (core) {
    'use strict'

    function menuService() {
        this.fnGetRoot = function () {
            return this.get('GetRoot')
        },
        //this.fnGetChildren = function (id, success, error) {
        //    return this.get('GetChildren/' + (id || 0), success, error)
        //},
        //this.fnGetChildrenAndSelf = function (id, success, error) {
        //    return this.get('GetChildrenAndSelf/' + id, success, error)
        //},
        //this.fnGetChildrenTree = function (id, success, error) {
        //    return this.get('GetChildrenTree/' + (id || 0), success, error)
        //},
        //this.fnGetChildrenAndSelfTree = function (id, success, error) {
        //    return this.get('GetChildrenAndSelfTree/' + (id || 0), success, error)
        //},
        this.fnGetInfoByAppId = function (id) {
            return this.get('GetInfoByAppId/' + (id || 0))
        },
        this.fnGetTreeByAppId = function (id) {
            return this.get('GetTreeByAppId/' + (id || 0))
        },
        this.fnGetWidgetModes = function () {
            return [//{ name: '默认', value: 1, url: '' },
                { name: '自定义', value: 1, NavUrl: '' },
                { name: '树形', value: 2, NavUrl: 'System/Nav/tree' },
                { name: '列表', value: 3, NavUrl: 'System/Nav/list' }]
        },
        this.fnGetMenuCode = function (data) {
            return this.get('GetMenuCode', { params: data })
        },
        this.fnGetExistsMenuName = function (data) {
            return this.get('GetExistsMenuName', { params: data })
        },
        this.fnGetMaxSequence = function () {
            return this.get('GetMaxSequence')
        }
    }

    core.service('menu', menuService, 'tenant/Menu')
});