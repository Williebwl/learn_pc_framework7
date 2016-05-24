/**********************************************
********     页面内容区域核心组件      ********
***********************************************/
define('core.container', ['core.view', 'evt.page', 'evt.action', 'ext'],
    function (page, pageEvent, actionEvent) {
        'use strict';

        function Page($scope, $service, injection) {
            if (!this || this.constructor === Window) return new Page().super(arguments);

            this.Type = 'core.container';

            this.Super = function ($scope, $service, injection) {
                fnQuery.apply(this, arguments), fnEdit.apply(this, arguments)
            }
        }

        return page.ext(Page);

        function fnQuery($scope, $service) {
            var params = $scope.Params = {},
                laze = { last: 0 },
                $self = this,
                pageConfig = $scope.PageConfig = {
                    pageSelect: 0,
                    onChange: function (ii) {
                        /// <summary>调用查询</summary>
                        /// <param name="i" type="Number">查询标示</param>

                        var active = { laze: laze, active: angular.isNumber(ii) && ii || laze.last };

                        //调用Service.fnGetAll方法查询数据
                        $self.$service.fnGetPaged($self.fnGetPagedParams.call(params, pageConfig, refreshSearchParams))
                                .success($self.fnGetSearchSuccess.bind(active))
                                .error($self.fnGetSearchError.bind(active))
                    }
                },
                refreshSearchParams = {}, lastKey, lastSetTimeout;

            //获取分页参数
            this.fnGetPagedParams = function (pageConfig) {
                page.extend(params, { PageIndex: pageConfig.CurrentPage, PageSize: pageConfig.ItemsPerPage })

                return page.isFunction($self.fnGetSearchParams) && $self.fnGetSearchParams.call(params, pageConfig, refreshSearchParams), this;
            },

            //获取查询参数
            this.fnGetSearchParams = page.noop,

            //查询成功
            this.fnGetSearchSuccess = function (data) { if ($scope.$$destroyed || this.active !== this.laze.last) return; $scope.PageInfo = data; },

            //查询失败
            this.fnGetSearchError = page.noop,

            //显示查询面板
            $scope.fnShowSearch = function ($event, dialog) {
                var $btn = $($event.currentTarget);
                if (typeof ($btn.attr("data-search")) == "undefined") {
                    $btn.attr("data-search", "#" + dialog);
                    $scope.$on(pageEvent.OnInit, function ($scope, id) {
                        if (id == "search")
                            $btn.toggleSearch();
                    });
                    $scope.ShowDialog(dialog);
                } else {
                    $btn.toggleSearch();
                }
            },

            //显示信息面板
            $scope.fnShowSlider = function ($event) {
                if ($($event.target || $event.srcElement).is('i,a,:input')) return;

                $scope.ShowDialog.apply(this, (arguments[0] = 'slider', arguments))
            },

            //即时搜索
            $scope.fnInstantSearch = function (data) {
                /// <summary>搜索框自动调用查询</summary>

                if (lastKey === params.Key) return;

                if (lastSetTimeout) clearTimeout(lastSetTimeout);

                lastSetTimeout = setTimeout(function () {
                    data = data || {};
                    data._lastSearchId = ++laze.last;
                    $scope.fnSearch(data);
                }, 600, params);

                lastKey = params.Key;
            },
            //搜索
            $scope.$on(actionEvent.OnSearch, function (s, e) {
                if ($scope.$$destroyed || $scope.isDisplay === !1 || s.defaultPrevented) return;

                refreshSearchParams[e.origin] = e.data;

                var _lastSearchId = null;
                if (e && e.data && e.data._lastSearchId) {
                    var _lastSearchId = e.data._lastSearchId;
                    delete e.data._lastSearchId;
                }
                pageConfig.onChange.bind(pageConfig)(_lastSearchId);
            })
        }

        function fnEdit($scope, $service) {
            var $self = this;

            $scope.CheckConf = {};
            $scope.View = {};

            //删除
            this.fnDelete = $scope.fnDelete = function (data, api) {
                if (data) {
                    $scope.fnConfirmAction('删除', api || $service.fnDelete, [data])
                        .success(function (success) {
                            if ($scope.$$destroyed) return;

                            $scope.$emit(pageEvent.OnFormDeleted, [data]);
                            $scope.$emit(pageEvent.OnFormSubmited, [data]);
                        }).error(function (error) {
                            if ($scope.$$destroyed) return;

                            $scope.$emit(pageEvent.OnFormDeleteFailed, [data]);
                            $scope.$emit(pageEvent.OnFormSubmitFailed, [data]);
                            $self.errorNotice('操作无法完成，因为' + error.Message);
                        });
                }
                else {
                    $scope.fnBulkAction('删除', $service.fnDelete, function (success, data) {
                        if ($scope.$$destroyed) return;

                        $scope.$emit(pageEvent.OnFormDeleted, data);
                        $scope.$emit(pageEvent.OnFormSubmited, data);
                    }, function (error) {
                        if ($scope.$$destroyed) return;

                        $scope.$emit(pageEvent.OnFormDeleteFailed, data);
                        $scope.$emit(pageEvent.OnFormSubmitFailed, data);
                    });
                }
            }

            //对选中的项目执行批量操作
            $scope.fnBulkAction = function (name, action, success, error) {
                if (!$scope.CheckConf.ids.length) {
                    $self.alert('请选择需要' + name + '的项目！')
                    return {};
                }

                $self.confirm('确定要' + name + '这 ' + $scope.CheckConf.ids.length + ' 项吗？').ok(function () {
                    action($scope.CheckConf.ids.map(function (id) { return id.key; }).join(','))
                        .success(function (e) {
                            if ($scope.$$destroyed) return;

                            $self.successNotice('已完成' + name + '操作。');
                            $scope.fnSearch();
                            if (success) success(e, $scope.CheckConf.ids);
                        })
                        .error(function (e) {
                            if ($scope.$$destroyed) return;

                            $self.errorNotice('操作无法完成，因为' + e.Message);
                            if (error) error(e, $scope.CheckConf.ids);
                        });
                });
            }

            //对选中的项目执行排序操作
            $scope.fnSequence = function () {
                if (!$scope.View.CanSort) {
                    $self.alert('请选择需要排序的项目！');
                    return;
                }

                var infos = ($scope.PageConfig.Items || $scope.View.Items).grepAll(function () { return this.SChanged; }, 1),
                    data = infos.select(function () { return { ID: this.ID, Sequence: this.Sequence } });

                $scope.fnAction('排序', $service.fnSequence, [data]);
            }
        }
    })
