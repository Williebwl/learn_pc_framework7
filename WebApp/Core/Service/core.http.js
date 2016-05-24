define('core.http', ['angular'],
    function (angular) {
        'use strict'

        var api = location.host === 'localhost:6696' && '//localhost:2206/' || location.host === 'localhost:8000' && '//192.168.1.246:88/bis7/' || '';

        angular.module('biHttp', ['ng']).provider('$$http', function () {

            this.$get = ['$http', function ($http) {
                function $$http(requestConfig) {
                    return $http.defaults.headers.common.Authorization = window.sessionStorage.Token || window.localStorage.Token, $http(requestConfig)
                }

                $$http.Api = api,
                $$http.fnLogout = fnLogout,
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
            if (!window.login && error === 401) fnLogout()
        }

        function fnLogout() {
            window.sessionStorage.referrer = window.location.href,
            delete window.sessionStorage.Token,
            delete window.localStorage.Token,
            window.location.href = "login.html"
        }
    })