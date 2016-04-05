using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.Data;

    public class AccountPageQuery : PagedQuery
    {
        public long? DeptID { get; set; }

        public int? Status { get; set; }

        public bool? IsLocked { get; set; }

        public string RealName { get; set; }

        public string UserName { get; set; }

        public string Mobile { get; set; }

        public string Email { get; set; }
    }
}