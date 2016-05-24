define(['page'],
    function (app) {
        'use strict'

        var isDefined = angular.isDefined, toString=Object.prototype.toString;

        app.directive('biInclude', biIncludeDirective)
           .directive('biInclude', biIncludeFillContentDirective)

        biIncludeDirective.$inject = ['$templateRequest', '$anchorScroll', '$animate']
        function biIncludeDirective($templateRequest, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                priority: 400,
                terminal: true,
                transclude: 'element',
                controller: angular.noop,
                compile: function (element, attr) {
                    var onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll;

                    return function (scope, $element, $attr, ctrl, $transclude) {
                        var changeCounter = 0,
                            srcExp = attr.biInclude || attr.src || attr.templateurl,
                            ctrlSrc = attr.controllerurl,
                            currentScope,
                            previousElement,
                            currentElement, target = $.trim(attr.target),
                            action = $.trim(attr.action);

                        if (srcExp) srcExp = scope.$eval(srcExp) || srcExp;

                        if (srcExp && !ctrlSrc) ctrlSrc = [((ctrlSrc = srcExp.match(/(.+)\.htm+l?$/i)) ? ctrlSrc[1] : srcExp) + '.js'];
                        else if (ctrlSrc) ctrlSrc = (scope.$eval(ctrlSrc) || ctrlSrc).split(/;*,+;*|,*;+/);

                        ctrl.src = ctrlSrc;

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

                        scope.$watch('"' + srcExp + '"', function biIncludeWatchAction(src) {
                            var afterAnimation = function () {
                                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                    $anchorScroll();
                                }
                            };


                            if (src) {

                                if (!(target || action)) biIncludeTemplateRequest()
                                else {
                                    if (target) {
                                        var event = ($.trim($attr.event) || 'click') + '.biInclude'
                                        $(document).off(event, target, load).on(event, target, load)

                                        function load() { $(document).off(event, target, load), biIncludeTemplateRequest() }
                                    }

                                    if (action) scope[action] = biIncludeTemplateRequest;
                                }

                                function biIncludeTemplateRequest() {
                                    var thisChangeId = ++changeCounter;

                                    $templateRequest(src, true).then(function (response) {
                                        if (scope.$$destroyed) return;

                                        if (thisChangeId !== changeCounter) return;
                                        var newScope = scope.$new();
                                        ctrl.template = response;

                                        var clone = $transclude(newScope, function (clone) {
                                            cleanupLastIncludeContent();
                                            $animate.enter(clone, null, $element).then(afterAnimation);
                                        });

                                        currentScope = newScope;
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
                                }
                            } else {
                                cleanupLastIncludeContent();
                                ctrl.template = null;
                            }
                        });
                    };
                }
            };
        };

        biIncludeFillContentDirective.$inject = ['$compile']
        function biIncludeFillContentDirective($compile) {
            return {
                restrict: 'ECA',
                priority: -400,
                require: 'biInclude',
                link: function (scope, $element, $attr, ctrl) {
                    if (toString.call($element[0]).match(/SVG/)) {
                        $element.empty();
                        $compile(jqLiteBuildFragment(ctrl.template, window.document).childNodes)(scope,
                            function namespaceAdaptedClone(clone) {
                                $element.append(clone);
                            }, { futureParentElement: $element });
                        return;
                    }

                    function fn() {
                        $element.html(ctrl.template);
                        $compile($element.contents())(scope);

                        scope.$digest();
                    }

                    Array.isArray(ctrl.src) && require(ctrl.src, fn) || fn();
                }
            };
        };
    })