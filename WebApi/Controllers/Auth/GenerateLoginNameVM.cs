using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.UI;

    public class GenerateLoginNameVM : ViewModel
    {
        public long? AccountID { get; set; }

        public string RealName { get; set; }

        public string LoginName { get; set; }
    }
}