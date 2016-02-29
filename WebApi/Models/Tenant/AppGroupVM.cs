using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models.Tenant
{
    using BIStudio.Framework.UI;
    using Institution;
    public class AppGroupVM : ViewModel
    {
        public long? AppID { get; set; }

        public IList<GroupVM> AppGroups { get; set; }

        public IList<GroupVM> AllGroups { get; set; }
    }
}