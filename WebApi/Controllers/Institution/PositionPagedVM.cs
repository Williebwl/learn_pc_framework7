using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 职位分页对象
    /// </summary>
    public class PositionPagedVM : ViewModel
    {
        public SYSPositionVM Position { get; set; }

        public string PositionName { get; set; }

        public string PositionCode { get; set; }

        public string DeptName { get; set; }

        public string DeptCode { get; set; }
    }
}