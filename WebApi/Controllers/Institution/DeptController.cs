using System.Collections.Generic;
using System.Linq;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;

    public partial class DeptController
    {
        protected IRepository<SYSDept> _deptBO;

        public DeptController() : base("Name", "ShortName") { }

        #region 查询

        public virtual IList<SmartTreeVM> GetSmartTree()
        {
            var q = from d in _deptBO.Entities
                    where d.SystemID == CFContext.User.SystemID
                    orderby d.Path, d.Sequence
                    select new SmartTreeVM
                    {
                        ID = d.ID,
                        Value = d.ID.ToString(),
                        Layer = d.Layer,
                        Path = d.Path,
                        ParentID = d.ParentID,
                        Text = string.IsNullOrEmpty(d.ShortName) ? d.DeptName : d.ShortName,
                        Tag = d.DeptName
                    };

            return q.ToArray();
        }

        protected override ISpecification<SYSDept> GetQueryParams<T>(T info)
        {
            var spec = base.GetQueryParams<T>(info);

            if (info.CurrentID > 0) spec.Sql.Append(" AND ID<>@CurrentID ", new { CurrentID = info.CurrentID });

            return spec;
        }

        public virtual int GetMaxSequence() => _deptBO.Entities.Max(d => d.Sequence) ?? 0;

        #endregion 查询
    }
}