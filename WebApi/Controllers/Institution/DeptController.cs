using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Utils;

    public partial class DeptController
    {
        protected IRepository<SYSDept> _deptBO;
        protected IDeptService _deptService;

        public DeptController() : base("Name", "ShortName") { }

        #region 查询

        public virtual IList<SmartTreeVM> GetSmartTree()
        {
            var q = from d in _deptBO.Entities
                    where d.SystemID == AppRuntime.Context.User.SystemID
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

        public virtual string GetDeptCode([FromUri]GenerateCodeVM vm)
        {
            if (vm.Code.IsNull() && !vm.Name.IsNull()) vm.Code = ALSpell.GetSpell(vm.Name);

            var q = from d in _deptBO.Entities
                    where d.ID != vm.ID
                    && d.DeptCode.StartsWith(vm.Code)
                    select d.DeptCode;

            var codes = q.ToArray();

            if (codes.Any())
            {
                var i = 0;
                var deptCode = vm.Code;
                while (codes.Any(d => d.Equals(deptCode))) deptCode = vm.Code + (++i).ToString();
                vm.Code = deptCode;
            }

            return vm.Code;
        }

        public virtual GenerateCodeVM GetExistsDeptName([FromUri]GenerateCodeVM vm)
        {
            var q = from d in _deptBO.Entities
                    where d.ID != vm.ID
                    && d.DeptName.StartsWith(vm.Name)
                    select d.DeptName;

            var names = q.ToArray();

            if (names.Any())
            {
                var i = 0;
                var deptName = vm.Name;
                while (names.Any(d => d.Equals(deptName))) deptName = vm.Name + (++i).ToString();
                vm.Name = deptName;
            }

            GetDeptCode(vm);

            return vm;
        }

        #endregion 查询
    }
}