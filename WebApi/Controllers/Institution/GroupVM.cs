using System;
using System.Collections.Generic;
using System.Linq;
using BIStudio.Framework.UI;
using BIStudio.Framework.Utils;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Controllers.Institution
{
    /// <summary>
    /// 用户组
    /// </summary>
    [Mark(Name = "GroupVM")]
    public class GroupVM : ViewModel
    {
        /// <summary>
        /// 数据标示
        /// </summary>
        public long? ID { get; set; }

        /// <summary>
        ///  服务提供商ID
        /// </summary>
        [Required, Display(Name = "系统编号")]
        public long? SystemID { get; set; }
        /// <summary>
        ///  服务提供商ID
        /// </summary>
        [Required, Display(Name = "应用编号")]
        public long? AppID { get; set; }
        /// <summary>
        /// 用户组代码
        /// </summary>
        [Required, Display(Name = "角色代码"), StringLength(50)]
        public string GroupCode { get; set; }
        /// <summary>
        /// 用户组名称
        /// </summary>
        [Required, Display(Name = "角色名称"), StringLength(200)]
        public string GroupName { get; set; }
        /// <summary>
        /// 用户组类型
        /// </summary>
        public string GroupType { get; set; }
        /// <summary>
        /// 用户组类型代码
        /// </summary>
        [Display(Name = "角色分组")]
        public long? GroupTypeID { get; set; }
        /// <summary>
        /// 所有者标志
        /// </summary>
        public string GroupFlag { get; set; }
        /// <summary>
        /// 所有者标志代码
        /// </summary>
        public long? GroupFlagID { get; set; }
        /// <summary>
        /// 排序
        /// </summary>
        [Display(Name = "排序")]
        public int? Sequence { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string Remark { get; set; }
        /// <summary>
        /// 创建人
        /// </summary>
        public string Inputer { get; set; }
        /// <summary>
        /// 创建人的ID
        /// </summary>
        public long? InputerID { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? InputTime { get; set; }

        /// <summary>
        /// 用户数量
        /// </summary>
        public int UserCount { get; set; }

        /// <summary>
        /// 是否内置
        /// </summary>
        public bool? IsBuiltin { get; set; }
    }
}