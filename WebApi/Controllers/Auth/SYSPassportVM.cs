using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Auth
{
    using BIStudio.Framework.UI;

    /// <summary>
    /// 平台通行证视图模型
    /// </summary>
    public class SYSPassportVM : ViewModel
    {
        #region Write Model

        /// <summary>
        /// 登陆名
        /// </summary>
        [StringLength(50), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "登陆名")]
        public string LoginName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        [Display(Name = "密码")]
        public byte[] Password { get; set; }

        /// <summary>
        /// 电子邮件
        /// </summary>
        [StringLength(500), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), EmailAddress, Display(Name = "电子邮件")]
        public string Email { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [Display(Name = "备注")]
        public string Remarks { get; set; }

        /// <summary>
        /// 上次登录时间
        /// </summary>
        [Display(Name = "上次登录时间")]
        public DateTime? LastLoginTime { get; set; }

        /// <summary>
        /// 上次登录错误次数
        /// </summary>
        [Display(Name = "上次登录错误次数")]
        public int? LastLoginError { get; set; }

        /// <summary>
        /// 是否启用
        /// </summary>
        [Display(Name = "是否启用")]
        public bool? IsValid { get; set; }

        /// <summary>
        /// 是否锁定
        /// </summary>
        [Display(Name = "是否锁定")]
        public bool? IsLocked { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        [StringLength(400), Display(Name = "创建人")]
        public string Inputer { get; set; }

        /// <summary>
        /// 创建人的ID
        /// </summary>
        [Display(Name = "创建人的ID")]
        public long? InputerID { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [Display(Name = "创建时间")]
        public DateTime? InputTime { get; set; }

        /// <summary>
        /// VerificationCode
        /// </summary>
        [StringLength(50), RegularExpression(@"^[\t\r\n\u0020-\u007e]*$", ErrorMessage = "字段 {0} 必须是英文字母、数字或符号。"), Display(Name = "VerificationCode")]
        public string VerificationCode { get; set; }

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