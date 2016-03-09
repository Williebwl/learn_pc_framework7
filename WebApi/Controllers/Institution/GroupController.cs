using System.Collections.Generic;
using System.Web.Http;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Data;
    using Tenant;
    /// <summary>
    /// 用户组
    /// </summary>
    public partial class GroupController
    {
        /// <summary>
        /// 获取用户分组
        /// </summary>
        /// <param name="info">查询参数</param>
        /// <returns>用户分组</returns>
        public override IEnumerable<GroupVM> GetAll(Query info) => GetAllInfos(info);

        /// <summary>
        /// 获取用户分组与APP关联信息
        /// </summary>
        /// <param name="id">分组id</param>
        /// <returns>用户分组与APP关联信息</returns>
        public virtual GroupAppVM GetAppAccess(long id) => GetAppAccessInfos(id);

        /// <summary>
        /// 保存用户组、APP关联关系
        /// </summary>
        /// <param name="infos">用户组、APP关联关系</param>
        /// <returns>是否保存成功</returns>
        [HttpPut]
        public virtual bool SaveAppAccess(long id, [FromBody]AppAccessVM[] infos) => SaveAppAccessInfos(id, infos);
    }
}