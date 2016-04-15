define('evt.action', function () {
    'use strict';
    return {
        //点击添加按钮时发生
        OnAdd: "$$Add",

        //点击修改按钮时发生
        OnUpdate: "$$Update",

        //点击删除按钮时发生
        OnDelete: "$$Delete",

        //点击搜索按钮时发生
        OnSearch: "$$RefreshSearch",

        //点击选中按钮时发生（内部事件）
        OnSelect: "$$ActiveChange"
    };
});