define('evt.user', function () {
    'use strict';
    return {
        //在当前用户信息变更时发生
        OnChanged: "$$RefreshCurrentUser"
    };
});