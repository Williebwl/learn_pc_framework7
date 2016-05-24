using BIStudio.Framework;
using BIStudio.Framework.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIFramework.Test
{
    public class ServiceRegistry : AppModule
    {
        protected override void Init()
        {
            AppRuntime.Container.RegisterType<IRepository<TCTest>, TCTestEntityFrameworkBO>();
        }
    }
}
