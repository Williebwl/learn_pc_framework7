using System.Collections.Generic;
using System.Web.Http;
using System.Linq;

namespace WebApi.Controllers.Institution
{
    using Auth;
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Utils;
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
        public override IEnumerable<GroupVM> GetAll([FromUri]GroupQuery info) => GetAllInfos(info);

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
                _groupBO.Get(id).CancelUser(qt.UID);
                return true;
            }

            return false;
        }
        public virtual string GetGroupCode([FromUri]GenerateGroupCodeVM vm)
        {
            if (string.IsNullOrEmpty(vm?.GroupCode) && !string.IsNullOrEmpty(vm.GroupName))
            {
                var realName = vm.GroupName.ToCharArray();

                vm.GroupCode = (ALSpell.GetSpells(vm.GroupName[0]) + ALSpell.GetSpell(vm.GroupName.Substring(1))).ToLower();
            }

            var q = from b in _groupBO.Entities
                    where b.GroupCode.StartsWith(vm.GroupCode)
                    && b.ID != vm.GroupID
                    select b.GroupCode;

            var names = q.ToArray();

            if (names.Any())
            {
                var i = 0;
                var loginName = vm.GroupCode;
                while (names.Any(d => d.Equals(loginName))) loginName = vm.GroupCode + (++i).ToString();
                vm.GroupCode = loginName;
            }

            return !string.IsNullOrEmpty(vm.GroupCode) && vm.GroupCode.Length > 20 ? vm.GroupCode.Substring(0, 20) : vm.GroupCode;
        }

        public PagedList<AccountPagedVM> GetGroupUser([FromUri]AccountPageQuery info)
        {
            var query = from a in _accountBO.Entities()
                        join p in _passportBO.Entities on a.PassportID equals p.ID into b
                        from d in b.DefaultIfEmpty()
                        join gu in _groupUserBO.Entities on a.ID equals gu.UserId
                        where
                            a.SystemID == AppRuntime.Context.User.SystemID &&
                            gu.GroupID == info.GroupID
                        orderby a.ID descending
                        select new
                        {
                            Account = a,
                            Passport = d,
                            Position = _positionUserBO.Entities.Where(e => e.UserID == a.ID && e.IsDelete == false),
                            gu.InputTime,
                        };

            return query.ToPagedList(info, t =>
            {
                return new AccountPagedVM
                {
                    Account = t.Account.Map<SYSAccount, SYSAccountVM>().Apply(item => item.InputTime = t.InputTime),
                    LoginName = t.Passport?.LoginName,
                    Positions = t.Position?.Map<SYSPositionUser, SYSPositionUserVM>()?.ToArray(),
                };
            });
        }
    }
}