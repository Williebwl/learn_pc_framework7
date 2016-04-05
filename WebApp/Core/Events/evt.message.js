define('evt.message', function () {
    'use strict';
    return {
        //在显示通知消息时发生
        OnNotice: "$$notice",

        //在显示待办消息时发生
        OnTask: "$$msg"
    };
});