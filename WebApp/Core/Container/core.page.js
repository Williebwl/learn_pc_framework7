/**************************************
********     页面核心组件      ********
***************************************/
define('core.page', ['core', 'lobibox', 'core.state', 'evt.page', 'evt.action', 'evt.message', 'evt.user', 'evt.attach'],
    function (core, lobibox, coreState, pageEvent, actionEvent, messageEvent, userEvent, attachEvent) {
        'use strict'

        function Page($view, $service, $scope, injection) {
            if (!this || this.constructor === Window) return new Page().super(arguments);

            var $self = this;

            this.Type = 'core.page',

            //页面状态
            this.PageState = coreState;

            this.$rootScope = core.$injector.get('$rootScope');

            this.$q = core.$injector.get('$q');

            //页面表单状态
            coreState.FormState = !0;

            //等待对象
            this.Promises = {};

            var _injection = {
                privateProps: {
                    Params: {},
                    CheckConf: {
                        ids: []
                    },
                    View: {
                        CanSort: true
                    }
                }
            };

            this.Super = function ($view, $service, $scope, injection) {
                var $current = this;

                injection = core.extend({}, _injection, injection);

                //设置私有属性
                Object.getOwnPropertyNames(injection.privateProps).map(function (propName) {
                    !$view.hasOwnProperty(propName) && (propName in $view) && ($view[propName] = injection.privateProps[propName]);
                });

                //向子级容器发布事件
                this.broadcast = fnBroadcast.bind(this),

                //向父级容器发布事件
                this.emit = fnEmit.bind(this),

                //
                this.fnBindBroadcast = fnBindBroadcast.bind(this),

                //
                this.fnBindEmit = fnBindEmit.bind(this),

                //添加
                this.fnAdd = $view.fnAdd = this.fnBindBroadcast(actionEvent.OnAdd);

                //修改
                this.fnUpdate = $view.fnUpdate = this.fnBindBroadcast(actionEvent.OnUpdate);

                //删除
                this.fnDelete = $view.fnDelete = this.fnBindBroadcast(actionEvent.OnDelete);

                //搜索
                this.fnSearch = $view.fnSearch = this.fnBindBroadcast(actionEvent.OnSearch);

                //搜索对象
                $view.Search = {
                    LastActive: null,
                    Active: null,
                    NavName: null
                };
                $view.$on(actionEvent.OnSelect, function ($s, active, navName) {
                    $view.Search.Active = active.data, $view.Search.LastActive = $view.Search.Active, $view.Search.NavName = navName;
                });

                //保存附件
                this.fnSaveAttach = fnBindAttach.call(this, attachEvent.OnSave),

                //加载附件
                this.fnLoadAttach = fnBindAttach.call(this, attachEvent.OnLoad),

                //验证表单
                this.fnFormValidate = function (mark) {
                    var s = { IsValid: 1, errorNotice: this.errorNotice, mark: mark };
                    return $scope.$broadcast(pageEvent.OnFormValidate, s), coreState.FormState = s.IsValid, s.promise
                }

                //表单重置
                this.fnFormReset = function () {
                    $scope.$broadcast(pageEvent.OnFormReset, {
                        origin: $current.Type, data: $view.editInfo
                    })
                }

                //用户信息变更
                function refreshCurrentUser() {
                    $service.fnGetCurrentUser().success(function (d) {
                        $view.$$CurrentUser = $current.CurrentUser = d
                    })
                }
                this.fnRefreshCurrentUser = function () {
                    $current.$rootScope.$broadcast(userEvent.OnChange)
                },
                $scope.$on(userEvent.OnChange, refreshCurrentUser)



                //操作
                this.fnAction = $view.fnAction = function (name, action, args, success, error) {
                    action.apply($service, args)
                        .success(function (e) {
                            $current.successNotice('已完成' + name + '操作。');
                            $view.fnSearch();
                            if (success) success(e);
                        })
                        .error(function (e) {
                            $current.errorNotice('操作无法完成，因为' + e.Message);
                            if (error) error(e);
                        });
                }

                this.fnConfirmAction = $view.fnConfirmAction = function (name, action, args, success, error) {
                    $current.confirm('确定要' + name + '此项目吗？').ok(function () {
                        action.apply($service, args)
                            .success(function (e) {
                                $current.successNotice('已完成' + name + '操作。');
                                $view.fnSearch();
                                if (success) success(e);
                            })
                            .error(function (e) {
                                $current.errorNotice('操作无法完成，因为' + e.Message);
                                if (error) error(e);
                            });
                    });
                }

                this.fnDelete = $view.fnDelete = function (data) {
                    if (data) {
                        $view.fnConfirmAction('删除', $service.fnDelete, [data], function (success) {
                            $scope.$emit(pageEvent.OnFormDeleted, [data]);
                            $scope.$emit(pageEvent.OnFormSubmited, [data]);
                        }, function (error) {
                            $scope.$emit(pageEvent.OnFormDeleteFailed, [data]);
                            $scope.$emit(pageEvent.OnFormSubmitFailed, [data]);
                        });
                    }
                }


            }

            fnBindMsg.call(this)
        }

        return core.ext(Page);

        function sliceArgs(args, startIndex, endIndex) {
            return Array.prototype.slice.call(args, startIndex || 0, endIndex);
        }

        /*****************  消息发送 Start  ********************/

        function fnBroadcast() { this.$scope.$broadcast.apply(this.$scope, arguments) }

        function fnEmit() { this.$scope.$emit.apply(this.$scope, arguments) }

        function fnBindBroadcast(evtName) {
            return function (data) {
                var arg = sliceArgs(arguments);
                !(data && data.origin) && (arg.unshift({ origin: this.Type, data: data || {} })),
                arg.unshift(evtName),
                this.broadcast.apply(this, arg)
            }.bind(this)
        }

        function fnBindEmit(evtName) {
            return function (data) {
                var arg = sliceArgs(arguments);
                !(data && data.origin) && (arg.unshift({ origin: this.Type, data: data || {} })),
                arg.unshift(evtName),
                this.emit.apply(this, arg)
            }.bind(this)
        }

        /*****************  消息发送 End    ********************/

        /*****************    附件 Start    ********************/

        function fnBindAttach(evtName) {
            return function (id) {
                var promise = this.$q(function (a, b) {
                    var params = { ID: id, Promise: {}, sumNumber: 0, sucNumber: 0, errNumber: 0 };
                    this.broadcast(evtName, params),
                    this.$q.all(params.Promise).then(a.bind(this, params), b.bind(this))
                }.bind(this))
                return promise.success = function (fn) { return promise.then(function (arg) { fn.apply(this, Array.isArray(arg) ? arg : arguments) }), promise },
                    promise.error = function (fn) { return promise.then(null, function (arg) { fn.apply(this, Array.isArray(arg) ? arg : arguments) }), promise }, promise
            }.bind(this)
        }

        /*****************    附件 End      ********************/

        /*****************  消息通知 Start  ********************/

        function fnBindMsg() {
            core.extend(this, core.bindThis(this.msg = {
                base: lobibox,
                //通知
                notice: fnNotice,
                //提醒
                alert: fnAlert,
                //确认
                confirm: fnConfirm,
                //消息
                message: fnMessage,
                //错误通知
                errorNotice: function (msg) {
                    return this.notice(msg, 2);
                },
                //警告通知
                warningNotice: function (msg) {
                    return this.notice(msg, 1);
                },
                //成功通知
                successNotice: function (msg) {
                    return this.notice(msg, 3);
                }
            }, this))
        }

        function fnNotice(msg, mode, type) {
            var promise = this.$q(function (a, b) {
                this.$rootScope.$emit(type || messageEvent.OnNotice, Page.isObject(msg) ? msg : {
                    msg: msg, mode: mode || 0, success: a, error: b
                })
            }.bind(this));
            return promise.ok = promise.pass = function (fn) { return promise.then(function () { fn.apply(this, arguments) }), promise }, promise
        }

        function fnAlert(msg, type) {
            var promise = this.$q(function (a) {
                this.msg.base.alert(type || 'info', Page.isObject(msg) ? msg : {
                    msg: msg,
                    callback: a
                })
            }.bind(this));
            return promise.ok = promise.pass = function (fn) { return promise.then(function (arg) { fn.apply(this, Array.isArray(arg) ? arg : arguments) }), promise }, promise
        }

        function fnConfirm(msg, title) {
            var promise = this.$q(function (a, b) {
                this.msg.base.confirm(Page.isObject(msg) ? msg : {
                    title: title || '确认信息',
                    msg: msg,
                    callback: function ($this, type) {
                        (type === 'yes' ? a : b)(arguments)
                    }
                })
            }.bind(this));
            return promise.ok = promise.pass = function (fn) { return promise.then(function (arg) { fn.apply(this, Array.isArray(arg) ? arg : arguments) }), promise },
            promise.cancel = function (fn) { return promise.then(null, function (arg) { fn.apply(this, Array.isArray(arg) ? arg : arguments) }), promise }, promise
        }

        function fnMessage(msg, mode, title, type) {
            var promise = this.$q(function (a, b) {
                this.$rootScope.$emit(type || messageEvent.OnTask, Page.isObject(msg) ? ((msg.success = a, msg.error = b), msg) : {
                    msg: msg, mode: mode || 0, title: title || !0, success: a, error: b
                })
            }.bind(this));
            return promise.ok = promise.pass = function (fn) { return promise.then(function () { fn.apply(this, arguments) }) },
             promise.cancel = function (fn) { return promise.then(null, function () { fn.apply(this, arguments) }), promise }, promise
        }

        /*****************  消息通知 End  **********************/

    })
