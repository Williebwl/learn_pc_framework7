define(['core.Service'],
    function (core) {
        'use strict'

        function PositionService() {
            var $api = this;
            this.fnGetPaged = function (data, config) {
                return $api.get('GetPaged', config ? (config.params = data, config) : { params: data })
            },
            this.fnGetSmartTree = function () {
                return $api.get('GetSmartTree')
            },
            this.fnGetMaxSequence = function () {
                return $api.get('GetMaxSequence')
            },
            this.fnDisable = function (ids) {
                return $api.put('Disable/' + (ids || ''))
            },
            this.fnEnable = function (ids) {
                return $api.put('Enable/' + (ids || ''))
            },
            this.fnGetPositionCode = function (data) {
                return $api.get('GetPositionCode', { params: data })
            }
        }

        core.service('position', PositionService, 'institution.Position');
    })