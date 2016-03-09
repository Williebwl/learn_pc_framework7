using System;
using System.Linq;


namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Utils;

    public partial class AccountController
    {
        protected IRepository<SYSAccount> accountBO;
        protected IRepository<SYSPassport> passportBO;
        protected IRepository<SYSToken> tokenBO;

        protected virtual PagedList<AccountVM> GetAccountForPage(AccountPageQuery info)
        {
            var key = info?.Key;
            var status = info?.Status;

            var query = from a in accountBO.Entities
                        join p in passportBO.Entities on a.PassportID equals p.ID
                        where a.SystemID == CFContext.User.SystemID
                        && (key == null || a.UserName.Contains(key) || p.LoginName.Contains(key))
                        && (status == null || (status == (int)AccountStatusEnum.Locked && p.IsLocked == true) || (status == (int)AccountStatusEnum.Disable && p.IsValid != true) || (status == (int)AccountStatusEnum.Valid && p.IsValid == true))
                        orderby a.ID descending
                        select new AccountVM
                        {
                            ID = a.ID,
                            RealName = a.RealName,
                            LoginName = p.LoginName,
                            Email = p.Email,
                            LastLoginTime = p.LastLoginTime,
                            IsValid = p.IsValid,
                        };

            return query.ToPagedList(info);
        }

        protected virtual EditableKeyValuePair<string, int>[] GetStatus()
        {
            return ALEnumDescription.GetFieldTexts(typeof(AccountStatusEnum)).Select(d => new EditableKeyValuePair<string, int>(d.EnumDisplayText, d.EnumValue)).ToArray();
        }

        protected virtual AccountVM Save(AccountVM vm)
        {
            return vm;
        }

        protected virtual AccountVM Save(long id, AccountVM vm)
        {
            return vm;
        }

        protected virtual bool PassportLock(string ids, bool isLocked)
        {
            ids = ids?.Trim(',', ' ');

            if (string.IsNullOrEmpty(ids)) return false;

            var id = ids.Split(',').Select(d => long.Parse(d));
            var now = DateTime.Now;

            var q = from d in accountBO.Entities
                    from b in passportBO.Entities
                    where id.Any(a => a == d.ID)
                    && b.ID == d.PassportID
                    select b;

            var qt = from d in tokenBO.Entities
                     where id.Any(b => b == d.AccountID)
                     && d.ExpiresIn > now
                     select d;

            tokenBO.Modify(qt.With(d => d.ExpiresIn = now).ToArray());

            return !passportBO.Modify(q.With(d => d.IsValid = isLocked).ToArray()).Any();
        }
    }
}