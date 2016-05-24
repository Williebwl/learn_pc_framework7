using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// 部门职位视图模型
    /// </summary>
    [Mark(Name = "PositionVM")]
    public class SYSPositionVM : ViewModel
    {
        #region Write Model

        /// <summary>
        ///  服务提供商ID
        /// </summary>
        [Display(Name = " 服务提供商ID")]
        public long? SystemID { get; set; }

        /// <summary>
        /// 部门编号
        /// </summary>
        [Display(Name = "部门编号")]
        public long? DeptID { get; set; }

        /// <summary>
        /// 职位名称
        /// </summary>
        [Required, StringLength(100), Display(Name = "职位名称")]
        public string PositionName { get; set; }

        /// <summary>
        /// 职位代码
        /// </summary>
        [Required, StringLength(50), VisibleChar, Display(Name = "职位代码")]
        public string PositionCode { get; set; }

        /// <summary>
        /// 上级职位ID
        /// </summary>
        [Required, Display(Name = "上级职位ID")]
        public long? ParentID { get; set; }

        /// <summary>
        /// 路径
        /// </summary>
        [StringLength(500), VisibleChar, Display(Name = "路径")]
        public string Path { get; set; }

        /// <summary>
        /// 层级 1开始计算
        /// </summary>
        [Display(Name = "层级 1开始计算")]
        public int? Layer { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        [Display(Name = "排序")]
        public int? Sequence { get; set; }

        /// <summary>
        /// 是否有效
        /// </summary>               
        public bool? IsValid { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>               
        public bool? IsDelete { get; set; }

        /// <summary>
        /// InputTime
        /// </summary>                 
        public DateTime? InputTime { get; set; }

        #endregion

        #region Read Model1

        /// <summary>
        /// ID
        /// </summary>         
        public long? ID { get; set; }

        #endregion    
    }
}