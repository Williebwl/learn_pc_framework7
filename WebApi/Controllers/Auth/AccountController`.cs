using System;
using System.Linq;
using System.Web.Http;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework;
    using BIStudio.Framework.Auth;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using Institution;
    public partial class AccountController
    {
        #region 编辑

        public virtual SYSAccountVM PostAccount([FromBody]AccountEditVM vm)
        {
            this.Validate(vm.Account);

            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                var account = _authorizationService.Add(vm.Account.Map<SYSAccountVM, SYSAccountRegistRequest>());

                vm.Account.ID = account.ID;

                _positionService.PositionLink(new SYSPositionLinkRequest
                {
                    UserID = account.ID,
                    SystemID = account.SystemID,
                    UserName = account.RealName,
                    Positions = vm.Positions.Map<SYSPositionUserVM, SYSPositionUser>().ToArray()
                });

                ctx.Commit();
            }

            return vm.Account;
        }

        public virtual SYSAccountVM PutAccount(long id, [FromBody]AccountEditVM vm)
        {
            SYSAccount account = null;

            this.Validate(vm.Account);

            using (var ctx = BoundedContext.Create())
            {
                this.DependOn(ctx);

                vm.Account.ID = id;

                if ((account = _authorizationService.Modify(vm.Account.Map<SYSAccountVM, SYSAccountRegistRequest>())) == null)
                    AppRuntime.Exception.Create(ExceptionCode.BadRequest, "账号编辑失败");

                _positionService.PositionLink(new SYSPositionLinkRequest
                {
                    UserID = account.ID,
                    SystemID = account.SystemID,
                    UserName = account.RealName,
                    Positions = vm.Positions.Map<SYSPositionUserVM, SYSPositionUser>().ToArray()
                });

                ctx.Commit();
            }

            return vm.Account;
        }

        [HttpPut]
        public virtual bool Logout([FromUri]string ids) => _authorizationService.Disable(ids);

        [HttpPut]
        public virtual bool SetEnable([FromUri]string ids) => _authorizationService.Enable(ids);

        [HttpPut]
        public virtual bool Unlock([FromUri]string ids) => _authorizationService.Unlock(ids);

        public override bool Delete(string id) => _authorizationService.Delete(id);

        #endregion 编辑

    }
}