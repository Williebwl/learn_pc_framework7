using BIStudio.Framework;
using BIStudio.Framework.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIStudio.Framework.Test.UnitTest
{
    [TestClass]
    public sealed class Global
    {
        [AssemblyInitialize]
        public static void Application_Start(TestContext context)
        {
            AppRuntime.Module
                .RegisterModule()
                .RegisterORMapping()
                .RegisterEFRepository()
                .RegisterMessageDispatcher();
        }
    }
}
