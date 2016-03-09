using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;
    using Tenant;
    public class GroupAppVM : ViewModel
    {
        public long? GroupID { get; set; }

        public IList<AppVM> GroupApps { get; set; }

        public IList<AppVM> AllApps { get; set; }
    }
}