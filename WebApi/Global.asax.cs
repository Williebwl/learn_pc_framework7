﻿using BIStudio.Framework;
using BIStudio.Framework.Configuration;
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
            CFConfig.Default
                .RegisterContainer()
                .RegisterDataMapping()
                .RegisterEFRepository()
                .RegisterMessageDispatcher();

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}