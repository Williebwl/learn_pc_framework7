﻿using System.Collections.Generic;
using System.Linq;
using BIStudio.Framework;
using BIStudio.Framework.Domain;
using BIStudio.Framework.Institution;
using BIStudio.Framework.Tenant;
using BIStudio.Framework.UI;
using WebApi.Controllers.Institution;
using BIStudio.Framework.Data;

namespace WebApi.Controllers.Tenant
{
    public partial class AppController : AppService
    {
        protected IRepository<SYSApp> _appBO;
        protected IRepository<SYSMenu> _menuBO;
        protected IRepository<SYSAppAccess> _appAccessBO;
        protected IRepository<SYSGroup> _groupBO;
        protected IRepository<SYSGroupUser> _groupUserBO;

        protected IAppMgrService _appService;

        #region 查询

        protected virtual AppVM GetInfo(long id)
        {
            var q = from d in _appBO.Entities
                    where d.ID == id
                    select d;

            return q.Single().Map<SYSApp, AppVM>();
        }

        protected virtual IList<AppVM> GetInfos(Query query)
        {
            IQueryable<SYSApp> q = from d in _appBO.Entities
                    orderby !d.IsBuiltIn, d.AppTypeID, d.Sequence
                    select d;

            q = q.WhereIf(query?.Key, item => item.AppName.Contains(query.Key) || item.AppCode.Contains(query.Key));

            return q.Map<SYSApp, AppVM>().ToArray();
        }

        protected virtual AppEditVM GetEditVM(long id)
        {
            var vm = new AppEditVM();

            var appq = from d in _appBO.Entities
                       where d.ID == id
                       select d;

            vm.App = appq.Single().Map<SYSApp, AppVM>();

            var menuq = from d in _menuBO.Entities
                        where d.AppID == id && d.Layer == 0
                        select d;

            vm.Menu = menuq.SingleOrDefault().Map<SYSMenu, MenuVM>();

            var appAccessq = from d in _appAccessBO.Entities
                             from b in _groupBO.Entities
                             where d.AppID == id && b.AppID == id && b.ID == d.GroupID
                             select new AppAccessVM { ID = d.ID, AppID = id, GroupID = d.GroupID, GroupCode = b.GroupCode, GroupName = b.GroupName };

            vm.AppGroups = appAccessq.ToList();

            return vm;
        }

        protected virtual AppGroupVM GetAppAccessInfos(long appID)
        {
            var q1 = from d in _groupBO.Entities
                     where !_appAccessBO.Entities.Any(b => d.ID == b.GroupID && b.AppID == appID)
                     select d;

            var q2 = from d in _groupBO.Entities
                     where _appAccessBO.Entities.Any(b => d.ID == b.GroupID && b.AppID == appID)
                     select d;


            return new AppGroupVM
            {
                AppID = appID,
                AllGroups = q1.Map<SYSGroup, GroupVM>().ToArray(),
                AppGroups = q2.Map<SYSGroup, GroupVM>().ToArray()
            };
        }

        #endregion 查询

        #region 保存

        protected virtual long SaveVM(AppEditVM vm)
        {
            var dto = vm.Map<AppEditVM, SYSAppRegistRequest>();

            return _appService.SaveApp(dto) ? dto.App.ID.Value : 0;
        }

        #endregion 保存
    }
}