using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Http.Description;
using System.Web.Http.Filters;

namespace EPay.API
{
    public class CustomHeaderFilter : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.ActionContext.Response != null)
                actionExecutedContext.ActionContext.Response.Headers.Add("X-LastServerDateTime", DateTime.Now.ToUniversalTime().ToString());
        }
    }
}