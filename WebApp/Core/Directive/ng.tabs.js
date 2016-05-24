define(['page', 'evt.page', 'evt.action'],
    function (app, pageEvent, actionEvent) {
        'use strict';

        var isFn = angular.isFunction;

        var tabsDirective = ['$q', '$timeout', function ($q, $timeout) {

            var tabsController = ['$scope', function ($scope) {
                this.tabs = {}, this.index = 0,

                this.fnLoadTab = function (tab) {
                    this.lastTab = this.currentTab,
                    this.currentTab = tab,
                    tab.loaded ? this.fnShowTab() : tab.fnload();
                }.bind(this),

                this.fnShowTab = function (tab, arg) {
                    if (!(tab = tab || this.currentTab)) return;
                    tab.Scope && (tab.Scope.isDisplay = this.oldArg !== this.arg),
                    $q.all(fnApplyQueue(tab.showQueue, arg || this.arg || [])).then(fnShowTab.bind(tab, this)),
                    this.fnHideTab()
                }.bind(this),

                this.fnHideTab = function (tab, arg) {
                    if (!(tab = tab || this.lastTab)) return;
                    $q.all(fnApplyQueue(tab.closeQueue, arg || this.arg || [])).then(fnHideTab.bind(tab, this))
                }.bind(this),

                this.fnInit = fnInit.bind(this)
            }], number = 0;

            return {
                restrict: 'AE',
                priority: 500,
                require: 'biTabs',
                controller: tabsController,
                compile: function compile(tElement, tAttrs) {
                    var length = (tElement.children('.nav').children('li').attr('bi-tab-nav', ''),
                                  tElement.children('.tab-content').children('.tab-pane').attr('bi-tab-pane', '').length);

                    return function link(scope, $element, attr, ctrl) {
                        var time, $tabs = scope.hasOwnProperty('$tabs') && scope.$tabs || (scope.$tabs = {});
                        ctrl.length = length,
                        ctrl.def = attr.biTabs,
                        time = $timeout(ctrl.fnInit, 600),
                        $tabs[attr.id || (attr.id = number++)] = fnShowTab,
                        !scope.hasOwnProperty('ShowTab') && (scope.ShowTab = function (id, key) {
                            var fu = (fu = angular.isString(id) && $tabs[id]) && isFn(fu) ? fu : scope.FirstTab;
                            fu.apply(this, Array.prototype.slice.call(arguments, angular.isString(id) ? 1 : 0))
                        }, scope.FirstTab = fnShowTab),
                        scope.$on(actionEvent.OnSearch, function (s) { s.preventDefault() })

                        function fnShowTab(key) {
                            time && $timeout.cancel(time),
                            ctrl.oldArg = ctrl.arg,
                            ctrl.arg = Array.prototype.slice.call(arguments, angular.isString(key) ? 1 : 0),
                            ctrl.fnInit(angular.isString(key) && key)
                        }
                    }
                }
            }

            function fnShowTab(ctrl) {
                this.Scope.$emit(pageEvent.OnInit, this.key),
                this.Scope.$broadcast(pageEvent.OnInit, this.key),

                ctrl.lastTab !== ctrl.currentTab &&
                (this.nav && this.nav.addClass("active"),
                this.tabPane && this.tabPane.addClass("active")),

                this.Scope.$emit(pageEvent.OnLoad, this.key),
                this.Scope.$broadcast(pageEvent.OnLoad, this.key)
            }

            function fnHideTab(ctrl) {
                this.Scope.$emit(pageEvent.OnUnLoad, this.key),
                this.Scope.$broadcast(pageEvent.OnUnLoad, this.key),


                ctrl.lastTab !== ctrl.currentTab &&
                (this.Scope.isDisplay = !1,
                this.nav && this.nav.removeClass("active"),
                this.tabPane && this.tabPane.removeClass("active")),

                this.Scope.$emit(pageEvent.OnDisposed, this.key),
                this.Scope.$broadcast(pageEvent.OnDisposed, this.key)
            }

            function fnApplyQueue(queue, arg) { return queue.map(function (fuc) { $q.all(fuc.apply(this, arg)) }) }

            function fnInit(key) {
                var current = this.currentTab;
                if (!current || key) {
                    key = key || this.def;
                    for (var tab in this.tabs) {
                        if (tab = this.tabs[tab], current || (current = tab), tab.key == key) {
                            current = tab; break;
                        }
                    }
                }
                this.fnLoadTab(current)
            }
        }]

        app.directive('biTabs', tabsDirective)

        var tabNavDirective = function () {
            return {
                restrict: 'A',
                priority: 500,
                require: '^biTabs',
                link: function (scope, $element, attr, ctrl) {
                    var tab = ctrl.tabs[$element.index()] = { nav: $element };
                    $element.on('click', function () { ctrl.currentTab !== tab && ctrl.fnLoadTab(tab) })
                }
            }
        }

        app.directive('biTabNav', tabNavDirective)

        var tabPaneDirective = ['$templateRequest', '$anchorScroll', '$animate', '$q',
            function ($templateRequest, $anchorScroll, $animate, $q) {
                return {
                    restrict: 'A',
                    priority: 400,
                    terminal: true,
                    transclude: 'element',
                    require: ['^biTabs', 'biTabPane'],
                    controller: angular.noop,
                    compile: function compile(tElement, tAttrs) {
                        var srcExp = tAttrs.src || tAttrs.url,
                            onloadExp = tAttrs.onload || '',
                            autoScrollExp = tAttrs.autoscroll,
                            key = tAttrs.id || tAttrs.name || srcExp;

                        return function link(scope, $element, attr, ctrl, $transclude) {
                            var tabsCtrl = ctrl[0],
                                tabPaneCtrl = ctrl[1],
                                tabPane = tabPaneCtrl.tabPane = tabsCtrl.tabs[tabsCtrl.index++] || (tabsCtrl.tabs[tabsCtrl.index - 1] = {}),
                                changeCounter = 0,
                                currentScope,
                                previousElement,
                                currentElement,
                                tabLoad = $q(function (fn) { tabPane.fnload = fn });

                            tabPane.key = key,
                            tabPaneCtrl.src = srcExp && ([srcExp.match(/(.+)\.htm+l?$/i)[1] + '.js'])

                            var cleanupLastIncludeContent = function () {
                                if (previousElement) {
                                    previousElement.remove();
                                    previousElement = null;
                                }
                                if (currentScope) {
                                    currentScope.$destroy();
                                    currentScope = null;
                                }
                                if (currentElement) {
                                    $animate.leave(currentElement).then(function () {
                                        previousElement = null;
                                    });
                                    previousElement = currentElement;
                                    currentElement = null;
                                }
                            };

                            scope.$watch('"' + srcExp + '"', function tabPaneAction(src) {
                                var afterAnimation = function () {
                                    if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                        $anchorScroll();
                                    }
                                };

                                tabLoad.then(function () {
                                    tabPane.loaded = !0;

                                    var thisChangeId = ++changeCounter;

                                    if (src) {
                                        $templateRequest(require.toUrl(src), true).then(function (response) {
                                            if (scope.$$destroyed) return;

                                            if (thisChangeId !== changeCounter) return;

                                            var newScope = scope.$new();

                                            tabPaneCtrl.template = response;

                                            var clone = $transclude(newScope, function (clone) {
                                                cleanupLastIncludeContent();
                                                $animate.enter(clone, null, $element).then(afterAnimation);
                                            });

                                            tabPane.Scope = currentScope = newScope;
                                            currentElement = clone;

                                            currentScope.$emit('$includeContentLoaded', src);
                                            scope.$eval(onloadExp);
                                        }, function () {
                                            if (scope.$$destroyed) return;

                                            if (thisChangeId === changeCounter) {
                                                cleanupLastIncludeContent();
                                                scope.$emit('$includeContentError', src);
                                            }
                                        });
                                        scope.$emit('$includeContentRequested', src);
                                    } else {
                                        cleanupLastIncludeContent();
                                        tabPaneCtrl.template = null;
                                    }
                                })
                            });
                        }
                    }
                }
            }]

        app.directive('biTabPane', tabPaneDirective)

        var tabPaneFillContentDirective = ['$compile', function ($compile) {
            return {
                restrict: 'A',
                priority: -400,
                require: ['^biTabs', 'biTabPane'],
                link: function (scope, $element, $attr, ctrl) {
                    var tabsCtrl = ctrl[0],
                        tabPaneCtrl = ctrl[1],
                        showQueue = tabPaneCtrl.tabPane.showQueue = [],
                        closeQueue = tabPaneCtrl.tabPane.closeQueue = [];

                    if (Object.prototype.toString.call($element[0]).match(/SVG/)) {
                        $element.empty();
                        $compile(jqLiteBuildFragment(tabPaneCtrl.template, document).childNodes)(scope,
                            function namespaceAdaptedClone(clone) {
                                $element.append(clone);
                            }, { futureParentElement: $element });
                        return;
                    }

                    function fn() {
                        $element.html(tabPaneCtrl.template),
                        $compile($element.contents())(scope),
                        tabPaneCtrl.tabPane.tabPane = $element,
                        tabsCtrl.fnShowTab()
                    }

                    scope.ShowView = function (fn) { return isFn(fn) && showQueue.push(fn), scope },

                    scope.CloseView = function (fn) { return isFn(fn) && closeQueue.push(fn), scope },

                    scope.$eval($attr.loadctrl) !== false && require(tabPaneCtrl.src, fn) || fn();
                }
            }
        }]

        app.directive('biTabPane', tabPaneFillContentDirective)
    })