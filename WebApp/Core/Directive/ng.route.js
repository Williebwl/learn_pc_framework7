define(['page', 'evt.route'],
    function (app, routeEvent) {
        'use strict';

        /************************************************ 导航区域 开始 ***************************************************/

        app.directive('biNav', biNavFactory)
           .directive('biNav', biNavFillContentFactory);

        biNavFactory.$inject = ['$route', '$anchorScroll', '$animate'];
        function biNavFactory($route, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                controller: angular.noop,
                link: function (scope, $element, attr, ctrl, $transclude) {
                    var currentScope,
                        currentElement,
                        previousLeaveAnimation,
                        autoScrollExp = attr.autoscroll,
                        onloadExp = attr.onload || '';

                    scope.$on(routeEvent.OnRouteChanged, update);
                    update();

                    function cleanupLastView() {
                        if (previousLeaveAnimation) {
                            $animate.cancel(previousLeaveAnimation);
                            previousLeaveAnimation = null;
                        }

                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            previousLeaveAnimation = $animate.leave(currentElement);
                            previousLeaveAnimation.then(function () {
                                previousLeaveAnimation = null;
                            });
                            currentElement = null;
                        }
                    }

                    function update() {
                        var locals = $route.current && $route.current.locals,
                            template = locals && locals.$navTemplate,
                            $$route = $route.current && $route.current.$$route,
                            PRoute = $$route && $$route.PRoute,
                            templateUrl = $$route && $$route.navTemplateUrl;

                        if (PRoute && (PRoute === ctrl.lastPRoute || PRoute === ctrl.lastRoute) && templateUrl === ctrl.lastTemplateUrl) return;

                        ctrl.lastRoute = $$route && $$route.Route;
                        ctrl.lastPRoute = PRoute;
                        ctrl.lastTemplateUrl = templateUrl;

                        if (angular.isDefined(template)) {
                            var newScope = scope.$new();
                            var current = $route.current;

                            var clone = $transclude(newScope, function (clone) {
                                $animate.enter(clone, null, currentElement || $element).then(function onbiNavEnter() {
                                    if (angular.isDefined(autoScrollExp)
                                      && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                });
                                cleanupLastView();
                            });

                            currentElement = clone;
                            scope.$navScope = currentScope = current.scope = newScope;
                            currentScope.$emit(routeEvent.OnNavLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$emit(routeEvent.OnContentLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$eval(onloadExp);
                        } else if (!$route.hasOwnProperty('current') || $route.current.hasOwnProperty('loadedNavTemplateUrl')) {
                            cleanupLastView();
                        }
                    }
                }
            };
        }

        biNavFillContentFactory.$inject = ['$compile', '$controller', '$route'];
        function biNavFillContentFactory($compile, $controller, $route) {
            return {
                restrict: 'ECA',
                priority: -400,
                link: function (scope, $element) {
                    var current = $route.current,
                        locals = current.locals;

                    $element.html(locals.$navTemplate);

                    var link = $compile($element.contents());

                    if (current.navCtrl) {
                        locals.$scope = scope;
                        var controller = $controller(current.navCtrl, locals);
                        if (current.controllerAs) {
                            scope[current.controllerAs] = controller;
                        }
                        $element.data('$ngControllerController', controller);
                        $element.children().data('$ngControllerController', controller);
                    }
                    scope[current.resolveAs || '$resolve'] = locals;

                    link(scope);
                }
            };
        }

        /************************************************ 导航区域 结束 ***************************************************/

        /************************************************ 工具条 开始 ***************************************************/

        app.directive('biToolBar', biToolBarFactory)
           .directive('biToolBar', biToolBarFillContentFactory);

        biToolBarFactory.$inject = ['$route', '$anchorScroll', '$animate'];
        function biToolBarFactory($route, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                controller: angular.noop,
                link: function (scope, $element, attr, ctrl, $transclude) {
                    var currentScope,
                        currentElement,
                        previousLeaveAnimation,
                        autoScrollExp = attr.autoscroll,
                        onloadExp = attr.onload || '';

                    scope.$on(routeEvent.OnRouteChanged, update);
                    update();

                    function cleanupLastView() {
                        if (previousLeaveAnimation) {
                            $animate.cancel(previousLeaveAnimation);
                            previousLeaveAnimation = null;
                        }

                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            previousLeaveAnimation = $animate.leave(currentElement);
                            previousLeaveAnimation.then(function () {
                                previousLeaveAnimation = null;
                            });
                            currentElement = null;
                        }
                    }

                    function update() {
                        var locals = $route.current && $route.current.locals,
                            template = locals && locals.$toolBarTemplate,
                            $$route = $route.current && $route.current.$$route,
                            PRoute = $$route && $$route.PRoute,
                            templateUrl = $$route && $$route.toolBarTemplateUrl;

                        if (PRoute && (PRoute === ctrl.lastPRoute || PRoute === ctrl.lastRoute) && templateUrl === ctrl.lastTemplateUrl) return;

                        ctrl.lastRoute = $$route && $$route.Route;
                        ctrl.lastPRoute = PRoute;
                        ctrl.lastTemplateUrl = templateUrl;

                        if (angular.isDefined(template)) {
                            var newScope = scope.$new();
                            var current = $route.current;

                            var clone = $transclude(newScope, function (clone) {
                                $animate.enter(clone, null, currentElement || $element).then(function onbiToolBarEnter() {
                                    if (angular.isDefined(autoScrollExp)
                                      && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                });
                                cleanupLastView();
                            });

                            currentElement = clone;
                            scope.$toolBarScope = currentScope = current.scope = newScope;
                            currentScope.$emit(routeEvent.OnToolBarLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$emit(routeEvent.OnContentLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$eval(onloadExp);
                        } else if (!$route.hasOwnProperty('current') || $route.current.hasOwnProperty('loadedToolBarTemplateUrl')) {
                            cleanupLastView();
                        }
                    }
                }
            };
        }

        biToolBarFillContentFactory.$inject = ['$compile', '$controller', '$route'];
        function biToolBarFillContentFactory($compile, $controller, $route) {
            return {
                restrict: 'ECA',
                priority: -400,
                link: function (scope, $element) {
                    var current = $route.current,
                        locals = current.locals;

                    $element.html(locals.$toolBarTemplate);

                    var link = $compile($element.contents());

                    if (current.toolBarCtrl) {
                        locals.$scope = scope;
                        var controller = $controller(current.toolBarCtrl, locals);
                        if (current.controllerAs) {
                            scope[current.controllerAs] = controller;
                        }
                        $element.data('$ngControllerController', controller);
                        $element.children().data('$ngControllerController', controller);
                    }
                    scope[current.resolveAs || '$resolve'] = locals;

                    link(scope);
                }
            };
        }

        /************************************************ 工具条 结束 ***************************************************/

        /************************************************ 内容 开始 ***************************************************/

        app.directive('biContainer', biContainerFactory)
           .directive('biContainer', biContainerFillContentFactory);

        biContainerFactory.$inject = ['$route', '$anchorScroll', '$animate'];
        function biContainerFactory($route, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                terminal: true,
                priority: 400,
                transclude: 'element',
                controller: angular.noop,
                link: function (scope, $element, attr, ctrl, $transclude) {
                    var currentScope,
                        currentElement,
                        previousLeaveAnimation,
                        autoScrollExp = attr.autoscroll,
                        onloadExp = attr.onload || '';

                    scope.$on(routeEvent.OnRouteChanged, update);
                    update();

                    function cleanupLastView() {
                        if (previousLeaveAnimation) {
                            $animate.cancel(previousLeaveAnimation);
                            previousLeaveAnimation = null;
                        }

                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            previousLeaveAnimation = $animate.leave(currentElement);
                            previousLeaveAnimation.then(function () {
                                previousLeaveAnimation = null;
                            });
                            currentElement = null;
                        }
                    }

                    function update() {
                        var locals = $route.current && $route.current.locals,
                            template = locals && locals.$containerTemplate,
                            $$route = $route.current && $route.current.$$route,
                            PRoute = $$route && $$route.PRoute,
                            templateUrl = $$route && $$route.containerTemplateUrl;

                        if (PRoute && (PRoute === ctrl.lastPRoute || PRoute === ctrl.lastRoute) && templateUrl === ctrl.lastTemplateUrl) return;

                        ctrl.lastRoute = $$route && $$route.Route;
                        ctrl.lastPRoute = PRoute;
                        ctrl.lastTemplateUrl = templateUrl;


                        if (angular.isDefined(template)) {
                            var newScope = scope.$new();
                            var current = $route.current;

                            var clone = $transclude(newScope, function (clone) {
                                $animate.enter(clone, null, currentElement || $element).then(function onbiContainerEnter() {
                                    if (angular.isDefined(autoScrollExp)
                                      && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                });
                                cleanupLastView();
                            });

                            currentElement = clone;
                            scope.$containerScope = currentScope = current.scope = newScope;
                            currentScope.$emit(routeEvent.OnContainerLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$emit(routeEvent.OnContentLoaded, { $element: currentElement, scope: currentScope });
                            currentScope.$eval(onloadExp);
                        } else if (!$route.hasOwnProperty('current') || $route.current.hasOwnProperty('loadedContainerTemplateUrl')) {
                            cleanupLastView();
                        }
                    }
                }
            };
        }

        biContainerFillContentFactory.$inject = ['$compile', '$controller', '$route'];
        function biContainerFillContentFactory($compile, $controller, $route) {
            return {
                restrict: 'ECA',
                priority: -400,
                link: function (scope, $element) {
                    var current = $route.current,
                        locals = current.locals;

                    current.$$route && current.$$route.IsApp && $element.closest('#content').removeAttr('style')

                    $element.html(locals.$containerTemplate);

                    var link = $compile($element.contents());

                    if (current.containerCtrl) {
                        locals.$scope = scope;
                        var controller = $controller(current.containerCtrl, locals);
                        if (current.controllerAs) {
                            scope[current.controllerAs] = controller;
                        }
                        $element.data('$ngControllerController', controller);
                        $element.children().data('$ngControllerController', controller);
                    }
                    scope[current.resolveAs || '$resolve'] = locals;

                    link(scope);
                }
            };
        }

        /************************************************ 内容 结束 ***************************************************/
    })