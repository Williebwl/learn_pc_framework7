define('evt.action', function () {
    'use strict';
    return {
        //请求执行添加操作时发生
        OnAdd: "$$Add",

        //请求执行修改操作时发生
        OnUpdate: "$$Update",

        //请求执行删除操作时发生
        OnDelete: "$$Delete",

        //请求执行搜索操作时发生
        OnSearch: "$$RefreshSearch",


        //在任意操作导致页面元素更时发生
        OnChanged: "$$ActiveChange"
    };
});