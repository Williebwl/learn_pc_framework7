/*
  定义一个require模块,模块名称为 paging
  该模块依赖page、angular。

  （require资料参考地址：http://requirejs.cn/；
    angular资料参考地址：http://192.168.0.246:88/Angular/docs）

  日期：2015-08-20
*/
define('paging', ['page', 'ext'],
    function (app, ext) {
        'use strict';

        /// <field type="json">分页默认配置信息</field>
        var defConf = { pageSelect: 1, pageTurning: 1, CurrentPage: 1, TotalItems: 0, ItemsPerPage: 15, inputValue: 1, umpPageNum: 1, sFirst: "首页", sLast: "尾页", sNext: "下一页", sPrevious: "上一页", auto: !1 };

        var biPaginationTemplate = '<div><div ng-if="!conf.TotalItems" style="background-color: #F4F4F4;text-align:center;padding:15px;">没有相关数据</div>\
                                       <div  ng-if="conf.TotalItems" class="table-paging clearfix">\
                                        <div class="page-select pull-left" ng-if="conf.pageSelect">\
                                            <span>\
                                                每页显示\
                                                <select class="number-select" ng-model="conf.ItemsPerPage" \
                                                        ng-options="option for option in conf.perPageOptions " ng-change="PerPageChange($event)"></select> 条\
                                            </span>\
                                            <span>共<span class="total" ng-bind="conf.TotalItems"></span>条</span>\
                                            <span>当前第<input type="text" class="number-input" ng-model="conf.jumpPageNum" ng-change="jumpToPage($event)"> 页</span>\
                                        </div>\
                                        <ul class="pagination pagination-sm pull-right" ng-if="conf.pageTurning">\
                                            <li ng-class="{disabled: conf.CurrentPage <= 1}" ng-click="changeCurrentPage(1)"><a href="javascript:;" ng-bind="conf.sFirst">首页</a></li>\
                                            <li ng-class="{disabled: conf.CurrentPage <= 1}" ng-click="prevPage()"><a href="javascript:;" ng-bind="conf.sPrevious">上一页</a></li>\
                                            <li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.CurrentPage, disabled:conf.CurrentPage == conf.TotalPages&&conf.CurrentPage==1,separate: item == \'...\'}"\
                                                ng-click="changeCurrentPage(item)">\
                                                <a href="javascript:;" ng-bind="item"></a>\
                                            </li>\
                                            <li ng-class="{disabled: conf.CurrentPage == conf.TotalPages}" ng-click="nextPage()"><a href="javascript:;" ng-bind="conf.sNext">下一页</a></li>\
                                            <li ng-class="{disabled: conf.CurrentPage == conf.TotalPages}" ng-click="changeCurrentPage(conf.TotalPages)"><a href="javascript:;" ng-bind="conf.sLast">尾页</a></li>\
                                        </ul>\
                                    </div></div>';

        //控制器
        var biPaginationCtrl = function ($scope) {
            var conf;

            if (conf = $scope.conf) ext.extend(conf, defConf);
            else conf = $scope.conf = defConf;

            conf.Ctrl = this, conf.perPageOptions = [];

            for (var i = conf.ItemsPerPage = conf.ItemsPerPage || 15, s = i, l = i * 6; i <= l; i += s) conf.perPageOptions.push(i);

            // 定义分页的长度必须为奇数 (default:9)
            conf.pagesLength = parseInt(conf.pagesLength, 10) || 9;

            if (conf.pagesLength % 2 === 0) {
                // 如果不是奇数的时候处理一下
                conf.pagesLength = conf.pagesLength - 1;
            }

            // pageList数组
            this.getPagination = function getPagination() {
                // conf.CurrentPage
                conf.CurrentPage = parseInt(conf.CurrentPage, 10) || 1;

                // conf.TotalItems
                conf.TotalItems = parseInt(conf.TotalItems, 10) || 0;

                // TotalPages
                conf.TotalPages = Math.ceil(conf.TotalItems / conf.ItemsPerPage) || 1;

                // jumpPageNum
                conf.jumpPageNum = conf.CurrentPage = conf.CurrentPage < 1 ? 1 : conf.CurrentPage > conf.TotalPages ? conf.TotalPages : conf.CurrentPage;

                if ((conf.CurrentPage == 1 || this.change) && conf.TotalPages <= conf.pagesLength) {
                    $scope.pageList = [];
                    for (i = 1, l = conf.TotalPages ; i <= l; i++) $scope.pageList.push(i);
                }
                else if (conf.TotalPages > conf.pagesLength) {
                    var c = conf.pagesLength, offset = (c - 1) / 2, a = conf.CurrentPage, b = conf.TotalPages, isLast = a == b;
                    $scope.pageList = [];

                    if (a > offset + 1) $scope.pageList.push('...');

                    for (var i = (i = (i = a - offset) < 1 ? 1 : i), l = (l = i + c - 1) > b && (i = (i = b - c + 1) < 1 ? 1 : i) ? b : l; i <= l; i++) $scope.pageList.push(i);

                    if (l < b) $scope.pageList.push('...');
                }

                this.change = false;
            }

            this.pagingChanged = function pagingChanged(pageInfo) {
                if (pageInfo) {
                    pageInfo.ck = false;
                    conf.TotalItems = pageInfo.TotalItems;
                    conf.Items = pageInfo.Items;
                }

                $scope.$parent.$broadcast(($scope.conf.id || '') + 'PagingChanged', conf);
            }

            // prevPage
            this.prevPage = $scope.prevPage = function () {
                if (conf.CurrentPage > 1) {
                    conf.CurrentPage -= 1;
                }
            }

            this.nextPage = $scope.nextPage = function () {
                if (conf.CurrentPage < conf.TotalPages) {
                    conf.CurrentPage += 1;
                }
            }

            // 变更当前页
            this.changeCurrentPage = $scope.changeCurrentPage = function (item) {
                conf.CurrentPage = parseInt(item) || conf.CurrentPage;
            }

            // 跳转页
            this.jumpToPage = $scope.jumpToPage = function () {
                conf.CurrentPage = conf.jumpPageNum = parseInt(conf.jumpPageNum) || conf.CurrentPage;
            }
        }

        //Link函数
        var biPaginationLink = function (scope, element, attrs, ctrl) {
            var conf = scope.conf;

            scope.PerPageChange = function () {
                ctrl.change = true;
            }

            scope.$watch(function () {
                return Math.ceil(conf.TotalItems / conf.ItemsPerPage) || 1;
            }, function () { ctrl.change = true; })

            scope.$watch(function () {
                return conf.CurrentPage + ' ' + conf.TotalItems + ' ' + conf.ItemsPerPage;
            }, $.proxy(ctrl.getPagination, ctrl));

            scope.$parent.$watch('PageInfo', ctrl.pagingChanged);
            scope.$parent.$watch('infos.PageInfo', ctrl.pagingChanged);

            scope.$watch(function () {
                return conf.CurrentPage + ' ' + conf.ItemsPerPage;
            }, function () {
                scope.$parent.$broadcast((conf.id || '') + 'PagingChange', conf);

                if (typeof conf.onChange === 'function' && (conf.auto || !(conf.auto = !0))) conf.onChange()
            });
        }

        var biPaginationDirective = function () {
            /// <summary>创建分页指令</summary>
            /// <returns type="json">分页指令配置信息（分页显示以及分页处理逻辑）</returns>

            return {
                restrict: 'EA',
                template: biPaginationTemplate,
                replace: true,
                scope: {
                    conf: '='
                },
                controller: biPaginationCtrl,
                link: biPaginationLink
            };
        };

        /*
          创建指令并将其命名为 biPagination
        */
        app.directive('biPagination', biPaginationDirective);
    });