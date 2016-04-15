using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace WebApi.Controllers.Institution
{
    using BIStudio.Framework;
    using BIStudio.Framework.Data;
    using BIStudio.Framework.Domain;
    using BIStudio.Framework.Institution;
    using BIStudio.Framework.UI;
    using BIStudio.Framework.Utils;
    public partial class PositionController : AppService<SYSPositionVM, PositionPagedQuery, SYSPosition>
    {
        protected IRepository<SYSPosition> _positionBO;
        protected IRepository<SYSDept> _deptBO;
        protected IPositionService _positionService;

        #region 查询

        public virtual PagedList<PositionPagedVM> GetPaged([FromUri]PositionPagedQuery info)
        {
            var query = from d in GetPositionsQuery(info)
                        from b in _deptBO.Entities
                        join a in _positionBO.Entities.Where(s => s.IsDelete == false) on d.ParentID equals a.ID into t
                        from c in t.DefaultIfEmpty()
                        where d.SystemID == AppRuntime.Context.User.SystemID
                        && b.ID == d.DeptID
                        && d.IsDelete == false
                        orderby d.ID descending
                        select new { d, b.DeptCode, b.DeptName, PositionCode = c != null ? c.PositionCode : null, PositionName = c != null ? c.PositionName : null };

            return query.ToPagedList(info, d =>
            {
                return new PositionPagedVM
                {
                    Position = d.d.Map<SYSPosition, SYSPositionVM>(),
                    DeptCode = d.DeptCode,
                    DeptName = d.DeptName,
                    PositionCode = d.PositionCode,
                    PositionName = d.PositionName
                };
            });
        }

        protected virtual IQueryable<SYSPosition> GetPositionsQuery(PositionPagedQuery info)
        {
            var q = _positionBO.Entities
                  .WhereIf(info.Key, d => d.PositionCode.Contains(info.Key) || d.PositionName.Contains(info.Key))
                  .WhereIf(info.DeptID > 0, d => d.DeptID == info.DeptID);

            return q;
        }


        protected override ISpecification<SYSPosition> GetQueryParams<T>(T info)
        {
            var spec = base.GetQueryParams<T>(info);

            if (info.DeptID > 0) spec.Sql.Append(" AND DeptID=@DeptID ", new { DeptID = info.DeptID });

            if (info.CurrentID > 0) spec.Sql.Append(" AND ID<>@CurrentID ", new { CurrentID = info.CurrentID });

            return spec;
        }

        public virtual IList<SmartTreeVM> GetSmartTree()
        {
            var q = from d in _positionBO.Entities
                    where d.SystemID == AppRuntime.Context.User.SystemID
                    orderby d.Path, d.Sequence
                    select new SmartTreeVM
                    {
                        ID = d.ID,
                        Value = d.ID.ToString(),
                        Layer = d.Layer,
                        Path = d.Path,
                        ParentID = d.ParentID,
                        Text = d.PositionName
                    };

            return q.ToArray();
        }

        public virtual int GetMaxSequence() => _positionBO.Entities.Max(d => d.Sequence) ?? 0;

        public virtual string GetPositionCode([FromUri]GenerateCodeVM vm)
        {
            if (vm.Code.IsNull() && !vm.Name.IsNull()) vm.Code = ALSpell.GetSpell(vm.Name);

            var q = from d in _positionBO.Entities
                    where d.ID != vm.ID
                    && d.PositionCode.StartsWith(vm.Code)
                    select d.PositionCode;

            var codes = q.ToArray();

            if (codes.Any())
            {
                var i = 0;
                var code = vm.Code;
                while (codes.Any(d => d.Equals(code))) code = vm.Code + (++i).ToString();
                vm.Code = code;
            }

            return vm.Code;
        }

        #endregion 查询
    }
}