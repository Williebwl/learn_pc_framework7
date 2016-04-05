using System.Linq;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Utils;

    public partial class DeptController : ApplicationService<SYSDeptVM, DeptQuery, SYSDept>
    {
        #region 编辑

        public override bool Delete(string id)
        {
            if (string.IsNullOrEmpty(id = id?.Trim(',', ' '))) return false;

            return _deptBO.Remove(new Spec<SYSDept>(string.Join(" OR ", ALConvert.ToList<long>(id).Select(d => "CHARINDEX('," + d + ",',Path,0)>0").ToArray())));
        }

        #endregion 编辑
    }
}