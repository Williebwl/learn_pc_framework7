using System;
using System.Linq;
using System.Web.Http;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Utils;

    public partial class AccountController
    {
        #region 编辑

        public virtual SYSAccountVM PostAccount([FromBody]AccountPageVM vm)
        {
            this.Validate(vm.Account);

            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                var config = ALConfig.DllConfigs["PAAS.App"]["Account"];

                var passport = _authorizationService.PassportRegist(new SYSPassportRegistDTO(vm.Account.UserName, config["DefaultPassword"], config["MailSuffix"]));

                var system = _systemBO.Get(CFContext.User.SystemID);

                vm.Account.SystemID = system.ID;
                vm.Account.SystemName = system.SystemName;
                vm.Account.SystemCode = system.SystemCode;
                vm.Account.UID = passport.ID.ToString();
                vm.Account.Email = passport.Email;

                var account = _authorizationService.AccountRegist(vm.Account.Map<SYSAccountVM, SYSAccountRegistDTO>());

                vm.Account.ID = account.ID;
                vm.Account.Avatar = string.IsNullOrEmpty(vm.Account.RealName?.Trim()) ? string.Empty : ALSpell.GetSpell(vm.Account.RealName.TrimStart()[0]);

                SavePosition(0, vm);

                _authorizationService.PassportLink(new SYSPassportLinkDTO { LoginName = vm.Account.UserName, SystemCode = vm.Account.SystemCode, UID = vm.Account.UID });

                _groupUser.Add(new SYSGroupUser { GroupID = 1, UserId = account.ID });

                ctx.Commit();
            }

            return vm.Account;
        }

        public virtual SYSAccountVM PutAccount(long id, [FromBody]AccountPageVM vm)
        {
            this.Validate(vm.Account);

            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                var q = from d in _passportBO.Entities
                        from b in _accountBO.Entities
                        where b.ID == id
                        && d.ID == b.PassportID
                        select d;

                if (!q.Any())
                {
                    var config = ALConfig.DllConfigs["PAAS.App"]["Account"];

                    vm.Account.UID = (vm.Account.PassportID = _authorizationService.PassportRegist(new SYSPassportRegistDTO(vm.Account.UserName, config["DefaultPassword"], config["MailSuffix"]))?.ID)?.ToString();

                    var system = _systemBO.Get(CFContext.User.SystemID);

                    vm.Account.SystemID = system.ID;
                    vm.Account.SystemName = system.SystemName;
                    vm.Account.SystemCode = system.SystemCode;

                    _authorizationService.PassportLink(new SYSPassportLinkDTO { LoginName = vm.Account.UserName, SystemCode = vm.Account.SystemCode, UID = vm.Account.UID });
                }

                vm.Account.Avatar = string.IsNullOrEmpty(vm.Account.RealName?.Trim()) ? string.Empty : ALSpell.GetSpell(vm.Account.RealName.TrimStart()[0]);

                if (_accountBO.Modify(vm.Account.Map<SYSAccountVM, SYSAccount>()) && SavePosition(id, vm)) ctx.Commit();
                else CFException.Create(ExceptionCode.BadRequest);
            }

            return vm.Account;
        }

        protected virtual bool SavePosition(long id, AccountPageVM vm)
        {
            var result = true;

            if (vm.Positions == null || !vm.Positions.Any()) return result;

            var y = GetPosition(id, vm);

            if (id > 0)
            {
                var x = (from d in _positionBO.Entities
                         where d.UserID == id
                         && d.IsDelete == false
                         select d).ToArray();

                var m = x.Except(y, (d) => d.DeptID).ToArray();

                result = !_positionBO.Remove(m).Any();

                var q = from d in x
                        from b in y
                        where d.DeptID == b.DeptID
                        select new { d, b };

                if (result)
                {
                    result = !_positionBO.Modify(q.Select(d =>
                    {
                        d.d.PositionName = d.b.PositionName;
                        d.d.isMainSuties = d.b.isMainSuties;
                        d.d.IsValid = true;

                        return d.d;
                    }).ToArray()).Any();
                }

                y = y.Except(x, d => d.DeptID).ToArray();
            }

            if (result) result = !_positionBO.Add(y).Any();

            return result;
        }

        protected virtual SYSPosition[] GetPosition(long id, AccountPageVM vm)
        {
            var ids = vm.Positions.Select(d => d.LeaderID).ToArray();

            var q = from d in _accountBO.Entities
                    where ids.Any(b => b == d.ID)
                    select new { d.ID, d.RealName };

            var qt = q.ToArray();

            return vm.Positions.Select(d =>
            {
                var position = d.Map<SYSPositionVM, SYSPosition>();

                position.UserID = vm.Account.ID ?? id;
                position.UserName = vm.Account.RealName;
                position.IsDelete = false;
                position.IsValid = true;

                if (position.LeaderID > 0) position.LeaderName = qt.FirstOrDefault()?.RealName;

                return position;
            }).ToArray();
        }

        [HttpPut]
        public virtual bool Logout([FromUri]string ids) => PassportLock(ids, false);

        [HttpPut]
        public virtual bool SetEnable([FromUri]string ids) => PassportLock(ids, true);

        protected virtual bool PassportLock(string ids, bool isValid)
        {
            var id = ids.Split<long>();
            var now = DateTime.Now;

            var q = from d in _accountBO.Entities
                    from b in _passportBO.Entities
                    where id.Any(a => a == d.ID)
                    && b.ID == d.PassportID
                    select b;

            if (!isValid)
            {
                var qt = from d in _tokenBO.Entities
                         where id.Any(b => b == d.AccountID)
                         && d.ExpiresIn > now
                         select d;

                _tokenBO.Modify(qt.With(d => d.ExpiresIn = now).ToArray());
            }

            return !_passportBO.Modify(q.With(d => d.IsValid = isValid).ToArray()).Any();
        }

        [HttpPut]
        public virtual bool Unlock([FromUri]string ids)
        {
            var id = ALConvert.ToList<long>(ids);
            var q = from d in _accountBO.Entities
                    from b in _passportBO.Entities
                    where id.Any(a => a == d.ID)
                    && b.ID == d.PassportID
                    select b;

            return !_passportBO.Modify(q.With(d => d.UnLock()).ToArray()).Any();
        }

        public override bool Delete(string id)
        {
            var ids = id.Split<long>();

            var result = true;

            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                _positionBO.Remove(d => ids.Any(b => b == d.UserID));
                _groupUser.Remove(d => ids.Any(b => b == d.UserId));
                _tokenBO.Remove(d => ids.Any(b => b == d.AccountID));

                var q = from d in _accountBO.Entities
                        where ids.Any(b => b == d.ID)
                        && d.PassportID > 0
                        select d.PassportID.ToString();

                if (q.Any()) result = _passportBO.Remove(string.Join(",", q.ToArray()));

                if (result && _accountBO.Remove(ids)) { ctx.Commit(); return true; }
            }

            return false;
        }

        #endregion 编辑

    }
}