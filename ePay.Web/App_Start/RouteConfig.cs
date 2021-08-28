using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Hylan.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "SetAuthenticationTicket",
                url: "SetAuthenticationTicket",
                defaults: new { controller = "Account", action = "SetAuthenticationTicket", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "LoggedUsers",
                url: "LoggedUsers",
                defaults: new { controller = "Account", action = "LoggedUsers", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Logout",
                url: "Logout",
                defaults: new { controller = "Account", action = "Logout", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetFileText",
                url: "GetFileText",
                defaults: new { controller = "Reports", action = "GetFileText", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DefaultAll",
                url: "{*.}",
                defaults: new { controller = "Page", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
