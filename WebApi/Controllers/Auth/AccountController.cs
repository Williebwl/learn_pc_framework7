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

    public partial class AccountController : ApplicationService<SYSAccountVM, AccountPageQuery, SYSAccount>
    {
        protected IRepository<SYSAccount> _accountBO;
        protected IRepository<SYSPassport> _passportBO;
        protected IRepository<SYSToken> _tokenBO;
        protected IRepository<SYSSystem> _systemBO;
        protected IRepository<SYSPosition> _positionBO;
        protected IRepository<SYSDept> _deptBO;
        protected IRepository<SYSGroupUser> _groupUser;
        protected IAuthorizationService _authorizationService;

        #region 查询

        public virtual PagedList<AccountPageVM> GetPaged([FromUri]AccountPageQuery info)
        {
            var query = from a in GetAccountsQuery(info)
                        join p in _passportBO.Entities on a.PassportID equals p.ID into b
                        from d in b.DefaultIfEmpty()
                        where a.SystemID == CFContext.User.SystemID
                        orderby a.ID descending
                        select new { Account = a, Passport = d, Position = _positionBO.Entities.Where(e => e.UserID == a.ID && e.IsDelete == false) };

            return query.ToPagedList(info, t =>
            {
                return new AccountPageVM
                {
                    Account = t.Account.Map<SYSAccount, SYSAccountVM>(),
                    IsLocked = t.Passport.IsLocked,
                    IsValid = t.Passport.IsValid,
                    LoginName = t.Passport.LoginName,
                    LastLoginTime = t.Passport.LastLoginTime,
                    Positions = t.Position.Map<SYSPosition, SYSPositionVM>().ToArray()
                };
            });
        }

        protected virtual IQueryable<SYSAccount> GetAccountsQuery(AccountPageQuery info)
        {
            var q = _accountBO.Entities
                .WhereIf(info.Key, d => d.UserName.Contains(info.Key) || d.RealName.Contains(info.Key))
                .WhereIf(info.RealName, d => d.RealName.Contains(info.RealName))
                .WhereIf(info.UserName, d => d.UserName.Contains(info.UserName))
                .WhereIf(info.Mobile, d => d.Mobile.Contains(info.Mobile))
                .WhereIf(info.Email, d => d.Email.Contains(info.Email));

            if (info.Status.HasValue || info.IsLocked.HasValue)
            {
                var q1 = _passportBO.Entities;

                if (info.Status == (int)SYSAccountStatus.Disable) q1 = q1.Where(d => d.IsValid != true);
                else if (info.Status == (int)SYSAccountStatus.Valid) q1 = q1.Where(d => d.IsValid == true);

                if (info.IsLocked.HasValue) q1 = q1.Where(d => d.IsLocked == info.IsLocked);

                q = q.Where(d => q1.Any(b => b.ID == d.PassportID));
            }

            if (info.DeptID > 0) q = q.Where(d => _positionBO.Entities.Any(b => _deptBO.Entities.Any(a => (a.ID == info.DeptID || a.Path.Contains("," + info.DeptID.ToString() + ",")) && a.ID == b.DeptID) && b.UserID == d.ID && b.IsDelete == false));

            return q;
        }

        public virtual AccountPageVM GetEdit(long id)
        {
            var q1 = from d in _positionBO.Entities
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

            return q.FirstOrDefault().With(d => new AccountPageVM
            {
                Account = d?.Account.Map<SYSAccount, SYSAccountVM>(),
                Positions = d?.Positions.Map<SYSPosition, SYSPositionVM>().ToArray(),
                IsLocked = d?.Passport.IsLocked,
                IsValid = d?.Passport.IsValid,
                LastLoginTime = d?.Passport.LastLoginTime,
                LoginName = d?.Passport.LoginName
            });
        }

        public virtual string GetLoginName([FromUri]GenerateLoginNameVM vm)
        {
            if (string.IsNullOrEmpty(vm?.LoginName) && !string.IsNullOrEmpty(vm.RealName))
            {
                var realName = vm.RealName.ToCharArray();

                vm.LoginName = (ALSpell.GetSpells(vm.RealName[0]) + ALSpell.GetSpell(vm.RealName.Substring(1))).ToLower();
            }

            var q = from d in _passportBO.Entities
                    from b in _accountBO.Entities
                    where d.LoginName.StartsWith(vm.LoginName)
                    && b.ID != vm.AccountID
                    && d.ID == b.PassportID
                    select d.LoginName;

            var names = q.ToArray();

            if (names.Any())
            {
                var i = 0;
                var loginName = vm.LoginName;
                while (names.Any(d => d.Equals(loginName))) loginName = vm.LoginName + (++i).ToString();
                vm.LoginName = loginName;
            }

            return !string.IsNullOrEmpty(vm.LoginName) && vm.LoginName.Length > 20 ? vm.LoginName.Substring(0, 20) : vm.LoginName;
        }

        #endregion 查询    
    }
}