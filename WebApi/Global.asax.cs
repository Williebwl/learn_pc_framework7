using BIStudio.Framework;
using BIStudio.Framework.Auth;
using BIStudio.Framework.Configuration;
using BIStudio.Framework.Data;
using BIStudio.Framework.Domain;
using BIStudio.Framework.MQ;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Security;

namespace WebApi
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AppRuntime.Module
                .RegisterModule()
                .RegisterORMapping()
                .RegisterEFRepository()
                .RegisterMessageDispatcher();

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
