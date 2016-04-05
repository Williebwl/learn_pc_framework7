define('bi.ext', ['page',
    'Core/Directive/ng.bidialog.js',
    'Core/Directive/ng.biinclude.js',
    'Core/Directive/ng.biinclude.js',
    'Core/Directive/ng.route.js',
    'Core/Directive/ng.from.js',
    'Core/Directive/ng.attach.js'],
    function (app) {
        'use strict'

        var ngControllerDirective = function () {
            return {
                restrict: 'A',
                priority: 500,
                link: function (scope, $element, attr) {
                    scope.$element = $element, angular.isFunction(scope.fnInit) && scope.fnInit($element, attr)
                }
            }
        }

        app.directive('ngController', ngControllerDirective)
    });