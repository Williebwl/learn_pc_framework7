define('evt.action', function () {
    'use strict';
    return {
        //点击搜索按钮时发生
        OnSearch: "$$RefreshSearch",

        //点击选中按钮时发生（内部事件）
        OnSelect: "$$ActiveChange"
    };
});