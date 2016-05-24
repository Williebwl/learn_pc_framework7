define('ngzTree', ['jquery', 'angular',
    'Assets/Js/Plugins/ztree.min.js',
    //'Assets/Js/Plugins/ztree.excheck.min.js',
    //'Assets/Js/Plugins/ztree.exedit.min.js',
    'css!Assets/Css/ztree-metro.css'],
function () {
    'use strict';
    angular.module('ngzTree', []).directive('zTree', ['$timeout',
      function ($timeout) {
          return {
              restrict: 'A',
              link: function (scope, element, attrs) {
                  $timeout(function () {
                      $.fn.zTree.init(element, scope[attrs.setting], scope[attrs.zNodes]);
                  })
              }
          }
      }
    ])
})
