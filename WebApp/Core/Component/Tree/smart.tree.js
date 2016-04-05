
define('smart.tree', ['page-Route', 'Assets/Js/Plugins/tree.js', 'ext'],
    function (app) {
        'use strict';

        //声明并创建指令逻辑体
        var smartTreeDirectiveLink = function (scope, $element, attr, ctrl) {
            var dataAttr = (dataAttr = (attr.conf || attr.biSmartTree)) ? dataAttr + '.data' : attr.data;

            ctrl.conf = scope.$eval(attr.conf || attr.biSmartTree) || {},
            ctrl.$element = $element,
            scope.$watchCollection(dataAttr, ctrl.fnCreate)
        };

        //声明并创建指令控制器
        var smartTreeController = function ($scope) {
            var self = this;

            this.fnCreate = function (data) {
                data && data.length && (data[0].isexpand = true)

                self.conf.Tree = Array.isArray(data) && !self.conf.isTree ? data.getTree() : data,
                self.$element.empty()

                if (!self.conf.Tree || !self.conf.Tree.length) return;

                self.conf.$tree = self.$element.treeview(self.conf)
            }
        };

        //声明并创建指令主体
        var smartTreeDirective = function () {
            return {
                restrict: 'EA',
                priority: 100,
                controller: smartTreeController,
                link: smartTreeDirectiveLink
            };
        };

        //注册biSmartTree指令
        app.directive('biSmartTree', smartTreeDirective);

        return app;
    });