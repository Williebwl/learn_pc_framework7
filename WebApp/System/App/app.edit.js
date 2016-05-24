define(['core.edit', 'System/App/app.service.js', 'System/Tag/tag.service.js', 'System/Icon/icon.service.js'], function (core) {
    'use strict'

    core.controller('AppEditCtrl', function ($scope, appService, tagService, iconService) {
        //继承并返回页面对象
        var page = core($scope, appService), oldMenu;
        //加载所有应用图标
        //$scope.Icons = appService.fnGetIcons(),
        //加载所有显示模式
        $scope.DisplayModes = appService.fnGetDisplayModes(),
        //获取标签
        tagService.fnGetTagByTagClass('app_YYLX').success(function (d) {
            d.unshift({});
            $scope.AppTypes = d;
            $scope.AppType || ($scope.AppType = d[0]);
        }),
        //页面数据加载
        page.fnLoadPage = function (editInfo) {
            editInfo = editInfo || {},
            editInfo.DisplayMode = $scope.DisplayModes[0],
            editInfo.IsPopUp = !0,
            editInfo.IsToolbar = !1,
            //editInfo.icon = $scope.Icons[0] || {},
            appService.fnGetAppAccess(editInfo.ID).success(function (d) { $scope.GroupInfo = d }),
            editInfo.ID && appService.fnGetEditInfo(editInfo.ID).success(function (d) {
                (function (editInfo) {
                    page.extend(editInfo, d),
                    editInfo.App && $scope.AppTypes && ($scope.AppType = $scope.AppTypes.find(function (o) { return o.ID == editInfo.App.AppTypeID }) || $scope.AppTypes[0]),
                    (oldMenu = editInfo.Menu) && (editInfo.DisplayMode = $scope.DisplayModes.find(function (o) { return o.v == editInfo.Menu.DisplayModeID }),
                    //editInfo.Menu.Icon && (editInfo.icon = $scope.Icons.find(function (o) { return o.icon == editInfo.Menu.Icon && o.background == editInfo.Menu.IconBackGround })),
                    editInfo.IsToolbar = !!editInfo.Menu.ToolBarUrl)
                }(page.editInfo))
            })
            return editInfo
        },
        //对页面数据进行保存前处理
        page.fnSaveing = function () {
            var postInfo = this.PostInfo = core.extend({ App: {}, Menu: {} }, this.editInfo);
            if ($scope.AppType) {
                postInfo.App.AppTypeID = $scope.AppType.ID,
                postInfo.App.AppType = $scope.AppType.TagName
            }

            if (this.editInfo.DisplayMode) {
                postInfo.Menu.DisplayModeID = this.editInfo.DisplayMode.v,
                postInfo.Menu.DisplayMode = this.editInfo.DisplayMode.n
            }

            if ($scope.GroupInfo.AppGroups) postInfo.AppGroups = $scope.GroupInfo.AppGroups.select(function () { return { GroupID: this.ID } });

            if (postInfo.icon) {
                postInfo.Menu.Icon = postInfo.icon.icon,
                postInfo.Menu.IconBackGround = postInfo.icon.background
            }

            postInfo.Menu.IsPopUp = postInfo.Menu.DisplayModeID == 2 ? postInfo.IsPopUp : 0,
            postInfo.Menu.IsShow = 1
        },
        $scope.$watch('editInfo.DisplayMode', function (mode) {
            if ($scope.editInfo.ID) return;

            $scope.editInfo.Menu || ($scope.editInfo.Menu = {})

            switch (mode.v) {
                case 0:
                    $scope.editInfo.Menu.NavUrl = 'System/Nav/index';
                    $scope.editInfo.Menu.ContainerUrl = '.container';
                    break;
                case 1:
                    $scope.editInfo.Menu.NavUrl = '.nav';
                    $scope.editInfo.Menu.ContainerUrl = '.container';
                    break;
                case 2:
                    $scope.editInfo.Menu.NavUrl = 'System/Nav/iframe';
                    $scope.editInfo.Menu.ContainerUrl = 'System/Nav/iframe.container';
                    break;
            }

        });
    })

})