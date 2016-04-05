using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 职位视图模型
    /// </summary>
    public class SYSPositionVM : ViewModel
    {
        #region Write Model

        /// <summary>
        ///  服务提供商ID
        /// </summary>
        [Display(Name = " 服务提供商ID")]
        public long? SystemID { get; set; }

        /// <summary>
        /// 职位
        /// </summary>
        [StringLength(100), Display(Name = "职位")]
        public string PositionName { get; set; }

        /// <summary>
        /// 账号ID
        /// </summary>
        [Display(Name = "账号ID")]
        public long? UserID { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        [StringLength(100), Display(Name = "姓名")]
        public string UserName { get; set; }

        /// <summary>
        /// 部门ID
        /// </summary>
        [Display(Name = "部门ID")]
        public long? DeptID { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        [StringLength(100), Display(Name = "部门名称")]
        public string DeptName { get; set; }

        /// <summary>
        /// 上级领导ID
        /// </summary>
        [Display(Name = "上级领导ID")]
        public long? LeaderID { get; set; }

        /// <summary>
        /// 上级领导名称
        /// </summary>
        [StringLength(100), Display(Name = "上级领导名称")]
        public string LeaderName { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        [Display(Name = "排序")]
        public int? Sequence { get; set; }

        /// <summary>
        /// 是否有效
        /// </summary>
        [Display(Name = "是否有效")]
        public bool? IsValid { get; set; }

        /// <summary>
        /// 是否删除
        /// </summary>
        [Display(Name = "是否删除")]
        public bool? IsDelete { get; set; }

        /// <summary>
        /// 是否主职
        /// </summary>
        [Display(Name = "是否主职")]
        public bool? isMainSuties { get; set; }

        #endregion

        #region Read Model1

        /// <summary>
        /// 用户基本信息表主键
        /// </summary>                        
        public long? ID { get; set; }

        #endregion
    }

}