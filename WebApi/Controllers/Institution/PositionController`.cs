using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace WebApi.Controllers.Institution
{
    public partial class PositionController
    {
        /// <summary>
        /// 禁用
        /// </summary>
        /// <param name="ids">职位ids</param>
        [HttpPut]
        public virtual void Disable(string id) => _positionService.Disable(id);

        /// <summary>
        /// 启用
        /// </summary>
        /// <param name="ids">职位ids</param>
        [HttpPut]
        public virtual void Enable(string id) => _positionService.Enable(id);
    }
}