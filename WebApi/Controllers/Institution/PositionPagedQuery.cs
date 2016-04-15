using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Data;

    public class PositionPagedQuery : PagedQuery
    {
        public long? DeptID { get; set; }

        public long? CurrentID { get; set; }
    }
}