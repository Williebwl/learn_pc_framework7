define(['page', 'evt.page'], function (app, pageEvent) {
    'use strict'

    var isDefined = angular.isDefined, toString = angular.toString, isFn = angular.isFunction,
        sliceArg = function (arg, start, end) { return arg && Array.prototype.slice.call(arg, start, end) },
        isString = angular.isString;

    var biDialogDirective = ['$templateRequest', '$anchorScroll', '$animate', '$q',
                  function ($templateRequest, $anchorScroll, $animate, $q) {
                      return {
                          restrict: 'ECA',
                          priority: 400,
                          terminal: true,
                          transclude: 'element',
                          controller: angular.noop,
                          compile: function (element, attr) {
                              var srcExp = attr.biDialog || attr.src,
                                  ctrlUrl = attr.ctrlurl,
                                  onloadExp = attr.onload || '',
                                  autoScrollExp = attr.autoscroll,
                                  key = attr.id || attr.name || srcExp;

                              if (srcExp && !ctrlUrl) ctrlUrl = [((ctrlUrl = srcExp.match(/(.+)\.htm+l?$/i)) ? ctrlUrl[1] : srcExp) + '.js'];
                              else if (ctrlUrl) ctrlUrl = (scope.$eval(ctrlUrl) || ctrlUrl).split(/;*,+;*|,*;+/);

                              return function (scope, $element, $attr, ctrl, $transclude) {
                                  var changeCounter = 0,
                                      currentScope,
                                      previousElement,
                                      currentElement,
                                      $dialog = scope.hasOwnProperty('$dialog') && scope.$dialog || (scope.$dialog = {});

                                  !scope.hasOwnProperty('ShowDialog') && (scope.ShowDialog = function (id) {
                                      var fn = $dialog[isString(id) && id || key];
                                      fn = (isFn(fn) && fn || $dialog.fnLoadDialog),
                                      isFn(fn) && fn(isString(id) ? sliceArg(arguments, 1) : arguments)
                                  })

                                  ctrl.Url = ctrlUrl;
                                  ctrl.modal = $attr.size && $attr.size.indexOf("search-panel-") !== 0;

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
                                          if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                              $anchorScroll();
                                          }
                                      };

                                      if (src) {
                                          $dialog[key] = fnLoadDialog
                                      } else {
                                          cleanupLastIncludeContent();
                                          ctrl.template = null;
                                      }

                                      if (!isFn($dialog.fnLoadDialog)) $dialog.fnLoadDialog = fnLoadDialog;

                                      function fnLoadDialog(arg) {
                                          var thisChangeId = ++changeCounter;

                                          ctrl.modal && ($element.modal('show'), ctrl['bs.modal'] = $element.get(0)['bs.modal'])

                                          $templateRequest(src, true).then(function (response) {
                                              if (scope.$$destroyed) return;

                                              if (thisChangeId !== changeCounter) return;

                                              var newScope = scope.$new();

                                              ctrl.arg = arg,
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
                                              ctrl.modal && $element.modal('hide')

                                              if (scope.$$destroyed) return;

                                              if (thisChangeId === changeCounter) {
                                                  cleanupLastIncludeContent();
                                                  scope.$emit('$includeContentError', src);
                                              }
                                          });
                                          scope.$emit('$includeContentRequested', src);
                                      }
                                  });
                              };
                          }
                      };
                  }];

    var biDialogFillContentDirective = ['$compile', '$q',
                 function ($compile, $q) {
                     return {
                         restrict: 'ECA',
                         priority: -400,
                         require: 'biDialog',
                         link: function (scope, $element, $attr, ctrl) {
                             var size = $attr.size,
                                 showQueue = [],
                                 closeQueue = [],
                                 key = $attr.id || $attr.name || $attr.biDialog || $attr.src;

                             if (toString.call($element[0]).match(/SVG/)) {
                                 $element.empty();
                                 $compile(jqLiteBuildFragment(ctrl.template, window.document).childNodes)(scope,
                                     function namespaceAdaptedClone(clone) {
                                         $element.append(clone);
                                     }, { futureParentElement: $element });
                                 return;
                             }

                             function fn() {
                                 if (size) {
                                     if (size.indexOf("search-panel-") == 0)
                                         $element.addClass('search-panel scroller scrollerbar-primary ' + size).html(getSearchTemplate());
                                     else {
                                         size = "modal-dialog-" + size;
                                         $element.addClass('modal fade').html(getModalTemplate());
                                     }
                                 }
                                 else $element.html(ctrl.template)

                                 $compile($element.contents())(scope);

                                 $q.all(fnApplyQueue(showQueue, ctrl.arg)).then(ShowView),
                                 scope.$on(pageEvent.OnFormSubmited, function (s) { scope !== s.targetScope && scope !== s.targetScope.$parent && fnApplyQueue(showQueue, ctrl.arg) }),
                                 scope.$digest()
                             }

                             scope.ShowView = function (fn) { return angular.isFunction(fn) && showQueue.push(fn), scope },

                             scope.CloseView = function (fn) { return angular.isFunction(fn) && closeQueue.push(fn), scope },

                             scope.CloseDialog = function () { return $q.all(fnApplyQueue(closeQueue, arguments)).then(CloseView), scope }

                             Array.isArray(ctrl.Url) && require(ctrl.Url, fn) || fn();

                             function getModalTemplate() {
                                 var controller = ctrl.template.match(/ng-controller="([^"]+)"/i);
                                 var header = ($attr.header || "true") == "true";
                                 var footer = ($attr.footer || "true") == "true";

                                 return '<div class="modal-dialog ' + size + '" tabindex=\"-1\">\
                                             <div class="modal-content" ' + (controller ? controller[0] : '') + '>' +
                                                (header ? ('<div class="modal-header">\
                                                     <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>\
                                                     <h4 class="modal-title">' + ($attr.title || '') + '</h4>\
                                                  </div>') : '') +
                                                 '<div class="modal-body">' + ctrl.template.replace(controller ? controller[0] : '', '') + '</div>' +
                                                     (footer ? ('<div class="modal-footer">\
                                                      <button type="button" class="btn  btn-default await" ng-click="fnSave()">保存<i class="fa fa-spinner"></i></button> \
                                                      <button type="button" class="btn  btn-white" data-dismiss="modal" data-close-self >取消</button>\
                                                   </div>') : '') +
                                             '</div>\
                                        </div>'
                             }

                             function getSearchTemplate() {
                                 return ctrl.template;
                             }

                             function ShowView() {
                                 var dialog = $element;

                                 scope.$emit(pageEvent.OnInit, key),
                                 scope.$broadcast(pageEvent.OnInit, key),

                                 size && size.indexOf('modal-dialog-') == 0 && (dialog.attr('data-backdrop', 'static'), dialog.data('before.bs.modal', ctrl['bs.modal']), dialog.modal('show')) ||
                                 (dialog.is('.prop-slider') || (dialog = dialog.children('div:first')).is('.prop-slider') || (dialog = dialog.children('div:first')).is('.prop-slider')) && dialog.showProp() ||
                                 $element.show(),
                                 scope.$emit(pageEvent.OnLoad, key),
                                 scope.$broadcast(pageEvent.OnLoad, key)
                             }

                             function CloseView() {
                                 var dialog = $element;
                                 closeQueue.length = 0,

                                 scope.$emit(pageEvent.OnUnLoad, key),
                                 scope.$broadcast(pageEvent.OnUnLoad, key),

                                 size && size.indexOf('modal-dialog-') == 0 && dialog.modal('hide') ||
                                 (dialog.is('.prop-slider') || (dialog = dialog.children('div:first')).is('.prop-slider') || (dialog = dialog.children('div:first')).is('.prop-slider')) && dialog.hideProp() ||
                                  $element.hide(),
                                 scope.$emit(pageEvent.OnDisposed, key),
                                 scope.$broadcast(pageEvent.OnDisposed, key)
                             }
                         }
                     };

                     function fnApplyQueue(queue, arg) { return queue.map(function (fuc) { return $q.all(fuc.apply(this, arg)) }) }
                 }];

    app.directive('biDialog', biDialogDirective).directive('biDialog', biDialogFillContentDirective)
});