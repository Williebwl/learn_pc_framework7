using System.Linq;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;

    public partial class DeptController : AppService<SYSDeptVM, DeptQuery, SYSDept>
    {
        #region 编辑

        public override bool Delete(string id) => _deptService.Delete(id);

        #endregion 编辑
    }
}