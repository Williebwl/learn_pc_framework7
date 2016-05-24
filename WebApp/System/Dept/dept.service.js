define(['core.Service'],
    function (core) {
        'use strict'

        function institutionDeptService() {
            var api = this;
            this.fnGetSmartTree = function () {
                return api.get('GetSmartTree')
            },
            this.fnGetMaxSequence = function () {
                return api.get('GetMaxSequence')
            },
            this.fnGetDeptCode = function (data) {
                return api.get('GetDeptCode', { params: data })
            },
            this.fnGetExistsDeptName = function (data) {
                return this.get('GetExistsDeptName', { params: data })
            },
            this.fnSavePositionUser = function (data) {
                return this.post('SavePositionUser', data);
            },
            this.fnDisablePositionUser = function (id) {
                return this.put('DisablePositionUser/' + (id || 0))
            },
            this.fnEnablePositionUser = function (id) {
                return this.put('EnablePositionUser/' + (id || 0))
            }
        }

        core.service('institution.Dept', institutionDeptService);
    })