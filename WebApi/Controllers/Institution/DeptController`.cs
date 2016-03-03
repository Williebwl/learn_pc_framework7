using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;

    public partial class DeptController : ApplicationService<SYSDeptVM, PagedQuery, SYSDept>
    {
        protected IRepository<SYSDept> _deptBO;

        public DeptController() : base("Name", "ShortName") { }

        protected virtual IList<SmartTreeVM> GetSmartTreeInfos()
        {
            var q = from d in _deptBO.Entities
                    orderby d.Path, d.Sequence
                    select new SmartTreeVM
                    {
                        ID = d.ID,
                        Value = d.ID.ToString(),
                        Layer = d.Layer,
                        Path = d.Path,
                        ParentID = d.ParentID,
                        Text = string.IsNullOrEmpty(d.ShortName) ? d.DeptName : d.ShortName
                    };

            return q.ToArray();
        }
    }
}