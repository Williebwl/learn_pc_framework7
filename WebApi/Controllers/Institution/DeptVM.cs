using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.UI;

    /// <summary>
    /// 部门视图模型
    /// </summary>
    public class SYSDeptVM : ViewModel
    {
        #region Write Model

        /// <summary>
        ///  服务提供商ID
        /// </summary>
        [Display(Name = " 服务提供商ID")]
        public long? SystemID { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        [Required, StringLength(50), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "部门名称")]
        public string DeptName { get; set; }

        /// <summary>
        /// 部门名称简称
        /// </summary>
        [StringLength(50), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "部门名称简称")]
        public string ShortName { get; set; }

        /// <summary>
        /// 代码
        /// </summary>
        [StringLength(200), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "代码")]
        public string DeptCode { get; set; }

        /// <summary>
        /// 上级部门id
        /// </summary>
        [Required, Display(Name = "上级部门id")]
        public long? ParentID { get; set; }

        /// <summary>
        /// 层级 1开始计算
        /// </summary>
        [Required, Display(Name = "层级 1开始计算")]
        public int? Layer { get; set; }

        /// <summary>
        /// 路径
        /// </summary>
        [Required, StringLength(50), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "路径")]
        public string Path { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        [Display(Name = "排序")]
        public int? Sequence { get; set; }

        /// <summary>
        /// 部门上级领导id
        /// </summary>
        [Display(Name = "部门上级领导id")]
        public long? LeaderID { get; set; }

        /// <summary>
        /// 部门负责人
        /// </summary>
        [Display(Name = "部门负责人")]
        public long? ManagerID { get; set; }

        /// <summary>
        /// 是否启用（1-启用，0-停用）
        /// </summary>
        [Required, Display(Name = "是否启用（1-启用，0-停用）")]
        public int? IsEnabled { get; set; }

        /// <summary>
        /// 是否单位 0部门 1单位
        /// </summary>
        [Display(Name = "是否单位 0部门 1单位")]
        public int? IsUnit { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "备注")]
        public string Remark { get; set; }

        #endregion

        #region Read Model1

        /// <summary>
        /// ID
        /// </summary>
        [Required, Display(Name = "ID")]
        public long? ID { get; set; }

        #endregion
    }

}