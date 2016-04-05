using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Tenant;
    using BIStudio.Framework.UI;
    using Tenant;

    public partial class GroupController : ApplicationService<GroupVM, Query, SYSGroup>
    {
        public GroupController() : base("GroupName") { }

        protected IRepository<SYSAccount> _accountBO;
        protected IRepository<SYSGroup> _groupBO;
        protected IRepository<SYSGroupUser> _groupUserBO;
        protected IRepository<SYSAppAccess> _appAccessBO;
        protected IRepository<SYSApp> _appBO;
        protected IRepository<SYSMenu> _menuBO;

        #region 查询

        public virtual IEnumerable<GroupVM> GetAllInfos(Query info)
        {
            var q = from d in _groupBO.Entities
                    orderby d.GroupTypeID, d.Sequence
                    select new GroupVM
                    {
                        ID = d.ID,
                        SystemID = d.SystemID,
                        AppID = d.AppID,
                        GroupCode = d.GroupCode,
                        GroupName = d.GroupName,
                        GroupType = d.GroupType,
                        GroupTypeID = d.GroupTypeID,
                        GroupFlag = d.GroupFlag,
                        GroupFlagID = d.GroupFlagID,
                        UserCount = (from b in _groupUserBO.Entities where b.GroupID == d.ID select b.GroupID).Count()
                    };

            return q.ToArray();
        }

        protected virtual GroupAppVM GetAppAccessInfos(long groupID)
        {
            var q1 = from d in _appBO.Entities
                     where !_appAccessBO.Entities.Any(b => d.ID == b.AppID && b.GroupID == groupID)
                     select d;

            var q2 = from d in _appBO.Entities
                     where _appAccessBO.Entities.Any(b => d.ID == b.AppID && b.GroupID == groupID)
                     select d;

            var vm = new GroupAppVM { GroupID = groupID, AllApps = q1.Map<SYSApp, AppVM>().ToArray(), GroupApps = q2.Map<SYSApp, AppVM>().ToArray() };

            var q3 = from d in _menuBO.Entities
                     where d.Layer == 0
                     select new { d.AppID, d.Icon };

            var menuInfos = q3.ToArray();

            Action<AppVM> forEach = (d) => { d.Icon = menuInfos.FirstOrDefault(b => b.AppID == d.ID)?.Icon; };

            vm.AllApps.ForEach(forEach);
            vm.GroupApps.ForEach(forEach);

            return vm;
        }

        #endregion 查询

        protected virtual bool SaveAppAccessInfos(long groupId, AppAccessVM[] infos)
        {
            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                _appAccessBO.Remove(d => d.GroupID == groupId);

                if (infos != null && _appAccessBO.Add(infos.Map<AppAccessVM, SYSAppAccess>().ToArray()).Any())
                {
                    ctx.Rollback();

                    return false;
                }
            }

            return true;
        }
    }
}