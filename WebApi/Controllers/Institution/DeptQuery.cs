using BIStudio.Framework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    public class DeptQuery : Query
    {
        public long? CurrentID { get; set; }
    }
}