define('evt.route', function () {
    'use strict';
    return {
        //在工具条加载完毕时发生
        OnToolBarLoaded: "$ToolBarContentLoaded",

        //在导航栏加载完毕时发生
        OnNavLoaded: "$NavContentLoaded",
        
        //在容器页加载完毕时发生
        OnContainerLoaded: "$ContainerContentLoaded",

        //在内容页加载完毕时发生
        OnContentLoaded: "$ContentLoaded",

        //在路由规则加载时发生
        OnRouteChange: "$routeChange",

        //在路由规则加载完毕时发生
        OnRouteChanged: "$routeChangeSuccess"
    };
});