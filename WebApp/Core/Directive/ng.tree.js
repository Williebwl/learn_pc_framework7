define(['page', 'ext', 'css!Assets/Css/bitree-metro.css'],
    function (app, ext) {
        'use strict';

        var isFn = angular.isFunction, extend = angular.extend, isNumber = angular.isNumber, noop = angular.noop,
            isObject = angular.isObject, equals = angular.equals, isString = angular.isString,
            defConf = {
                noline: !1,
                single: !1,
                multiple: !1,
                autoExpand: !0,
                nodeTemplate: !1,
                resolve: {
                    nodeClick: noop,
                    nodeChecked: noop,
                    nodeExpand: noop,
                    nodeCollapse: noop,
                    nodeCreate: noop,
                    nodeCreated: noop,
                    nodeExtLink: function (scope, $element, attr, ctrl, $compile, template) {
                        $element.children('a').after($compile(template)(scope))
                    }
                }
            };

        /******************************************** 树指令 开始 *******************************************************/

        var treeDirective = [function () {

            var biTreeController = ['$scope', '$q', function ($scope, $q) {
                var self = this,
                    resolve = this.resolve = {};

                this.fnInit = function () {
                    var conf = this.conf;

                    $scope.node = { children: conf.tree = conf.data.getTree(), fnInitMultiple: noop }

                    conf.fnGetSelectedNodes = function () {
                        return this.data.grepAll(function () { return this.checkstate === 2 }, !0)
                        .map(function (o) { return fnRemoveAttrs(extend({}, o)) })
                    }.bind(conf),

                    conf.fnGetSelectedNode = function () {
                        return fnRemoveAttrs(extend({}, this.data.grep(function () { return this.checkstate === 2 }, !0)))
                    }.bind(conf),

                    conf.fnGetIDs = function () {
                        return this.data.grepAll(function () { return this.checkstate === 2 }, !0).map(function (node) { return node.id || node.ID })
                    }.bind(conf),

                    conf.fnSetIDs = function (ids) {
                        ids = ',' + (Array.isArray(ids) && ids.join(',') || ids || '') + ','
                        this.data.forEach(function (node) {
                            node.checkstate = ids.indexOf(',' + node.id + ',') >= 0 ? 2 : 0, node.fnCheck && node.fnCheck()
                        })
                    }.bind(conf)

                    conf.ids && conf.fnSetIDs(conf.ids)
                }

                this.writeValue = function writeSingleValue(value) {
                    var conf = self.conf, id = isObject(value) && (value.id || value.ID) || value;
                    conf && Array.isArray(conf.data) && conf.data.forEach(function (node) {
                        node.checkstate = id === node.id ? (conf.single && (self.CurrentNode = node), 2) : 0, node.fnCheck && node.fnCheck()
                    }),
                    isObject(value) || self.fnChange()
                }

                this.readValue = function readSingleValue() {
                    return self.conf && Array.isArray(self.conf.data) && fnRemoveAttrs(extend({}, self.conf.data.grep(function () { return this.checkstate === 2 }, !0)))
                }

                //Collapse
                var focusPromises = $q(function (a) { $scope.fnSetCurrentTreeNode = a })

                this.fnFocus = function (fn) { isFn(fn) && focusPromises.then(fn) }

            }];

            return {
                restrict: 'AE',
                priority: 500,
                require: { tree: 'biTree', ngModel: '?ngModel' },
                controller: biTreeController,
                compile: function compile(tElement, tAttrs) {
                    fnInitTemplate.apply(this, arguments)
                    return { pre: treePreLink, post: treePostLink }
                }
            }

            function fnInitTemplate(tElement, tAttrs) {
                tElement.is('ul') ? tElement.attr('bi-tree-nodes', '').addClass('ngtree') : tElement.empty().html('<ul bi-tree-nodes class="ngtree"></ul>')
            }

            function treePreLink(scope, $element, attr, ctrl) {
                var resolve = ctrl.tree.resolve,
                    conf = ctrl.tree.conf = (conf = (conf = scope.$eval(attr.conf) || scope.$eval(attr.biTree) || {}, Array.isArray(conf) ? { data: conf } : conf), extend(resolve, defConf.resolve, conf.resolve), ext.extend(conf, defConf));

                conf.nodeTemplate = scope.$eval(attr.nodetemplate) || conf.nodeTemplate,

                conf.noline = scope.$eval(attr.noline) || conf.noline

                Object.getOwnPropertyNames(defConf.resolve).forEach(function (key) { var fn = attr[key] || attr[key.toLowerCase()]; fn && isFn((fn = scope.$eval(fn))) && (resolve[key] = fn) })

                if (!ctrl.ngModel) return;

                ctrl.tree.fnChange = function (value) {
                    scope.$applyAsync(function () { ctrl.ngModel.$setViewValue(value || ctrl.tree.readValue()) });
                }

                if (attr.multiple || conf.multiple) {

                    conf.single = !(conf.multiple = !0)

                    ctrl.tree.writeValue = function writeMultipleValue(value) {
                        var ids = ',' + (Array.isArray(value) && value.map(function (n) { return isObject(n) && (n.id || n.ID) || n }).join(',') || value || '') + ',';
                        this.conf && Array.isArray(this.conf.data) && this.conf.data.forEach(function (node) {
                            node.checkstate = ids.indexOf(',' + node.id + ',') >= 0 ? 2 : 0, node.fnCheck && node.fnCheck()
                        }),
                        Array.isArray(value) || isObject(value) || ctrl.tree.fnChange()
                    }

                    ctrl.tree.readValue = function readMultipleValue() {
                        return this.conf && Array.isArray(this.conf.data) && this.conf.data.grepAll(function () { return this.checkstate === 2 }, !0).map(function (o) { return fnRemoveAttrs(extend({}, o)) })
                    }

                    //var lastView, lastViewRef = NaN;
                    //scope.$watch(function selectMultipleWatch() {
                    //    if (lastViewRef === ctrl.ngModel.$viewValue && !equals(lastView, ctrl.ngModel.$viewValue)) {
                    //        lastView = shallowCopy(ctrl.ngModel.$viewValue);
                    //        ctrl.ngModel.$render();
                    //    }
                    //    lastViewRef = ctrl.ngModel.$viewValue;
                    //});

                    ctrl.ngModel.$isEmpty = function (value) {
                        return !value || value.length === 0;
                    }
                }
                else if (attr.single) conf.multiple = !(conf.single = !0)
            }

            function treePostLink(scope, $element, attr, ctrl) {
                ctrl.ngModel && (ctrl.ngModel.$render = function () { ctrl.tree.writeValue(ctrl.ngModel.$viewValue); })

                scope.$watch(attr.data || ((attr.conf || attr.biTree || 'treeConf') + '.data'), function (n, o) {
                    ctrl.tree.conf.data = Array.isArray(n) && n || ctrl.tree.conf.data || [],
                    ctrl.tree.fnInit()
                })
            }
        }];

        function fnRemoveAttrs(node) { return isObject(node) && ['children', 'parent', 'fnInitMultiple', 'fnInitSingle'].forEach(function (a) { delete this[a] }, node), node }

        function shallowCopy(src, dst) {
            if (Array.isArray(src)) {
                dst = dst || [];

                for (var i = 0, ii = src.length; i < ii; i++) {
                    dst[i] = src[i];
                }
            } else if (isObject(src)) {
                dst = dst || {};

                for (var key in src) {
                    if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                        dst[key] = src[key];
                    }
                }
            }

            return dst || src;
        }

        app.directive('biTree', treeDirective)

        /******************************************** 树指令 结束 *******************************************************/

        /******************************************** 树节点集合指令 开始 *******************************************************/

        var nodeTemplate = '<li class="treenode" ng-repeat="node in node.children" bi-tree-node>\
                                <span class="button switch"></span>\
                                <a target="_blank" ng-click="fnClickNode($event)" title="{{node.text}}">\
                                    <span class="button"></span>\
                                    <span ng-bind="node.text"></span>\
                                </a>\
                                <ul bi-tree-nodes ng-show="node.isexpand"></ul>\
                            </li>';

        var treeNodesDirective = [function () {

            var treeNodesController = ['$scope', function ($scope) {
                $scope.node && (function (node) {
                    var self = this,
                        $node,
                        $switch,
                        $a,
                        $ico,
                        $child,
                        conf,
                        resolve,
                        hasChildren,
                        lastHasChildren,
                        isLast;

                    node.refresh = function () {
                        fnRefresh(),
                        fnRefreshLine(),
                        lastHasChildren !== hasChildren && (hasChildren ? $switch.on('click', fnExpand) : $switch.off('click', fnExpand), lastHasChildren = hasChildren)
                        return this
                    }

                    this.fnBind = function (cf) {
                        $node = this.node.$element,
                        $switch = $node.children('.switch:first'),
                        $a = $node.children('a'),
                        $ico = $a.children('.button:first'),
                        $child = $node.children('ul[bi-tree-nodes]:first'),
                        conf = cf,
                        resolve = cf.resolve,
                        node.refresh()
                    }

                    $scope.fnExpand = fnExpand

                    function fnExpand(e) {
                        $scope.$applyAsync(function () {
                            var fn = node.isexpand ? resolve.nodeCollapse : resolve.nodeExpand;

                            if (isFn(fn) && fn.call(this, e, node) === false) return;

                            node.isexpand = !node.isexpand

                            fnRefresh()
                        })
                    }

                    function fnRefresh() {
                        hasChildren = !!node.hasChildren || !!(node.children && node.children.length)

                        fnRefreshIco(),
                        fnRefreshExpand()
                    }

                    function fnRefreshExpand() {
                        if (conf.noline) { $switch.removeClass('noline_open noline_close noline_docu').addClass(hasChildren ? node.isexpand ? 'noline_open' : 'noline_close' : 'noline_docu'); return }

                        isLast = $scope.$parent.node.children.length === ($scope.$index + 1);

                        $switch.removeClass('root_open root_close roots_open roots_close center_open center_close bottom_open bottom_close root_docu roots_docu center_docu bottom_docu')

                        if (!node.parent && $scope.$first) $switch.addClass(hasChildren ? isLast ? node.isexpand ? 'root_open' : 'root_close' : node.isexpand ? 'roots_open' : 'roots_close' : isLast ? 'root_docu' : 'roots_docu')
                        else if (isLast) $switch.addClass(hasChildren ? node.isexpand ? 'bottom_open' : 'bottom_close' : 'bottom_docu')
                        else $switch.addClass(hasChildren ? node.isexpand ? 'center_open' : 'center_close' : 'center_docu')
                    }

                    function fnRefreshIco() {
                        $ico.removeClass('ico_open ico_close ico_docu').addClass(hasChildren ? node.isexpand ? 'ico_open' : 'ico_close' : 'ico_docu')
                    }

                    function fnRefreshLine() {
                        conf.noline || isLast || $child.addClass('line')
                    }
                }.bind(this)($scope.node))
            }];

            return {
                restrict: 'A',
                priority: 500,
                template: nodeTemplate,
                require: { tree: '^biTree', nodes: 'biTreeNodes', node: '^?biTreeNode' },
                controller: treeNodesController,
                link: { pre: preLink, post: postLink }
            }

            function preLink(scope, $element, attr, ctrl) {
                scope.layer = isNumber(scope.layer) ? scope.layer + 1 : 0,
                ctrl.nodes.node = ctrl.node,
                ctrl.nodes.tree = ctrl.tree
            }

            function postLink(scope, $element, attr, ctrl) {
                if (!ctrl.node) return;

                ctrl.nodes.fnBind(ctrl.tree.conf)
            }
        }];

        app.directive('biTreeNodes', treeNodesDirective)

        /******************************************** 树节点集合指令 结束 *******************************************************/

        /******************************************** 树节点指令 开始 *******************************************************/

        var treeNodeDirective = ['$compile', function ($compile) {

            var treeNodeController = ['$scope', function ($scope) {
                var self = this,
                    $a,
                    node = $scope.node;

                node.fnInitSingle = fnInitSingle.bind(this)
                node.fnInitMultiple = fnInitMultiple.bind(this)

                this.fnBind = function () {
                    var conf = this.conf;

                    $a = this.$element.children('a:first'),
                    this.$scope = $scope,

                   (conf.single || conf.multiple) &&
                   (this.$element.children('span.switch').after('<span class="button chk"></span>'),
                    conf.single && (node.fnCheck = node.fnInitSingle, fnBindSingle.apply(this, arguments)),
                    conf.multiple && (node.fnCheck = node.fnInitMultiple, fnBindMultiple.apply(this, arguments)))

                    this.tree.fnFocus(function (e) { (isObject(e) && e === node || isNumber(e) && e === node.id) && node.fnFocus() })
                }

                node.addChild = function (node) {
                    node.parent = this,
                    node.pid = this.id,
                    Array.isArray(self.conf.data) && self.conf.data.push(node),
                    (this.children || (this.children = [])).push(node),
                    this.refresh().refreshChild(this.children.length - 2)
                }

                node.removeSelf = function (e) {
                    this.parent.children.remove(this)
                    this.parent.refresh().refreshChild(this.parent.children.length - 1)
                    if (e !== !1 && this === self.tree.currentNode && isFn(this.parent.fnFocus)) this.parent.fnFocus()
                }

                node.empty = function () {
                    Array.isArray(this.children) && (this.children.length = 0),
                    this.refresh()
                }

                node.refreshChild = function (index) {
                    if (this.children.length < index || index < 0) return;
                    var node = Array.isArray(this.children) && this.children[index || 0];
                    node && isFn(node.refresh) && node.refresh()
                    return this
                }

                $scope.fnClickNode = node.fnFocus = fnFocus.bind(this, node)

                node.fnAddCurrent = function () { $a.addClass('curSelectedNode') }
                node.fnRemoveCurrent = function () { $a.removeClass('curSelectedNode') }

                !!node.curSelectedNode && node.fnFocus()
            }];

            return {
                restrict: 'A',
                priority: 500,
                require: { tree: '^biTree', nodes: '^biTreeNodes', node: 'biTreeNode' },
                controller: treeNodeController,
                link: { pre: preLink, post: postLink }
            }

            function preLink(scope, $element, attr, ctrl) {
                var $a = $element.children('a');

                ctrl.node.$element = $element.data('treeNode', scope.node).addClass('level' + scope.layer),
                ctrl.node.nodes = ctrl.nodes,
                ctrl.node.tree = ctrl.tree,
                ctrl.node.conf = ctrl.tree.conf,
                ctrl.node.resolve = ctrl.tree.resolve
            }

            function postLink(scope, $element, attr, ctrl) {
                var nodeTemplate = ctrl.node.conf && ctrl.node.conf.nodeTemplate,
                    nodeExtLink = ctrl.node.resolve && ctrl.node.resolve.nodeExtLink;

                nodeTemplate && $.trim(nodeTemplate) && isFn(nodeExtLink) && nodeExtLink(scope, $element, attr, ctrl, $compile, nodeTemplate),

                ctrl.node.fnBind()
            }
        }];

        app.directive('biTreeNode', treeNodeDirective)

        function fnSetCheckstate(node) { return node.checkstate = node.checkstate === 2 ? 0 : 2, node }

        function fnGetElement() { return this.$element.children('span.chk') }

        /*********************************** 节点文本焦点 开始 ******************************************/

        function fnFocus(node, e) {
            if (!this.tree || this.tree.currentNode === node && e) return;

            if (isFn(this.resolve.nodeClick) && this.resolve.nodeClick.call(this, e, node) === false) return;

            this.conf.autoExpand && (node.isexpand || this.$scope.fnExpand(e))

            node.curSelectedNode = !0,
            this.tree.currentNode && (this.tree.currentNode.curSelectedNode = !1, this.tree.currentNode.fnRemoveCurrent()),
            (this.tree.currentNode = node).fnAddCurrent(),

            (this.conf.single || this.conf.multiple) || this.tree.fnChange && this.tree.fnChange(fnRemoveAttrs(extend({}, node)))
        }

        /*********************************** 节点文本焦点 开始 ******************************************/

        /*********************************** 单选 开始 ******************************************/

        function fnBindSingle() {
            this.$radio = fnGetElement.call(this),
            fnInitSingle.call(this),
            this.$radio.on('click', fnTreeNodeSingleSelect.bind(this))
        }

        function fnTreeNodeSingleSelect() {
            if (isFn(this.resolve.nodeChecked) && this.resolve.nodeChecked.apply(this, arguments) === false) return;

            var last = this.tree.CurrentNode;

            if (last === this.$scope.node) return;

            var can = !last || last.parent !== this.$scope.node.parent;

            last && (fnSetCheckstate(last).fnInitSingle(), can && fnTreeNodeSingleParentSelects.call(last, 0)),
            fnSetCheckstate(this.tree.CurrentNode = this.$scope.node).fnInitSingle(),
            can && fnTreeNodeSingleParentSelects.call(this.$scope.node, 1)

            this.tree.fnChange && this.tree.fnChange(fnRemoveAttrs(extend({}, this.$scope.node)))
        }

        function fnTreeNodeSingleParentSelects(checkstate) {
            var p = this;
            while (p = p.parent) fnTreeNodeSingleParentSelect.call(p, checkstate);
        }

        function fnTreeNodeSingleParentSelect(checkstate) {
            this.checkstate = checkstate, this.fnInitSingle()
        }

        function fnInitSingle() {
            this.$radio.removeClass('radio_true_full radio_true_part radio_false_full')
            switch (this.$scope.node.checkstate) {
                case 1: this.$radio.addClass('radio_true_part'); break;
                case 2: this.$radio.addClass('radio_true_full'); break;
                default: this.$radio.addClass('radio_false_full'); break;
            }
        }

        /*********************************** 单选 结束 ******************************************/

        /*********************************** 多选 开始 ******************************************/

        function fnBindMultiple() {
            this.$checkbox = this.$element.children('.chk'),
            fnInitMultiple.call(this)
            this.$checkbox.on('click', function () {
                if (isFn(this.resolve.nodeChecked) && this.resolve.nodeChecked.apply(this, arguments) === false) return;
                this.$scope.$broadcast('$treeNodeMultipleSelect'),
                fnTreeNodeMultipleParentSelects.call(this)
            }.bind(this))

            this.$scope.$on('$treeNodeMultipleSelect', fnTreeNodeMultipleSelect.bind(this))
        }

        function fnTreeNodeMultipleParentSelects() {
            var p = this.$scope;
            while ((p = p.$parent) && p.node) fnTreeNodeMultipleParentSelect.call(p);

            this.tree.fnChange && this.tree.fnChange()
        }

        function fnTreeNodeMultipleParentSelect() {
            var pnode = this.node, checkstate = fnMultipleCheckedNumber(pnode.children);
            pnode.checkstate = checkstate.full === pnode.children.length ? 2 : checkstate.full > 0 || checkstate.part > 0 ? 1 : 0;
            pnode.fnInitMultiple()
        }

        function fnMultipleCheckedNumber(d) {
            var s = { full: 0, part: 0 };
            return d.forEach(function (n) { switch (n.checkstate) { case 1: this.part++; break; case 2: this.full++; break; } }, s), s
        }

        function fnTreeNodeMultipleSelect(s) {
            var scope = s.targetScope;
            if (scope === s.currentScope) fnSetCheckstate(scope.node), scope.node.fnInitMultiple();
            else s.currentScope.node.checkstate = scope.node.checkstate, s.currentScope.node.fnInitMultiple();
        }

        function fnInitMultiple() {
            this.$checkbox.removeClass('checkbox_true_full checkbox_true_part checkbox_false_full')
            switch (this.$scope.node.checkstate) {
                case 1: this.$checkbox.addClass('checkbox_true_part'); break;
                case 2: this.$checkbox.addClass('checkbox_true_full'); break;
                default: this.$checkbox.addClass('checkbox_false_full'); break;
            }
        }

        /*********************************** 多选 结束 ******************************************/

        /******************************************** 树节点指令 结束 *******************************************************/

    })