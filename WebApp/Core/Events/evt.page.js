define('evt.page', function () {
    'use strict';
    return {
        //在页面初始化时发生
        OnInit: "$ShowViewStart",

        //在页面初始化完成时发生
        OnLoad: "$ShowViewSuccess",

        //在页面卸载时发生
        OnUnLoad: "$CloseViewStart",

        //在页面卸载完成时发生
        OnDisposed: "$CloseViewSuccess",


        //请求验证表单内容时发生
        OnFormValidate: "$VMValidate",

        //请求重置表单内容时发生
        OnFormReset: "$ViewRest",

        //在表单POST操作成功时发生
        OnFormPosted: "$PostSuccess",

        //在表单POST操作失败时发生
        OnFormPostFailed: "$PostError",

        //在表单PUT操作成功时发生
        OnFormPut: "$PutSuccess",

        //在表单PUT操作失败时发生
        OnFormPutFailed: "$PutError",

        //在表单提交操作成功时发生
        OnFormSubmited: "$EditSuccess",

        //在表单提交操作失败时发生
        OnFormSubmitFailed: "$EditError"
    };
});