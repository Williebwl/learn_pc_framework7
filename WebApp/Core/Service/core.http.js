define('core.http', ['angular'],
    function (angular) {
        'use strict'

        var api = location.host === 'localhost:1496' ? '//localhost:2266/' : '';

        angular.module('biHttp', ['ng']).provider('$$http', function () {

            this.$get = ['$http', function ($http) {
                function $$http(requestConfig) {
                    return $http.defaults.headers.common.Authorization = sessionStorage.Token, $http(requestConfig)
                }

                $$http.Api = api,
                createShortMethods('get', 'delete', 'head', 'jsonp'),
                createShortMethodsWithData('post', 'put', 'patch')

                return $$http

                function createShortMethods(names) {
                    angular.forEach(arguments, function (name) {
                        $$http[name] = function (url, config, ctrl) {
                            return $$http(angular.extend({}, config || {}, {
                                method: name,
                                url: fnUrl(url, config, ctrl)
                            })).error(fnError);
                        };
                    });
                }

                function createShortMethodsWithData(name) {
                    angular.forEach(arguments, function (name) {
                        $$http[name] = function (url, data, config, ctrl) {
                            return $$http(angular.extend({}, config || {}, {
                                method: name,
                                url: fnUrl(url, config, ctrl),
                                data: data
                            })).error(fnError);
                        };
                    });
                }
            }]
        })

        return api

        function fnUrl(url, config, ctrl) {
            return api + (ctrl || config && config.ctrl || '') + url
        }

        function fnError(d, error) {
            if (location.pathname.toLowerCase() !== '/login.html' && error === 401) {
                sessionStorage.referrer = location.href,
                delete sessionStorage.Token,
                location.href = "login.html"
            }
        }
    })