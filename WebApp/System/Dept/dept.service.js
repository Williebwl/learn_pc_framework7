define(['core.Service'],
    function (core) {
        'use strict'

        function institutionDeptService() {
            this.fnGetSmartTree = function () {
                return this.get('GetSmartTree')
            },
            this.fnGetMaxSequence = function () {
                return this.get('GetMaxSequence')
            }
        }

        core.service('institution.Dept', institutionDeptService);
    })