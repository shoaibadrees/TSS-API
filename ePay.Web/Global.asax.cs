using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Optimization;
using System.Web.Configuration;
using System.Web.SessionState;
using System.Security.Principal;
using System.Collections;
using System.Configuration;
using System.Web.Security;
using EPay.Common;
using EPay.BusinessLayer;

namespace Hylan.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            System.Web.HttpContext.Current.Application["LoggedInUsers"] = new List<KeyValuePair<string, string>>();
        }
    }
}
