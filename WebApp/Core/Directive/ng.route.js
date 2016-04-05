define(['page', 'evt.route'], function (app, routeEvent) {
    'use strict'


    biNavFactory.$inject = ['$route', '$anchorScroll', '$animate'];
    function biNavFactory($route, $anchorScroll, $animate) {
        return {
            restrict: 'ECA',
            terminal: true,
            priority: 400,
            transclude: 'element',
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
                        template = locals && locals.$navTemplate;

                    if (angular.isDefined(template) || locals) {
                        var newScope = scope.$new();
                        var current = $route.current;

                        var clone = $transclude(newScope, function (clone) {
                            $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                                if (angular.isDefined(autoScrollExp)
                                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                    $anchorScroll();
                                }
                            });
                            cleanupLastView();
                        });

                        currentElement = clone;
                        currentScope = current.scope = newScope;
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

                $element.html(locals.$navTemplate)

                var link = $compile($element.contents());

                if (current.navController) {
                    locals.$scope = scope;
                    var controller = $controller(current.navController, locals);
                    if (current.controllerAs) {
                        scope[current.controllerAs] = controller;
                    }
                    $element.data('$ngControllerController', controller);
                    $element.children().data('$ngControllerController', controller);
                }

                link(scope);
            }
        };
    }

    app.directive('biNav', biNavFactory).directive('biNav', biNavFillContentFactory);

    biToolBarFactory.$inject = ['$route', '$anchorScroll', '$animate'];
    function biToolBarFactory($route, $anchorScroll, $animate) {
        return {
            restrict: 'ECA',
            terminal: true,
            priority: 400,
            transclude: 'element',
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
                        template = locals && locals.$toolBarTemplate;

                    if (angular.isDefined(template)) {
                        var newScope = scope.$new();
                        var current = $route.current;

                        var clone = $transclude(newScope, function (clone) {
                            $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                                if (angular.isDefined(autoScrollExp)
                                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                    $anchorScroll();
                                }
                            });
                            cleanupLastView();
                        });

                        currentElement = clone;
                        currentScope = current.scope = newScope;
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

                if (current.toolBarController) {
                    locals.$scope = scope;
                    var controller = $controller(current.toolBarController, locals);
                    if (current.controllerAs) {
                        scope[current.controllerAs] = controller;
                    }
                    $element.data('$ngControllerController', controller);
                    $element.children().data('$ngControllerController', controller);
                }

                locals.$navTemplate && $element.closest('#content').removeAttr('style')

                link(scope);
            }
        };
    }

    app.directive('biToolbar', biToolBarFactory).directive('biToolbar', biToolBarFillContentFactory);

    biContainerFactory.$inject = ['$route', '$anchorScroll', '$animate'];
    function biContainerFactory($route, $anchorScroll, $animate) {
        return {
            restrict: 'ECA',
            terminal: true,
            priority: 400,
            transclude: 'element',
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
                        template = locals && locals.$containerTemplate;

                    if (angular.isDefined(template)) {
                        var newScope = scope.$new();
                        var current = $route.current;

                        var clone = $transclude(newScope, function (clone) {
                            $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                                if (angular.isDefined(autoScrollExp)
                                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                    $anchorScroll();
                                }
                            });
                            cleanupLastView();
                        });

                        currentElement = clone;
                        currentScope = current.scope = newScope;
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

                $element.html(locals.$containerTemplate);

                var link = $compile($element.contents());

                if (current.containerController) {
                    locals.$scope = scope;
                    var controller = $controller(current.containerController, locals);
                    if (current.controllerAs) {
                        scope[current.controllerAs] = controller;
                    }
                    $element.data('$ngControllerController', controller);
                    $element.children().data('$ngControllerController', controller);
                }

                locals.$navTemplate && $element.closest('#content').removeAttr('style')

                link(scope);
            }
        };
    }

    app.directive('biContainer', biContainerFactory).directive('biContainer', biContainerFillContentFactory)
})