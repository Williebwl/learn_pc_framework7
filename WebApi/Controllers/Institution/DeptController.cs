using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Data;

    public partial class DeptController
    {
        public virtual IList<SmartTreeVM> GetSmartTree() => GetSmartTreeInfos();

    }
}