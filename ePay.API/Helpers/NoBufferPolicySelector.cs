using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.WebHost;

namespace EPay.API.Helpers
{
    //public class NoBufferPolicySelector : IHostBufferPolicySelector
    //{
    //    public bool UseBufferedInputStream(object hostContext)
    //    {
    //        var context = hostContext as HttpContextBase;

    //        if (context != null)
    //        {
    //            if (string.Equals(context.Request.RequestContext.RouteData.Values["Controller"].ToString(), "Attachment", StringComparison.InvariantCultureIgnoreCase))
    //                return false;
    //        }

    //        return true;
    //    }

    //    public  bool UseBufferedOutputStream(HttpResponseMessage response)
    //    {
    //        return base.UseBufferedOutputStream(response);
    //    }
    //}
}