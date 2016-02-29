using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.Data;
    using Models.Institution;
    public class DeptController : ApplicationService<DeptVM, PagedQuery, SYSDept>
    {
        public DeptController() : base("Name", "ShortName") { }
    }
}