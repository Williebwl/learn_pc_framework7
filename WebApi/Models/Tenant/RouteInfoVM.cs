﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models.Tenant
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 路由
    /// </summary>
    public class RouteInfoVM : ViewModel
    {
        /// <summary>
        /// 默认路由
        /// </summary>
        public string RedirectTo { get; set; }

        /// <summary>
        /// 路由
        /// </summary>
        public IList<RouteVM> Routes { get; set; }
    }
}