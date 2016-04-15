define(['page'],
    function (app) {
        'use strict'

        var biIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate',
                  function ($templateRequest, $anchorScroll, $animate, $rootScope) {
                      return {
                          restrict: 'ECA',
                          priority: 400,
                          terminal: true,
                          transclude: 'element',
                          controller: angular.noop,
                          compile: function (element, attr) {
                              var onloadExp = attr.onload || '',
                                  autoScrollExp = attr.autoscroll,
                                  target = $.trim(attr.target),
                                  event = $.trim(attr.event);

                              return function (scope, $element, $attr, ctrl, $transclude) {
                                  var changeCounter = 0,
                                      currentScope,
                                      previousElement,
                                      currentElement,
                                      srcExp = attr.biInclude || attr.src || attr.templateurl,
                                      ctrlUrl = $attr.controllerurl,
                                      action = $.trim(attr.action),
                                      async = !!(target || action);

                                  if (srcExp) srcExp = scope.$eval(srcExp) || srcExp;

                                  if (srcExp && !ctrlUrl) ctrlUrl = [((ctrlUrl = srcExp.match(/(.+)\.htm+l?$/i)) ? ctrlUrl[1] : srcExp) + '.js'];
                                  else if (ctrlUrl) ctrlUrl = (scope.$eval(srcExp) || ctrlUrl).split(/;*,+;*|,*;+/);

                                  ctrl.Url = ctrlUrl;

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

                                  scope.$watch('"' + srcExp + '"', function ngIncludeWatchAction(src) {
                                      var afterAnimation = function () {
                                          if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                              $anchorScroll();
                                          }
                                      };

                                      var thisChangeId = ++changeCounter, func, load;

                                      if (src) {
                                          func = function (callback) {
                                              if (ctrl.callback) ctrl.callback();
                                              else if (action !== 0) {
                                                  action = 0, typeof callback === 'function' && (ctrl.callback = callback);

                                                  $templateRequest(require.toUrl(src), true).then(function (response) {
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
                                                      if (thisChangeId === changeCounter) {
                                                          cleanupLastIncludeContent();
                                                          scope.$emit('$includeContentError', src);
                                                      }
                                                  });
                                                  scope.$emit('$includeContentRequested', src);
                                              }
                                          }

                                          if (async) {
                                              if (target) $(document).off(event || 'click', target, load = function () { $(document).off(event || 'click', target, load), func() }).on(event || 'click', target, load)

                                              if (action) (scope.infos || scope)[action] = func;
                                          } else func();
                                      } else {
                                          cleanupLastIncludeContent();
                                          ctrl.template = null;
                                      }
                                  });
                              };
                          }
                      };
                  }];

        var biIncludeFillContentDirective = ['$compile',
          function ($compile) {
              return {
                  restrict: 'ECA',
                  priority: -400,
                  require: 'biInclude',
                  link: function (scope, $element, $attr, ctrl) {
                      if (/SVG/.test($element[0].toString())) {
                          $element.empty();
                          $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope,
                              function namespaceAdaptedClone(clone) {
                                  $element.append(clone);
                              }, { futureParentElement: $element });
                          return;
                      }

                      function fn() {
                          $element.html(ctrl.template);
                          $compile($element.contents())(scope);

                          if (ctrl.callback) ctrl.callback();

                          scope.$digest();
                      }

                      Array.isArray(ctrl.Url) && require(ctrl.Url, fn) || fn();
                  }
              };
          }];

        app.directive('biInclude', biIncludeDirective).directive('biInclude', biIncludeFillContentDirective)
    })