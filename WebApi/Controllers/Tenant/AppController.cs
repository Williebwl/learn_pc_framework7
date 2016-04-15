﻿using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace WebApi.Controllers.Tenant
{
    using BIStudio.Framework;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Tenant;
    using BIStudio.Framework.UI;

    /// <summary>
    /// 应用
    /// </summary>
    [RoutePrefix("api/App")]
    public partial class AppController : AppService
    {
        #region 查询

        /// <summary>
        /// 查询指定应用信息
        /// </summary>
        /// <param name="id">应用id</param>
        /// <returns>应用信息</returns>
        public virtual AppVM Get(long id) => GetInfo(id);

        /// <summary>
        /// 获取所有应用信息
        /// </summary>
        /// <returns>所有应用信息</returns>
        [HttpGet]
        public virtual IList<AppVM> GetAll([FromUri] Query query) => GetInfos(query);

        /// <summary>
        /// 获取需要编辑的应用信息
        /// </summary>
        /// <param name="id">应用id</param>
        /// <returns>应用信息</returns>
        [HttpGet]
        public virtual AppEditVM GetEditInfo(long id) => GetEditVM(id);

        /// <summary>
        /// 获取app用户分组信息
        /// </summary>
        /// <param name="id">appid</param>
        /// <returns>app用户分组信息</returns>
        [HttpGet]
        public virtual AppGroupVM GetAppAccess(long id) => GetAppAccessInfos(id);

        public virtual IList<AppVM> GetByUser(long id)
        {
            var q = from d in _groupUserBO.Entities
                    from b in _appAccessBO.Entities
                    from a in _appBO.Entities
                    where d.UserId == id
                    && a.IsValid == true
                    && b.GroupID == d.GroupID
                    && a.ID == b.AppID
                    orderby a.Sequence
                    select a;

            return q.Map<SYSApp, AppVM>().ToArray();
        }

        #endregion 查询

        #region 编辑

        /// <summary>
        /// 添加应用
        /// </summary>
        /// <param name="vm">应用信息</param>
        /// <returns>应用id</returns>
        [HttpPost]
        public virtual long Post([FromBody]AppEditVM vm) => SaveVM(vm);

        /// <summary>
        /// 修改应用信息
        /// </summary>
        /// <param name="vm">应用信息</param>
        /// <returns>应用id</returns>
        [HttpPut]
        public virtual long Put([FromBody]AppEditVM vm) => SaveVM(vm);

        /// <summary>
        /// 设置应用状态
        /// </summary>
        /// <param name="id">应用id</param>
        /// <param name="status">状态值</param>
        /// <returns>是否成功</returns>
        [HttpPut]
        public virtual bool SetStatus(long id, [FromUri]bool status) => _appBO.Modify(new SYSApp { ID = id, IsValid = status });

        /// <summary>
        /// 取消用户App
        /// </summary>
        /// <param name="id">appID</param>
        /// <param name="userId">用户id</param>
        /// <returns>是否成功</returns>
        [HttpPut]
        public virtual bool CancelUserApp(long id, [FromUri]long userId)
        {

            return false;
        }

        #endregion 编辑
    }
}