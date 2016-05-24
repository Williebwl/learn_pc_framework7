using System.Linq;
using System.Web.Http;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Tenant;
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Utils;
    using Institution;
    public partial class AccountController : AppService<SYSAccountVM, AccountPageQuery, SYSAccount>
    {
        protected IRepository<SYSAccount> _accountBO;
        protected IRepository<SYSPassport> _passportBO;
        protected IRepository<SYSPositionUser> _positionUserBO;
        protected IRepository<SYSDept> _deptBO;
        protected IRepository<SYSGroupUser> _groupUser;
        protected IAuthorizationService _authorizationService;
        protected IPositionService _positionService;

        #region 查询

        public virtual PagedList<AccountPagedVM> GetPaged([FromUri]AccountPageQuery info)
        {
            var query = from a in GetAccountsQuery(info)
                        join p in _passportBO.Entities on a.PassportID equals p.ID into b
                        from d in b.DefaultIfEmpty()
                        where a.SystemID == AppRuntime.Context.User.SystemID
                        orderby a.ID descending
                        select new
                        {
                            Account = a,
                            Passport = d,
                            Position = _positionUserBO.Entities.Where(e => e.UserID == a.ID && e.IsDelete == false)
                        };

            return query.ToPagedList(info, t =>
            {
                return new AccountPagedVM
                {
                    Account = t.Account.Map<SYSAccount, SYSAccountVM>(),
                    IsLocked = t.Passport?.IsLocked,
                    IsValid = t.Passport?.IsValid,
                    LoginName = t.Passport?.LoginName,
                    LastLoginTime = t.Passport?.LastLoginTime,
                    Positions = t.Position?.Map<SYSPositionUser, SYSPositionUserVM>()?.ToArray()
                };
            });
        }

        protected virtual IQueryable<SYSAccount> GetAccountsQuery(AccountPageQuery info)
        {
            var q = _accountBO.Entities.Where(d => d.IsDelete == false)
                .WhereIf(info.Key, d => d.UserName.Contains(info.Key) || d.RealName.Contains(info.Key))
                .WhereIf(info.RealName, d => d.RealName.Contains(info.RealName))
                .WhereIf(info.UserName, d => d.UserName.Contains(info.UserName))
                .WhereIf(info.Mobile, d => d.Mobile.Contains(info.Mobile))
                .WhereIf(info.Email, d => d.Email.Contains(info.Email));


            var q1 = _passportBO.Entities;

            if (info.Status == (int)SYSAccountStatus.Disable) q1 = q1.Where(d => d.IsValid != true);
            else q1 = q1.Where(d => d.IsValid == true);

            if (info.IsLocked.HasValue) q1 = q1.Where(d => d.IsLocked == info.IsLocked);

            q = q.Where(d => q1.Any(b => b.ID == d.PassportID));

            if (info.DeptID > 0) q = q.Where(d => _positionUserBO.Entities.Any(b => _deptBO.Entities.Any(a => (a.ID == info.DeptID || a.Path.Contains("," + info.DeptID.ToString() + ",")) && a.ID == b.DeptID) && b.UserID == d.ID && b.IsDelete == false));
            if (info.GroupID > 0) q = q.Where(d => _groupUser.Entities.Any(b => b.GroupID == info.GroupID && b.UserId == d.ID));

            return q;
        }

        public virtual AccountEditVM GetEdit(long id)
        {
            var q1 = from d in _positionUserBO.Entities
                     from b in _deptBO.Entities
                     where d.UserID == id
                     && d.IsDelete == false
                     && b.IsEnabled == 1
                     && b.ID == d.DeptID
                     select d;

            var q = from a in _accountBO.Entities
                    join p in _passportBO.Entities on a.PassportID equals p.ID into b
                    from d in b.DefaultIfEmpty()
                    where a.ID == id
                    select new { Account = a, Passport = d, Positions = q1 };

            return q.FirstOrDefault().Map(d => new AccountEditVM
            {
                Account = d?.Account.Map<SYSAccount, SYSAccountVM>(),
                Positions = d?.Positions.Map<SYSPositionUser, SYSPositionUserVM>().ToArray(),
                IsLocked = d?.Passport.IsLocked,
                IsValid = d?.Passport.IsValid,
                LastLoginTime = d?.Passport.LastLoginTime,
                LoginName = d?.Passport.LoginName
            });
        }

        public virtual string GetLoginName([FromUri]GenerateCodeVM vm)
        {
            if (vm.Code.IsNull() && !vm.Name.IsNull())
            {
                var realName = vm.Name.ToCharArray();

                vm.Code = (ALSpell.GetSpells(vm.Name[0]) + ALSpell.GetSpell(vm.Name.Substring(1))).ToLower();
            }

            var q = from d in _passportBO.Entities
                    from b in _accountBO.Entities
                    where d.LoginName.StartsWith(vm.Name)
                    && b.ID != vm.ID
                    && d.ID == b.PassportID
                    select d.LoginName;

            var names = q.ToArray();

            if (names.Any())
            {
                var i = 0;
                var loginName = vm.Name;
                while (names.Any(d => d.Equals(loginName))) loginName = vm.Name + (++i).ToString();
                vm.Name = loginName;
            }

            return !vm.Name.IsNull() && vm.Name.Length > 20 ? vm.Name.Substring(0, 20) : vm.Name;
        }

        public virtual DeptUserVM[] GetDeptUser([FromUri]DeptUserQuery query)
        {
            var q = from a in _accountBO.Entities()
                    join d in _positionUserBO.Entities().Where(p => p.IsPartTime == false) on a.ID equals d.UserID into b
                    from c in b.DefaultIfEmpty()
                    join e in _deptBO.Entities on c.DeptID equals e.ID
                    where a.SystemID == AppRuntime.Context.User.SystemID
                    orderby e.Path, e.Sequence, a.RealName
                    select new DeptUserVM
                    {
                        SystemID = a.SystemID,
                        SystemName = a.SystemName,
                        UID = a.UID,
                        UserID = a.ID,
                        UserName = a.RealName,
                        DeptCode = e.DeptCode,
                        DeptID = e.ID,
                        DeptName = e.DeptName
                    };

            return q.ToArray();
        }

        #endregion 查询    
    }
}