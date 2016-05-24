define(['core.nav', 'evt.page', 'System/Dept/dept.service.js', 'smart.tree'],
function (core, pageEvent) {
    'use strict'

    core.controller('DeptNavCtrl', function ($scope, institutionDeptService) {
        var page = core($scope, institutionDeptService), depts, last;

        $scope.nodeTemplate = '<span class="treeNodeExt"><b class="fa fa-caret-down"></b><ul><li ng-click="fnCreateDept($event,node)"><i class="fa fa-plus"></i>添加子部门</li><li ng-click="fnUpdateDept($event,node)"><i class="fa fa-edit"></i>修改</li><li ng-click="fnDeleteDept($event,node)"><i class="fa fa-trash"></i>删除</li></ul></span>';

        institutionDeptService.fnGetSmartTree()
                              .success(function (d) {
                                  depts = $scope.deptTree = d,
                                  d.length && (d[0].isexpand = !0,
                                  $scope.fnSelect(d[0], d[0].tag)),
                                  $scope.fnSetCurrentTreeNode(d[0])
                              })
                              .error(function () { $scope.deptTree = [] })




        $scope.checkDept = function (e, dept) {
            $scope.fnSelect(dept, dept.tag)
        }

        $scope.fnCreateDept = function (e, dept) {
            $scope.ShowDialog('add', {}, dept)
        }

        $scope.fnUpdateDept = function (e, dept) {
            $scope.ShowDialog('edit', { ID: (last = dept).id })
        }

        $scope.fnDeleteDept = function (e, dept) {
            page.confirm('确定要删除部门【' + dept.text + '】及其子部门？')
                .pass(function () {
                    institutionDeptService.fnDelete(dept.id)
                                          .success(function (d) { d ? (page.successNotice('删除成功。'), dept.removeSelf()) : page.errorNotice('删除失败！') })
                                          .error(function (d) { page.errorNotice(d.Message || '删除失败！') })
                })


        }

        $scope.$on(pageEvent.OnFormPosted, function (s, e) {
            if (!Array.isArray(depts)) return;

            var parent = depts.grep(function () { return this.id }, e.PostInfo.ParentID);

            if (!parent) return;

            parent.addChild({ id: e.View.ID, text: e.View.DeptName, tag: e.View.DeptName })
        })

        $scope.$on(pageEvent.OnFormPut, function (s, e) {
            if (!Array.isArray(depts)) return;

            if (last.pid === e.PostInfo.ParentID) last.tag = last.text = e.View.DeptName
            else {
                last.removeSelf(!1)

                var parent = depts.grep(function () { return this.id }, e.PostInfo.ParentID);

                if (!parent) return;

                parent.addChild(last)
            }

            last.fnFocus()
        })
    })

})