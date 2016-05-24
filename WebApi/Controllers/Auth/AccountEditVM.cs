using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.UI;
    using Institution;
    public class AccountEditVM : ViewModel
    {
        /// <summary>
        /// 通行证
        /// </summary>
        public SYSAccountVM Account { get; set; }

        /// <summary>
        /// 登陆名
        /// </summary>           
        public string LoginName { get; set; }

        /// <summary>
        /// 是否启用
        /// </summary>
        public bool? IsValid { get; set; }

        /// <summary>
        /// 是否密码锁定
        /// </summary>
        public bool? IsLocked { get; set; }

        /// <summary>
        /// 职位
        /// </summary>
        public IList<SYSPositionUserVM> Positions { get; set; }

        /// <summary>
        /// 最后登录时间
        /// </summary>
        public DateTime? LastLoginTime { get; set; }
    }
}