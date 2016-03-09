using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.Data;

    public class AccountPageQuery : PagedQuery
    {
        public int? Status { get; set; }
    }
}