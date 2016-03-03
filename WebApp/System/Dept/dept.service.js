define(['core.Service'],
    function (core) {
        'use strict'

        function institutionDeptService() {
            this.fnGetSmartTree = function () {
                return this.get('GetSmartTree')
            }
        }

        core.service('institution.Dept', institutionDeptService);
    })