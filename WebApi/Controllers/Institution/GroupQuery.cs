using BIStudio.Framework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    public class GroupQuery : Query
    {
        /// <summary>
        /// 角色所属应用
        /// </summary>
        public long? AppID { get; set; }
    }
}