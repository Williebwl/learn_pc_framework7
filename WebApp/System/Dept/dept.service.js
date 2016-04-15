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
            }
        }

        core.service('institution.Dept', institutionDeptService);
    })