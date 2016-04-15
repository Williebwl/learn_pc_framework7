define(['core.nav', 'evt.page', 'System/Dept/dept.service.js', 'smart.tree'],
function (core, pageEvent) {
    'use strict'

    core.controller('DeptNavCtrl', function ($scope, institutionDeptService) {
        var page = core($scope, institutionDeptService),
        treeConf = $scope.TreeConf = {
            onnodeclick: function (dept) { $scope.fnSelect(dept, dept.tag) }
        };

        LoadDept()

        $scope.$on(pageEvent.OnFormPosted, LoadDept),
        $scope.$on(pageEvent.OnFormPut, LoadDept),

        $scope.$element.on('click', '.deptTree .fa-edit', function () { $scope.ShowDialog('edit', { ID: GetDept.call(this).id }) })
                       .on('click', '.deptTree .fa-trash', function () {
                           var dept = GetDept.call(this)

                           page.confirm('确定要删除部门【' + dept.text + '】及其子部门？')
                               .pass(function () {
                                   institutionDeptService.fnDelete(dept.id)
                                                         .success(function (d) { d ? (page.successNotice('删除成功。'), LoadDept()) : page.errorNotice('删除失败！') })
                                                         .error(function () { page.errorNotice('删除失败！') })
                               })
                       })

        function GetDept() {
            var dept;

            if (!Array.isArray(treeConf.data)) return;

            return treeConf.data.grep(function () { return this.id; }, (dept = $(this).closest('.bbit-tree-node-el').attr('id')) && dept.substr(dept.lastIndexOf('_') + 1))
        }

        function LoadDept() {
            institutionDeptService.fnGetSmartTree()
                            .success(function (d) { treeConf.data = d, $scope.fnSelect(d[0], d[0].tag) })
                            .error(function () { treeConf.data = [] })
        }
    })

})