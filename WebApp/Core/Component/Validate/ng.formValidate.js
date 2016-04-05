define('formValidate', ['page-Route', 'evt.page', 'core.Service'], function (app, pageEvent) {
    'use strict';

    var biFormValidateDirective =
        function (coreService) {
            var biFormValidateDirectiveLink = function (scope, $element, attr, ctrl) {
                var formValidate = {
                    mark: $.trim(attr.biFormValidate) || $.trim(attr.mark) || ctrl.$name,
                    form: $element.attr('novalidate', ''), $form: ctrl, tag: [],
                    $scope: scope
                }

                if (!formValidate.mark || !formValidate.form.is('form') || !formValidate.$form) return;

                coreService.fnGetformValidInfo(formValidate.mark)
                           .success(function (vm) {
                               if (!vm || !$.isPlainObject(vm) || $.isEmptyObject(vm)) return;
                               biFormValidate.bindVM((formValidate.VMInfo = vm) && formValidate);
                           }).error(function () {
                               console.log("【" + formValidate.mark + "】验证信息获取失败！")
                           });

                scope.$on(pageEvent.OnFormReset, function (s, e) { biFormValidate.$formValidateRest(formValidate) })

                scope.$on(pageEvent.OnFormValidate, function (s, e) { e.IsValid && (!e.mark || e.mark === formValidate.mark || Array.isArray(e.mark) && $.inArray(formValidate.mark, e.mark) >= 0) && biFormValidate.$formValidate(formValidate, e) })
            };

            return {
                restrict: 'AC',
                priority: 9,
                require: '?form',
                link: biFormValidateDirectiveLink
            };
        };

    app.directive('biFormValidate', biFormValidateDirective);

    function inputType($input, key) {
        return $input.attr('type', key);
    };

    function validate(key, set, isValid) {
        //if (this.$ctrl.$pristine) return;

        var k = key + isValid;

        if (this.lastValid != k) {
            isValid ? delete this.errorMsg[key] : this.errorMsg[key] = set.msg || set;
            this.lastValid = k;
            $.isEmptyObject(this.errorMsg) ? this.parent().removeClass('has-error') : this.parent().addClass('has-error');
        }

        return isValid;
    }

    var biFormValidate = {
        bindVM: function (fv) {
            var vms = fv.VMInfo;
            fv.form.on('focusout', ':input', { formValidate: fv }, this.$formOut);

            for (var vm in vms) this.bindVMFields(vms[vm], (fv.vm = vm) && fv);

            delete fv.vm, 'fd' in fv && delete fv.fd;
        },
        bindVMFields: function (vm, fv) {
            if (!vm || !fv) return;
            for (var fd in vm) this.bindVMField(vm[fd], (fv.fd = fd) && fv)
        },
        bindVMField: function (vs, fv) {
            if (!vs || !fv) return;

            var mark = fv.vm + '_' + fv.fd, $input = $('#' + fv.fd + ',#' + mark, fv.form), $label = $('label[for=\'' + fv.fd + '\']', fv.form);

            if (!$input.is(':input')) $input = $(':input[name=\'' + fv.fd + '\'],:input[name=\'' + mark + '\']', fv.form);

            if (!$input.length) return;

            $input.$ctrl = $input.get(0).$ctrl = fv.$ctrl = fv.$form[fv.fd] || fv.$form[mark],
            $input.$formValidate = $input.get(0).$formValidate = fv.$ctrl.$formValidate = fv,

            $input.$ctrl.$input = $input, $input.errorMsg = {}, $input.Validates = {}

            this.bindVMFieldValidate($input[pageEvent.OnFormValidate] = $input.get(0)[pageEvent.OnFormValidate] = vs, $input, $label),

            fv.tag.push($input)
        },
        bindVMFieldValidate: function (vs, $input, $label) {
            for (var key in vs) {
                var keys = key.toLowerCase();
                if (keys == "required")
                    $label.addClass("required-label");
                if (keys in this.validates && !(keys in $input.$ctrl.$validators)) $input.Validates[keys] = this.validates[keys]($input, keys, vs[key], $input.$ctrl, $input.$formValidate)
                else console.warn('暂不支持【' + key + '】类型的验证.');
            }
        },
        validates: {
            required: function ($input, key, set, ctrl) {

                $input.prop('required', true)

                return ctrl.$validators.required = function (modelValue, viewValue) { return validate.call($input, key, set, !ctrl.$isEmpty(viewValue)) }
            },
            regularexpression: function () {
                this.pattern.apply(this, (arguments[1] = 'pattern') && arguments)
            },
            emailaddress: function ($input, key, set, ctrl) {
                this.pattern.apply(this, (arguments[1] = 'emailaddress') && (arguments[2].pattern = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/) && arguments)
            },
            phone: function () {
                this.pattern.apply(this, (arguments[1] = 'phone') && (arguments[2].pattern = /^[\d-]+$/) && arguments)
            },
            telphone: function () {
                this.pattern.apply(this, (arguments[1] = 'telphone') && (arguments[2].pattern = /^(\d{3,4}-)?\d{6,8}$/) && arguments)
            },
            mobilephone: function () {
                this.pattern.apply(this, (arguments[1] = 'mobilephone') && (arguments[2].pattern = /^1\d{10}$/) && arguments)
            },
            identifier: function () {
                this.pattern.apply(this, (arguments[1] = 'identifier') && (arguments[2].pattern = /^[a-zA-Z][a-zA-Z0-9_]*$/) && arguments)
            },
            visiblechar: function () {
                this.pattern.apply(this, (arguments[1] = 'visiblechar') && (arguments[2].pattern = /^[\u0020-\u007e]+$/) && arguments)
            },
            pattern: function ($input, key, set, ctrl) {
                var regex = (regex = set.pattern || set.value || set) && angular.isString(regex) && regex.length > 0 && new RegExp(regex)||set.pattern, regexp;

                if (!regex && !regex.test) return;

                regexp = regex || undefined;

                ctrl.$validators.pattern = function (modelValue, viewValue) {
                    return validate.call($input, key, set, ctrl.$isEmpty(viewValue) || angular.isUndefined(regexp) || regexp.test(viewValue));
                };

                return $input.attr('pattern', regexp);
            },
            stringlength: function () {
                this.minlength.apply(this, (arguments[1] = 'minlength') && arguments), this.maxlength.apply(this, (arguments[1] = 'maxlength') && arguments)
            },
            maxlength: function ($input, key, set, ctrl) {
                var maxlength = parseInt(set.length || set.maximumlength || set, 10);

                if (isNaN(maxlength)) return;

                $input.attr('maxlength', maxlength);

                return ctrl.$validators.maxlength = function (modelValue, viewValue) { return validate.call($input, key, set, maxlength < 0 || ctrl.$isEmpty(viewValue) || viewValue.length <= maxlength) }
            },
            minlength: function ($input, key, set, ctrl) {
                var minlength = parseInt(set.length || set.minimumlength || set, 10);

                if (isNaN(minlength)) return;

                $input.attr('minlength', minlength);

                return ctrl.$validators.minlength = function (modelValue, viewValue) { return validate.call($input, key, set, ctrl.$isEmpty(viewValue) || viewValue.length >= minlength) }
            },
            range: function () {
                this.min.apply(this, (arguments[1] = 'min') && arguments), this.max.apply(this, (arguments[1] = 'max') && arguments)
            },
            max: function ($input, key, set, ctrl) {
                var max = parseFloat(set.maximum || set, 10);

                if (isNaN(max)) return;

                $input.attr('max', max);

                return ctrl.$validators.max = function (value) { return validate.call($input, key, set, ctrl.$isEmpty(value) || angular.isUndefined(max) || value <= max) }
            },
            min: function ($input, key, set, ctrl) {
                var min = parseFloat(set.minimum || set, 10);

                if (isNaN(min)) return;

                $input.attr('min', min);

                return ctrl.$validators.min = function (value) { return validate.call($input, key, set, ctrl.$isEmpty(value) || angular.isUndefined(min) || value >= min) }
            },
            display: function ($input, key, set, ctrl) {
                $input.display = set
            },
            number: inputType,
            email: inputType,
            date: inputType,
            'datetime-local': inputType,
            time: inputType,
            checkbox: inputType,
            week: inputType,
            month: inputType,
            url: inputType,
            radio: inputType
        },
        $formIn: function (e) {
            //console.log(e)
        },
        $formOut: function (e) {
            if (!this.$ctrl) return;

            var $input = $(this);

            if (!$input.is('.form-control')) $input.addClass('form-control');
            if ((this.fnRequired && !$input.val()) && !this.$ctrl.$valid) $input.parent().addClass('has-error');
        },
        $formValidate: function (fv, e) {
            e.IsValid = fv.$form.$valid;
            var msg = "";
            fv.tag.forEach(function ($input) {
                if (!$input.is('.form-control')) $input.addClass('form-control');
                for (var key in $input.Validates) {
                    var func = $input.Validates[key], val = $input.val();
                    $.isFunction(func) && func(val, val)
                }

                for (var key in $input.errorMsg) {
                    e.IsValid = 0, msg += "·" + $input.errorMsg[key] + "<br />";
                }
            })
            if (msg)
                e.errorNotice(msg);
        },
        formDefSeting: { $valid: false, $invalid: false, $pristine: true, $dirty: false },
        $formValidateRest: function (fv) {
            $.extend(fv.$form, this.formDefSeting);
            fv.$scope.$valid = false;
            fv.tag.forEach(function ($input) { $input.parent().removeClass('has-error'); $.extend($input.$ctrl, biFormValidate.formDefSeting); });
        }
    };
});