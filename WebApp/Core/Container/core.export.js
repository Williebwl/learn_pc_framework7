/******************************************
********     数据导出核心组件      ********
*******************************************/
define('core.export', ['core.view'], function (page) {
    'use strict'

    function ExportPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new ExportPage().super(arguments);

        this.Type = 'core.export'
    }

    return page.ext(ExportPage)
})