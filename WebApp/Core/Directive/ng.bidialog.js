define(['page', 'evt.page'], function (app, pageEvent) {
    'use strict'

    var biDialogDirective = ['$templateRequest', '$anchorScroll', '$animate',
             function ($templateRequest, $anchorScroll, $animate) {
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
                         else if (ctrlUrl) ctrlUrl = (scope.$eval(srcExp) || ctrlUrl).split(/;*,+;*|,*;+/);

                         return function (scope, $element, $attr, ctrl, $transclude) {
                             var changeCounter = 0,
                                 currentScope,
                                 previousElement,
                                 currentElement,
                                 $dialog = scope.hasOwnProperty('$dialog') && scope.$dialog || (scope.$dialog = {});

                             ctrl.Url = ctrlUrl;

                             !scope.hasOwnProperty('ShowDialog') && (scope.ShowDialog = function (id) {
                                 var fuc = $dialog[angular.isString(id) && id || key];
                                 angular.isFunction(fuc) && fuc(angular.isString(id) ? Array.prototype.slice.call(arguments, 1) : arguments)
                             })

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

                             scope.$watch('"' + srcExp + '"', function biDialogWatchAction(src) {
                                 var afterAnimation = function () {
                                     if (angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                         $anchorScroll();
                                     }
                                 };
                                 var thisChangeId = ++changeCounter;

                                 if (src) {
                                     $templateRequest(require.toUrl(src), true).then(function (response) {
                                         if (thisChangeId !== changeCounter) return;

                                         $dialog[key] = function (arg) {
                                             var newScope = scope.$new();

                                             ctrl.data = arg,
                                             ctrl.template = response;

                                             var clone = $transclude(newScope, function (clone) {
                                                 cleanupLastIncludeContent();
                                                 $animate.enter(clone, null, $element).then(afterAnimation);
                                             });

                                             currentScope = newScope;
                                             currentElement = clone;

                                             currentScope.$emit('$includeContentLoaded', src);
                                             scope.$eval(onloadExp);
                                         }
                                     }, function () {
                                         if (thisChangeId === changeCounter) {
                                             cleanupLastIncludeContent();
                                             scope.$emit('$includeContentError', src);
                                         }
                                     });
                                     scope.$emit('$includeContentRequested', src);
                                 } else {
                                     cleanupLastIncludeContent();
                                     ctrl.template = null;
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
                  var size = $attr.size, showQueue = [], closeQueue = [], key = $attr.id || $attr.name || $attr.biDialog || $attr.src;
                  if (/SVG/.test($element[0].toString())) {
                      $element.empty();
                      $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope,
                          function (clone) {
                              $element.append(clone);
                          }, { futureParentElement: $element });
                      return;
                  }

                  function fn() {
                      if (size)
                          if (size.indexOf("search-panel-") == 0)
                              $element.addClass('search-panel scroller scrollerbar-primary ' + size).html(getSearchTemplate());
                          else {
                              size = "modal-dialog-" + size;
                              $element.addClass('modal fade').html(getModalTemplate());
                          }
                      else
                          $element.html(ctrl.template)
                      $compile($element.contents())(scope),
                      $q.all(fnApplyQueue(showQueue, ctrl.data)).then(ShowView)
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

                      return "<div class='modal-dialog " + size + "' tabindex=\"-1\">\
                                <div class='modal-content' " + (controller ? controller[0] : "") + ">\
                                    " + (header ? ("<div class='modal-header'>\
                                        <button aria-hidden='true' data-dismiss='modal' class='close' type='button'>&times;</button>\
                                        <h4 class='modal-title'>" + ($attr.title || '') + "</h4>\
                                    </div>") : "") + "\
                                        <div class='modal-body'>" +
                                        ctrl.template.replace(controller ? controller[0] : "", "") +
                                   "</div>\
                                   " + (footer ? ("<div class='modal-footer'>\
                                        <button type='button' class='btn  btn-default' ng-click='fnSave()'>保存</button> \
                                        <button type='button' class='btn  btn-white' data-dismiss='modal' data-close-self ng-click=''>取消</button>\
                                    </div>") : "") + "\
                                </div>\
                              </div>"
                  }

                  function getSearchTemplate() {
                      return ctrl.template;
                  }

                  function ShowView() {
                      var dialog = $element;
                      showQueue.length = 0,

                      scope.$emit(pageEvent.OnInit, key),
                      scope.$broadcast(pageEvent.OnInit, key),
                      size && size.indexOf('modal-dialog-') == 0 && dialog.modal('show') ||
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
          }

          function fnApplyQueue(queue, arg) { return queue.map(function (fuc) { $q.all(fuc.apply(this, arg)) }) }
      }];

    app.directive('biDialog', biDialogDirective).directive('biDialog', biDialogFillContentDirective)


});