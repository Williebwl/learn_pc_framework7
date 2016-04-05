define('core.Service', ['core'],
    function (core) {
        'use strict'

        var $$http = core.$injector.get('$$http');

        function CoreService() {
            var $api = this, fnGetUrl = this.fnGetUrl = fnUrl.bind(this.ControllerName);

            this.get = function (action, config) {
                /// <summary>get请求</summary>
                /// <param name="url" type="String">请求地址</param>
                /// <param name="config" type="json">angular $http 配置信息</param>

                return $$http.get(fnGetUrl(action), config)
            },
            this.post = function (action, data, config) {
                /// <summary>post请求</summary>
                /// <param name="url" type="String">请求地址</param>
                /// <param name="data" type="json">需要提交的数据</param>
                /// <param name="config" type="json">angular $http 配置信息</param>

                return $$http.post(fnGetUrl(action), data, config)
            },
            this.put = function (action, data, config) {
                /// <summary>put请求</summary>
                /// <param name="url" type="String">请求地址</param>
                /// <param name="data" type="json">需要提交的数据</param>
                /// <param name="config" type="json">angular $http 配置信息</param>

                return $$http.put(fnGetUrl(action), data, config)
            },
            this.delete = function (action, config) {
                /// <summary>delete请求</summary>
                /// <param name="url" type="String">请求地址</param>
                /// <param name="config" type="json">angular $http 配置信息</param>

                return $$http.delete(fnGetUrl(action), config)
            },
            this.fnGet = function (id, config) {
                /// <summary>根据id查询对象</summary>
                /// <param name="id" type="Number">数据id</param>

                return $api.get('Get' + (id ? '/' + id : ''), config)
            },
            this.fnGetAll = function (data, config) {
                /// <summary>根据data查询对象</summary>
                /// <param name="data" type="json">数据查询对象</param>

                return $api.get('GetAll', config ? (config.params = data, config) : { params: data })
            },
            this.fnGetPaged = function (data, config) {
                /// <summary>根据data查询对象</summary>
                /// <param name="data" type="json">数据查询对象</param>

                return $api.get('Get', config ? (config.params = data, config) : { params: data })
            },
            this.fnPost = function (data, config) {
                /// <summary>将data添加到数据库</summary>
                /// <param name="data" type="json">数据对象</param>

                return $api.post('Post', data, config)
            },
            this.fnPut = function (id, data, config) {
                /// <summary>根据data修改数据</summary>
                /// <param name="data" type="json">包含数据id以及需要修改的字段，其中id为必须</param>

                return $api.put('Put' + (id ? '/' + id : ''), data, config)
            },
            this.fnDelete = function (id, config) {
                /// <summary>根据id删除数据</summary>
                /// <param name="id" type="Number">数据id</param>

                return $api.delete('Delete' + (id ? '/' + id : ''), config)
            },
            this.fnGetformValidInfo = function (mark) {
                return $$http.get('Core/Form/GetFormValidInfo', { params: { mark: mark } });
            },
            this.fnSequence = function (data) {
                return $api.put('Sequence', data);
            },
            this.fnGetCurrentUser = function () {
                return $api.get('GetCurrentUser')
            }
        }

        CoreService.service = function (recipeName, factoryFunction, ControllerName) {
            /// <summary>创建服务</summary>
            /// <param name="recipeName" type="String">服务名称</param>
            /// <param name="factoryFunction" type="function、Array、String">服务内容或WebApi控制器名称</param>
            /// <param name="ControllerName" type="String">WebApi控制器名称</param>

            var func = core.isArray(factoryFunction) && factoryFunction[factoryFunction.length - 1] || factoryFunction;

            function factoryFunc() {
                return this.ControllerName = ('' + (ControllerName || core.isString(factoryFunction) && factoryFunction || recipeName)).replace(/\./g, '/'),
                    this.constructor.apply(this, arguments),
                    core.isFunction(func) && func.apply(this, arguments)
            }

            factoryFunc.$inject = core.annotate(factoryFunction), factoryFunc.prototype = CoreService.prototype

            //创建服务并返回异步路由容器
            return core.app.service(('' + recipeName).replace(/[\.|\/]/g, '') + 'Service', factoryFunc), CoreService;
        }

        return CoreService.service('core', 'core'),
            CoreService.service('attach', function () {
                var $api = this;
                this.fnGetUploadSrc = function (key) {
                    return $api.$$http.Api + this.fnGetUrl('PostFormData') + '/' + (key || '')
                },
                this.fnGetDownSrc = function (id) {
                    return $api$$http.Api + this.fnGetUrl('Download') + '/' + (id || 'no')
                },
                this.fnGetAttach = function (tableName, tableID, customType, success, error) {
                    $api.$$http.get(this.fnGetUrl('GetAttach'), { params: { tableName: tableName, tableID: tableID, customType: customType } }, success, error)
                },
                this.fnGetAttachInfo = function (ids, success, error) {
                    $api.$$http.get(this.fnGetUrl() + '/' + (ids || ''), success, error)
                },
                this.fnGetAttachInfos = function (tableName, tableID, customType, success, error) {
                    $api.$$http.get(this.fnGetUrl(), { params: { tableName: tableName, tableID: tableID, customType: customType } }, success, error)
                },
                this.fnSaveAttach = function (data, success, error) {
                    $api.$$http.post(this.fnGetUrl('SaveAttach'), data, success, error)
                },
                this.fnDelete = function (ids, success, error) {
                    $api.$$http.delete(this.fnGetUrl('Delete') + '/' + (ids || ''), success, error)
                },
                this.fnDeletes = function (tableName, tableID, customType, success, error) {
                    $api.$$http.delete(this.fnGetUrl('Delete'), { params: { tableName: tableName, tableID: tableID, customType: customType } }, success, error)
                }
            }),
            core.ext(CoreService);

        function fnUrl(action) {
            /// <summary>获取请求地址</summary>
            /// <param name="action" type="String">Web API 控制器中对应的方法名称</param>
            /// <returns type="String">请求地址</returns>

            return (this || '') + (action ? '/' + action : '');
        }
    });