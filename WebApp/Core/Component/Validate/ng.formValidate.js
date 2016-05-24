define('formValidate',
      ['page-Route', 'evt.page', 'core.Service'],
      function (app, pageEvent) {
          'use strict';

          var noop = angular.noop, isFn = angular.isFunction;

          app.directive('biFormValidate', biFormValidateDirective)

          biFormValidateDirective.$inject = ['$q', 'coreService']
          function biFormValidateDirective($q, coreService) {

              biFormValidateController.$inject = ['$scope']
              function biFormValidateController($scope) {
                  var self = this,
                      promises = $q(function (a) { self.fnInit = a }),
                      validateQueue = [],
                      restQueue = [];

                  this.fnBind = function (fn) {
                      return isFn(fn) && promises.then(function () { fn.call(self, self.VMS) }), this
                  }

                  this.fnValidate = function (fn) {
                      return isFn(fn) && validateQueue.push(fn), this
                  }

                  this.fnFormValidateRest = function (fn) {
                      return isFn(fn) && restQueue.push(fn), this
                  }

                  $scope.$on(pageEvent.OnFormValidate, function (s, e) {
                      e.IsValid && (!e.mark || e.mark === formValidate.mark || Array.isArray(e.mark) && $.inArray(formValidate.mark, e.mark) >= 0) && fnValidate(e)
                  })

                  $scope.$on(pageEvent.OnFormReset, function (s, e) {
                      var def = { $valid: false, $invalid: false, $pristine: true, $dirty: false };
                      $.extend(self.form, def),
                      $scope.$valid = false;
                      fnApplyQueue(restQueue, def)
                  })

                  function fnValidate(e) {
                      var msg = [];
                      fnApplyQueue(validateQueue, msg)
                      e.promise = $q(function (a, b) { msg.length ? (e.errorNotice('·' + msg.join('<br />·')), b(e)) : a(e) })
                  }
              }

              return {
                  restrict: 'AC',
                  priority: 100,
                  require: { form: 'form', formValidate: 'biFormValidate' },
                  controller: biFormValidateController,
                  compile: function compile(tElement, tAttrs) {
                      if (!tElement.is('form')) return;
                      return tElement.attr('novalidate', '').find(':input[name]:not([name=""],[bi-validate])').attr('bi-validate', ''), { pre: preLink, post: postLink }
                  }
              }

              function preLink(scope, $element, attr, ctrl) {
                  ctrl.formValidate.mark = $.trim(attr.biFormValidate) || $.trim(attr.mark) || attr.name,
                  ctrl.formValidate.form = ctrl.form
              }

              function postLink(scope, $element, attr, ctrl) {
                  var promises = coreService.fnGetformValidInfo(ctrl.formValidate.mark)
                                            .success(function (vms) { ctrl.formValidate.VMS = vms })
                                            .error(function () { console.log("【" + ctrl.formValidate.mark + "】验证信息获取失败！") })

                  scope.$on(pageEvent.OnInit, function () { $q.when(promises).then(ctrl.formValidate.fnInit) })
              }
          }

          function fnApplyQueue(queue, arg) { queue.forEach(function (fn) { return fn.call(this, arg) }) }

          app.directive('biValidate', biValidateDirective)

          biValidateDirective.$inject = ['$parse']
          function biValidateDirective($parse) {
              function fnBind(validate, ngModel, $element) {
                  if (!validate) return;

                  Object.getOwnPropertyNames(validate).forEach(function (key) {
                      var fn = biFormValidates[key];
                      isFn(fn) ? fn.call(ngModel.$validators, key, validate[key], ngModel.$errorMsg, $element, ngModel) : console.warn('暂不支持【' + key + '】类型的验证.');
                  })
              }

              return {
                  restrict: 'AC',
                  priority: 100,
                  require: { formValidate: '^biFormValidate', ngModel: '?ngModel' },
                  link: { pre: preLink, post: postLink }
              }

              function preLink(scope, $element, attr, ctrl) {
                  if (!ctrl.ngModel) return;

                  ctrl.ngModel.$errorMsg = {}
              }

              function postLink(scope, $element, attr, ctrl) {
                  if (!ctrl.ngModel) return;

                  var getter = fnValidateGetter(ctrl.formValidate.mark, attr.name),
                      fn = scope.$eval(attr.biValidate);

                  ctrl.formValidate.fnBind(function (vms) { fnBind(getter(vms), ctrl.ngModel, $element) })

                  if (isFn(fn)) fn.call(ctrl.ngModel.$validators, ctrl.ngModel.$errorMsg, $element, ctrl.ngModel);

                  ctrl.formValidate.fnValidate(function (msg) {
                      ctrl.ngModel.$validate()

                      Object.getOwnPropertyNames(ctrl.ngModel.$errorMsg).forEach(function (key) { msg.push(ctrl.ngModel.$errorMsg[key]) })
                  })

                  ctrl.formValidate.fnFormValidateRest(function (def) { $element.parent().removeClass('has-error'); $.extend(ctrl.ngModel, def) })
              }

              function fnValidateGetter(mark, name) {
                  mark = Array.isArray(mark) ? mark : mark.split(',')
                  return function (vms) {
                      var validate;
                      for (var i = 0, l = mark.length; i < l; i++) {
                          if (validate = $parse(mark[i] + '.' + name)(vms)) return validate;
                      }
                  }
              }
          }

          var biFormValidates = {
              required: function (key, validate, $error, $element, ngModel) {
                  var isSelect = $element.prop('required', true).is('select');

                  this.required = function (modelValue, viewValue) {
                      return fnValidate(key, $element, isSelect && !$element.data('canValid') || !ngModel.$isEmpty(viewValue), $error, validate);
                  }
              },
              regularexpression: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, arguments)
              },
              emailaddress: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/) && arguments)
              },
              phone: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^[\d-]+$/) && arguments)
              },
              telphone: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^(\d{3,4}-)?\d{6,8}$/) && arguments)
              },
              mobilephone: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^1\d{10}$/) && arguments)
              },
              identifier: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/) && arguments)
              },
              visiblechar: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.pattern.apply(this, (arguments[1].pattern = /^[\u0020-\u007e]+$/) && arguments)
              },
              pattern: function (key, validate, $error, $element, ngModel) {
                  var regex = (regex = validate.pattern || validate.value || validate) && angular.isString(regex) && regex.length > 0 && new RegExp(regex) || validate.pattern, regexp;

                  if (!regex && !regex.test) return;

                  regexp = regex || undefined;

                  this.pattern = function (modelValue, viewValue) {
                      return fnValidate(key, $element, ngModel.$isEmpty(viewValue) || angular.isUndefined(regexp) || regexp.test(viewValue), $error, validate)
                  }

                  $element.attr('pattern', regexp);
              },
              stringlength: function (key, validate, $error, $element, ngModel) {
                  biFormValidates.minlength.apply(this, (arguments[0] = 'minlength') && arguments), biFormValidates.maxlength.apply(this, (arguments[0] = 'maxlength') && arguments)
              },
              maxlength: function (key, validate, $error, $element, ngModel) {
                  var maxlength = parseInt(validate.length || validate.maximumlength || validate, 10);

                  if (isNaN(maxlength)) return;

                  $element.attr('maxlength', maxlength);

                  this.maxlength = function (modelValue, viewValue) {
                      return fnValidate(key, $element, maxlength < 0 || ngModel.$isEmpty(viewValue) || viewValue.length <= maxlength, $error, validate);
                  }
              },
              minlength: function (key, validate, $error, $element, ngModel) {
                  var minlength = parseInt(validate.length || validate.minimumlength || validate, 10);

                  if (isNaN(minlength)) return;

                  $element.attr('minlength', minlength);

                  this.minlength = function (modelValue, viewValue) {
                      return fnValidate(key, $element, ngModel.$isEmpty(viewValue) || viewValue.length >= minlength, $error, validate);
                  }
              },
              range: function (key, validate, $error, $element, ngModel) {
                  this.min.apply(this, (arguments[0] = 'min') && arguments), this.max.apply(this, (arguments[0] = 'max') && arguments)
              },
              max: function (key, validate, $error, $element, ngModel) {
                  var max = parseFloat(validate.maximum || validate, 10);

                  if (isNaN(max)) return;

                  $element.attr('max', max);

                  this.max = function (value) {
                      return fnValidate(key, $element, ngModel.$isEmpty(value) || angular.isUndefined(max) || value <= max, $error, validate);
                  }
              },
              min: function (key, validate, $error, $element, ngModel) {
                  var min = parseFloat(validate.minimum || validate, 10);

                  if (isNaN(min)) return;

                  $element.attr('min', min);

                  this.min = function (value) {
                      return fnValidate(key, $element, ngModel.$isEmpty(value) || angular.isUndefined(min) || value >= min, $error, validate);
                  }
              },
              display: noop,
              number: fnInputType,
              email: fnInputType,
              date: fnInputType,
              'datetime-local': fnInputType,
              time: fnInputType,
              checkbox: fnInputType,
              week: fnInputType,
              month: fnInputType,
              url: fnInputType,
              radio: fnInputType
          }

          function fnValidate(key, $input, isValid, $errorMsg, msg) {
              var k = key + isValid;

              if ($input.lastValid != k) {
                  $input.lastValid = k;
                  isValid ? ($input.parent().removeClass('has-error'), delete $errorMsg[key]) : ($input.parent().addClass('has-error'), $errorMsg[key] = msg.msg || msg);
              }

              return isValid
          }

          function fnInputType(key, validate, $error, $element) {
              return $element.attr('type', key);
          };
      });