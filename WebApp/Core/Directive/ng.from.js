define(['page'],
    function (app) {
        'use strict'

        var biCheckboxDirective = function () {

            return {
                restrict: 'AC',
                controller: function ($scope) {
                    var ids = [], self = this, $cbxs = [], $cbxAll = self.$cbxAll = [];

                    function fnSetAll(ck) {
                        $cbxAll.forEach(function ($cbx) { $cbx.prop('checked', ck); });
                    }

                    this.bind = function ($val) {
                        var ck = $val.ck || $val.key && ($val.key.ck || $val.key.checked) || 0;

                        if ($val.$index === 0) {
                            if (ck) fnSetAll(ck); ids.length = $cbxs.length = 0;
                        }
                        else if (!ck) fnSetAll(ck);

                        $cbxs.push(this.prop('checked', ck));

                        if (ck) ids.push($val);

                        return $val;
                    };

                    this.fnCheckedAll = function () {
                        var ck = $(this).prop('checked');

                        fnSetAll(ck), ids.length = 0,

                        $cbxs.forEach(function ($cbx) {
                            $cbx.prop('checked', ck),
                            ck && ids.push($cbx.$val)
                        })
                    }

                    this.fnChecked = function (e) {
                        $(this).prop('checked') ? ids.push(e.data.$val) : ids.remove(e.data.$val),
                        fnSetAll($cbxs.length === ids.length)
                    }

                    this.init = function (conf) {
                        conf.ids = ids, conf.$cbxs = $cbxs, conf.$cbxAll = $cbxAll
                    }
                },
                scope: {
                    conf: '='
                },
                compile: function (tpl, tplAttr) {
                    var expression = $('[ng-repeat]:first', tpl).attr('ng-repeat'),
                    match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                    match = match ? match[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/) : [];
                    var key = match[3] || match[1];

                    return function (scope, $element, attr, ctrl) {
                        ctrl.init(scope.conf || scope.$parent.$eval(attr.biCheckbox) || (scope.$parent.CheckedInfo = {})),
                        ctrl.key = key
                    }
                }
            };
        };

        app.directive('biCheckbox', biCheckboxDirective);

        function checkboxORradio(type, css) {
            css = type + ' ' + type + '-primary ' + css;

            if (!this.parent().is('label')) this.wrap('<label></label>');

            var $p = this.parent().append('<i class="fa fa-' + (type === 'radio' ? 'circle' : 'square') + '-o"></i>'), $pt = $p.parent();

            $pt.is('td') || $pt.is('th') ? $p.wrap('<div class="' + css + ' ' + type + '-inline"></div>') : $pt.addClass(css);
        }

        var inputDirective = function () {
            return {
                restrict: 'E',
                require: '?^biCheckbox',
                compile: function (element, attr) {
                    if (attr.type === 'checkbox' || attr.type === 'radio') {
                        return function (scope, $element, attr, ctrl) {
                            var $p, isall, css = ($element.prop('disabled') || (attr.ngDisabled && scope.$eval(attr.ngDisabled))) ? 'disabled' : '';
                            if (attr.type === 'checkbox') {
                                $p = $element.parent(), isall = !angular.isUndefined(attr.isall) || $p.is('th') || ($p = $p.parent()).is('th') || $p.parent().is('th');
                            }

                            checkboxORradio.call($element, attr.type, css);

                            if (attr.type !== 'checkbox' || css) return;

                            if (ctrl && ctrl.fnCheckedAll && ctrl.fnChecked) {
                                isall ? $element.on('click', ctrl.$cbxAll.push($element) && ctrl.fnCheckedAll) :
                                $element.on('click', { $val: ctrl.bind.call($element, $element.$val = { $index: scope.$index, key: scope.$eval(attr.ngValue), info: scope.$eval(ctrl.key) }) }, ctrl.fnChecked);
                            }
                        }
                    } else element.addClass('form-control');
                }
            };
        }

        var selectDirective = function ($timeout) {
            return {
                restrict: 'E',
                priority: 1,
                link: function (scope, elm, attrs) {
                    var conf = scope.$eval(attrs.conf) || { minimumResultsForSearch: attrs.hasOwnProperty('filter') || Infinity }, time = $timeout(init, 300);

                    attrs.ngModel && scope.$watch(attrs.ngModel, function (current, old) {
                        current && current !== old && !(window.event && window.event.view) && init(time && ($timeout.cancel(time), time = 0))
                    })

                    function init() {
                        elm.css('width', '100%').select2(conf)
                    }
                }
            }
        }

        app.directive({
            input: inputDirective,
            textarea: inputDirective,
            select: selectDirective
        })
    })