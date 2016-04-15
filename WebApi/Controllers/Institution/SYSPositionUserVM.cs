using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 职位视图模型
    /// </summary>
    [Mark(Name = "PositionUser")]
    public class SYSPositionUserVM : ViewModel
    {
        #region Write Model

        /// <summary>
        ///  服务提供商ID
        /// </summary>                   
        public long? SystemID { get; set; }

        /// <summary>
        /// 职位编号
        /// </summary>
        public long? PositionID { get; set; }

        /// <summary>
        /// 职位
        /// </summary>
        [Required, Display(Name = "职位")]
        public string PositionName { get; set; }

        /// <summary>
        /// 账号ID
        /// </summary>          
        public long? UserID { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        [Required, Display(Name = "姓名")]
        public string UserName { get; set; }

        /// <summary>
        /// 部门ID
        /// </summary>
        [Display(Name = "部门ID")]
        public long? DeptID { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>                                 
        public string DeptName { get; set; }

        /// <summary>
        /// 上级领导ID
        /// </summary>                 
        public long? LeaderID { get; set; }

        /// <summary>
        /// 上级领导名称
        /// </summary>
        [Required, Display(Name = "上级领导名称")]
        public string LeaderName { get; set; }

        /// <summary>
        /// 排序
        /// </summary>          
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
        /// 是否主职
        /// </summary>               
        public bool? IsPartTime { get; set; }

        #endregion

        #region Read Model1

        /// <summary>
        /// 用户基本信息表主键
        /// </summary>                        
        public long? ID { get; set; }

        #endregion
    }

}