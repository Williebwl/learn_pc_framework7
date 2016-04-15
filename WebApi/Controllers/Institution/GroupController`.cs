using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.Controllers.Institution
{
    using System.Web.Http;
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Tenant;
    using BIStudio.Framework.UI;
    using Tenant;
    using BIStudio.Framework.Utils;
    public partial class GroupController : AppService<GroupVM, GroupQuery, SYSGroup>
    {
        public GroupController() : base("GroupName") { }

        protected IRepository<SYSAccount> _accountBO;
        protected IRepository<SYSGroup> _groupBO;
        protected IRepository<SYSGroupUser> _groupUserBO;
        protected IRepository<SYSAppAccess> _appAccessBO;
        protected IRepository<SYSApp> _appBO;
        protected IRepository<SYSMenu> _menuBO;
        protected IRepository<SYSPositionUser> _positionUserBO;
        protected IRepository<SYSPassport> _passportBO;

        #region 查询

        public virtual IEnumerable<GroupVM> GetAllInfos(GroupQuery info)
        {
            var q = from d in _groupBO.Entities
                    orderby d.AppID, d.GroupFlagID, !d.IsBuiltin, d.Sequence
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
                        UserCount = (from b in _groupUserBO.Entities where b.GroupID == d.ID select b.GroupID).Count(),
                        IsBuiltin = d.IsBuiltin,
                    };
            q = q.WhereIf(info?.AppID, item => item.AppID == info.AppID)
                .WhereIf(info?.Key, item => item.GroupName.Contains(info.Key) || item.GroupCode.Contains(info.Key));
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

        public override GroupVM Post([FromBody] GroupVM vm)
        {
            this.GetCurrentUser().Apply(u =>
            {
                vm.SystemID = u.SystemID;
                vm.AppID = vm.AppID ?? 1;
                vm.GroupType = vm.GroupTypeID.HasValue ? ALEnumAttribute.GetDescription((SYSGroupType)vm.GroupTypeID) : null;
                vm.GroupFlagID = vm.GroupFlagID ?? 1;
                vm.GroupFlag = vm.GroupFlagID.HasValue ? ALEnumAttribute.GetDescription((SYSGroupFlag)vm.GroupFlagID) : null;
                vm.IsBuiltin = vm.IsBuiltin ?? false;
                vm.Sequence = vm.Sequence ?? 0;
            });
            return base.Post(vm);
        }
    }
}