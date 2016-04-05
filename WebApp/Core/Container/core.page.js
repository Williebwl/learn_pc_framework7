/**************************************
********     页面核心组件      ********
***************************************/
define('core.page', ['core', 'lobibox', 'core.state', 'evt.page', 'evt.action', 'evt.message', 'evt.user', 'evt.attach'], function (core, lobibox, coreState, pageEvent, actionEvent, messageEvent, userEvent, attachEvent) {
    'use strict'

    function Page($view, $service, $scope, injection) {
        if (!this || this.constructor === Window) return new Page().super(arguments);

        var $self = this;

        //设置类型
        var _type = 'core.page';
        Object.defineProperty($self, "Type", {
            get: function () {
                return _type;
            },
            set: function (type) {
                _type = type;
            }
        });


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
                }
            }
        };
        this.Super = function ($view, $service, $scope, injection) {
            injection = core.extend({}, _injection, injection);
            //设置私有属性
            Object.getOwnPropertyNames(injection.privateProps).map(function (propName) {
                !$view.hasOwnProperty(propName) && (propName in $view) && ($view[propName] = injection.privateProps[propName]);
            });
            //向子级容器发布事件
            this.broadcast = function (evtName) {
                return function (data) {
                    $scope.$broadcast(evtName, {
                        origin: $self.Type, data: data || {}
                    })
                };
            }
            //向父级容器发布事件
            this.emit = function (evtName) {
                return function (data) {
                    $scope.$emit(evtName, {
                        origin: $self.Type, data: data || {}
                    })
                };
            }

            //添加
            $view.fnAdd = this.broadcast(actionEvent.OnAdd);

            //修改
            $view.fnUpdate = this.broadcast(actionEvent.OnUpdate);

            //删除
            $view.fnDelete = this.broadcast(actionEvent.OnDelete);

            //操作完成
            $view.fnChanged = this.broadcast(actionEvent.OnChanged);

            //搜索
            $view.fnSearch = this.broadcast(actionEvent.OnSearch);
            
            //保存附件
            this.fnSaveAttach = function (id, success, error) {
                var p = {
                    ID: id, success: success, error: error, sumNumber: 0, sucNumber: 0, errNumber: 0
                };
                $scope.$broadcast(attachEvent.OnSave, p), !p.sumNumber && core.isFunction(p.success) && p.success(id)
            }

            //加载附件
            this.fnLoadAttach = function (id, success, error) {
                var p = {
                    ID: id, success: success, error: error, sumNumber: 0, sucNumber: 0, errNumber: 0
                };
                $scope.$broadcast(attachEvent.OnLoad, p), !p.sumNumber && core.isFunction(p.success) && p.success(id)
            }


            //验证表单
            this.fnFormValidate = function (mark) {
                var s = {
                    IsValid: 1, errorNotice: this.errorNotice.bind(this), mark: mark
                };
                return $scope.$broadcast(pageEvent.OnFormValidate, s), !(coreState.FormState = s.IsValid)
            }

            //表单重置
            this.fnFormReset = function () {
                $scope.$broadcast(pageEvent.OnFormReset, {
                    origin: $self.Type, data: $view.editInfo
                })
            }

            //用户信息变更
            function refreshCurrentUser() {
                $service.fnGetCurrentUser().success(function (d) {
                    $view.$$CurrentUser = $self.CurrentUser = d
                })
            }
            this.fnRefreshCurrentUser = function () {
                $self.$rootScope.$broadcast(userEvent.OnChanged)
            },
            $scope.$on(userEvent.OnChanged, refreshCurrentUser)


            //消息提醒
            var msgs = this.msg = {
                base: lobibox,
                //通知
                notice: function (msg, mode, type) {
                    var deferred = $self.$q.defer(), promise = deferred.promise;
                    return $scope.$emit(type || messageEvent.OnNotice, Page.isObject(msg) ? msg : {
                        msg: msg, mode: mode || 0, deferred: deferred
                    }),
                    promise.ok = promise.pass = function (fn) { return promise.then(function () { fn.apply(this, arguments) }), promise }, promise
                },
                //提醒
                alert: function (msg, type) {
                    var deferred = $self.$q.defer(), promise = deferred.promise;
                    return this.base.alert(type || 'info', Page.isObject(msg) ? msg : {
                        msg: msg,
                        callback: function () {
                            deferred.resolve(arguments)
                        }
                    }),
                    promise.ok = promise.pass = function (fn) { return promise.then(function (arg) { fn.apply(this, arg) }), promise }, promise
                },
                //确认
                confirm: function (msg, title) {
                    var deferred = $self.$q.defer(), promise = deferred.promise;
                    return this.base.confirm(Page.isObject(msg) ? msg : {
                        title: title || '确认信息',
                        msg: msg,
                        callback: function ($this, type) {
                            (type === 'yes' ? deferred.resolve : deferred.reject).call(deferred, arguments)
                        }
                    }),
                    promise.ok = promise.pass = function (fn) { return promise.then(function (arg) { fn.apply(this, arg) }), promise },
                    promise.cancel = function (fn) { return promise.then(null, function (arg) { fn.apply(this, arg) }), promise }, promise
                },
                //消息
                message: function (msg, mode, title, type) {
                    var deferred = $self.$q.defer(), promise = deferred.promise;
                    return $scope.$emit(type || messageEvent.OnTask, Page.isObject(msg) ? ((msg.deferred = deferred), msg) : {
                        msg: msg, mode: mode || 0, title: title || !0, deferred: deferred
                    }),
                    promise.ok = promise.pass = function (fn) { return promise.then(function () { fn.apply(this, arguments) }) },
                    promise.cancel = function (fn) { return promise.then(null, function () { fn.apply(this, arguments) }), promise }, promise
                }
            };

            //通知
            this.notice = msgs.notice.bind(msgs);

            //提醒
            this.alert = msgs.alert.bind(msgs);

            //确认
            this.confirm = msgs.confirm.bind(msgs);

            //消息
            this.message = msgs.message.bind(msgs);

            //操作
            $view.fnAction = function (name, action, args, success, error) {
                action.apply($service, args)
                    .success(function (e) {
                        $self.successNotice('已完成' + name + '操作。');
                        $view.fnSearch();
                        if (success) success(e);
                    })
                    .error(function (e) {
                        $self.errorNotice('操作无法完成，因为' + e.Message);
                        if (error) error(e);
                    });
            }
            $view.fnConfirmAction = function (name, action, args, success, error) {
                $self.confirm('确定要' + name + '此项目吗？').ok(function () {
                    action.apply($service, args)
                        .success(function (e) {
                            $self.successNotice('已完成' + name + '操作。');
                            $view.fnSearch();
                            if (success) success(e);
                        })
                        .error(function (e) {
                            $self.errorNotice('操作无法完成，因为' + e.Message);
                            if (error) error(e);
                        });
                });
            }
        }

        //错误通知
        this.errorNotice = function (msg) {
            return this.msg.notice(msg, 2);
        },

        //警告通知
        this.warningNotice = function (msg) {
            return this.msg.notice(msg, 1);
        },

        //成功通知
        this.successNotice = function (msg) {
            return this.msg.notice(msg, 3);
        }
    }

    return core.ext(Page)
})
