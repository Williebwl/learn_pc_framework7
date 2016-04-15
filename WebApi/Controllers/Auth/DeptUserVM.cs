using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 部门用户
    /// </summary>
    public class DeptUserVM : ViewModel
    {
        /// <summary>
        /// 服务提供商ID
        /// </summary>
        public long? SystemID { get; set; }

        /// <summary>
        /// 服务提供商名称
        /// </summary>
        public string SystemName { get; set; }

        /// <summary>
        /// 外部系统用户编码
        /// </summary>
        public string UID { get; set; }

        public long? UserID { get; set; }

        public string UserName { get; set; }

        public long? DeptID { get; set; }

        public string DeptCode { get; set; }

        public string DeptName { get; set; }

    }
}