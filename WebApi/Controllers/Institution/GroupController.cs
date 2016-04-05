using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Institution;
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

        public virtual IList<GroupVM> GetByUser(long id)
        {
            var q = from d in _groupUserBO.Entities
                    from b in _groupBO.Entities
                    where d.UserId == id && b.ID == d.GroupID
                    orderby b.Sequence
                    select b;

            return q.Map<SYSGroup, GroupVM>().ToArray();
        }

        /// <summary>
        /// 保存用户组、APP关联关系
        /// </summary>
        /// <param name="infos">用户组、APP关联关系</param>
        /// <returns>是否保存成功</returns>
        [HttpPut]
        public virtual bool SaveAppAccess(long id, [FromBody]AppAccessVM[] infos) => SaveAppAccessInfos(id, infos);

        [HttpPut]
        public virtual bool CancelUserGroup(long id, [FromUri]long userId)
        {
            var q = from d in _groupUserBO.Entities
                    from b in _accountBO.Entities
                    where d.GroupID == id
                    && b.ID == userId
                    && b.ID == d.UserId
                    select new { d, b.SystemID, b.UID };

            var qt = q.FirstOrDefault();

            if (qt != null && _groupUserBO.Remove(qt.d))
            {
                qt.d.ApplyEvent(new SYSGroupUserCanceledEvent { GroupID = id, SystemID = qt.SystemID, UID = qt.UID });
                return true;
            }

            return false;
        }
    }
}