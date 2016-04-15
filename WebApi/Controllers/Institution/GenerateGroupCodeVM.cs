using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;

    public class GenerateGroupCodeVM : ViewModel
    {
        public long? GroupID { get; set; }

        public string GroupName { get; set; }

        public string GroupCode { get; set; }
    }
}