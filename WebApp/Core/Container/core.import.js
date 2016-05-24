/******************************************
********     数据导入核心组件      **********
*******************************************/
define('core.import', ['core.view'], function (page) {
    'use strict'

    function ImportPage($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new ImportPage().super(arguments);

        this.Type = 'core.import'
    }

    return page.ext(ImportPage)
})