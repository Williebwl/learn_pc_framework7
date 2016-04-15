define('core', ['page-Route', 'ext'],
    function (app, ext) {
        'use strict'

        var Super,
            FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m,
            FN_ARG_SPLIT = /,/,
            FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
            STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

        function Core($view, $service, $scope) {
            if (!this || this.constructor === Window) return new Core($view, $service, $scope);
        }

        return $.extend(Core.fn = Core.prototype, {
            extend: Core.inherit = function (target, data) {
                return $.extend(target.prototype || target, data || Core.fn), target;
            },
            super: function () {
                var suber = this.constructor,
                    arg = (arg = Array.prototype.slice.call(arguments.length === 1 ? arguments[0] : arguments))[2] || !arg[0].$id ? arg : (arg.splice(2, 0, arg[0]), arg),
                    queue = [];
                this.base = this.constructor.prototype,
                this.hasOwnProperty('Super') && queue.push(this)
                do {
                    suber.prototype.hasOwnProperty('Super') && queue.push(suber.prototype)
                } while (suber = suber.super)
                bindPage.apply(this, arg)
                while (suber = queue.pop()) suber.$page = suber.$this = suber.$self = suber.$current = this, suber.Super.apply(this, arg)
                return this
            }
        }) && $.extend(Core, {
            ext: function (target, data) {
                target.prototype = new this(),
                target.prototype.base = target.prototype,
                target.super = this,
                target.prototype.constructor = target
                return (target.Super = this), $.extend(Core.inherit(target).fn = target.prototype, data), $.extend(target, Core);
            },
            controller: function (recipeName, factoryFunction) {
                /// <summary>创建控制器</summary>
                /// <param name="recipeName" type="String">控制器名称不需要些Ctrl后缀程序会自动添加</param>
                /// <param name="factoryFunction" type="function、Array">控制器内容</param>

                //创建控制器并返回异步路由容器
                return app.controller(recipeName, factoryFunction);
            },
            forEach: angular.forEach,
            copy: angular.copy,
            equals: angular.equals,
            fromJson: angular.fromJson,
            isArray: angular.isArray,
            isDate: angular.isDate,
            isDefined: angular.isDefined,
            isElement: angular.isElement,
            isFunction: angular.isFunction,
            isNumber: angular.isNumber,
            isObject: angular.isObject,
            isPrototypeOf: angular.isPrototypeOf,
            isString: angular.isString,
            isUndefined: angular.isUndefined,
            noop: angular.noop,
            toJson: angular.toJson,
            extend: angular.extend,
            bindThis: bindThis,
            app: app,
            $injector: app.$injector || $(document.documentElement).data('$injector'),
            annotate: annotate
        });

        function annotate(fn) {
            var $inject,
                fnText,
                argDecl,
                last;

            if (Core.isFunction(fn)) {
                if (!($inject = fn.$inject)) {
                    $inject = [];
                    if (fn.length) {
                        fnText = fn.toString().replace(STRIP_COMMENTS, '');
                        argDecl = fnText.match(FN_ARGS);
                        Core.forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
                            arg.replace(FN_ARG, function (all, underscore, name) {
                                $inject.push(name);
                            });
                        });
                    }
                    fn.$inject = $inject;
                }
            } else if (Core.isArray(fn) && fn.length) {
                last = fn.length - 1;
                $inject = fn.slice(0, last);
            }

            return $inject;
        }

        function bindPage($view, $service, $scope) {
            this.$view = $view,
              this.$service = bindService.call({ $service: $service }, $service),
              this.$scope = $scope
        }

        function bindService($service, thisArg) {
            thisArg = thisArg || $service
            return Object.keys($service).forEach(function (key) {
                var fn = $service[key]; angular.isFunction(fn) && (this[key] = fn.bind(thisArg))
            }, this),
            this
        }

        function bindThis(source, thisArg) {
            thisArg = thisArg || source
            return Object.keys(source).forEach(function (key) {
                var fn = source[key]; angular.isFunction(fn) && (source[key] = fn.bind(thisArg))
            }), source
        }
    })