
define(['page', 'preloader', 'lobibox', 'evt.message', 'evt.route', 'System/Index/index.service.js'],
    function (app, preloader, lobibox, messageEvent, routeEvent) {
        'use strict';

        function indexCtrl($scope, indexService, $timeout) {
            $scope.Menus = [];
            var pop = preloader.show();
            indexService.fnGetCurrentUserMenus().success(function (d) {
                $scope.Menus = d,
                pop.hide()
            });

            $scope.$on(routeEvent.OnRouteChanged, function (e, arg) {
                $scope.PageRoute = arg.$$route && arg.$$route.Route
            });
        }

        app.controller('indexCtrl', indexCtrl)


        function userAreaCtrl($scope, indexService, $$http) {
            indexService.fnGetCurrentUser().success(function (d) {
                $scope.UserName = d.UserName
            }),
            $scope.fnLogout = $$http.fnLogout
        }

        app.controller('userAreaCtrl', userAreaCtrl)



        var mode = ["info", "warning", "error", "success"];

        app.run(function ($rootScope, $animate) {
            function $editNotice(e, d) {
                lobibox.notify(mode[d.mode] || 'info', (d.position = 'top center', d));
            }

            $rootScope.$on(messageEvent.OnNotice, $editNotice);

            function $message(e, d) {
                lobibox.notify(mode[d.mode] || 'info', d);
            }

            $rootScope.$on(messageEvent.OnTask, $message);
        });

        return app;
    });