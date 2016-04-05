define('evt.attach', function () {
    'use strict';
    return {
        //在附件加载时发生
        OnLoad: "$$LoadAttach",

        //在附件保存时发生
        OnSave: "$$SaveAttach"
    };
});