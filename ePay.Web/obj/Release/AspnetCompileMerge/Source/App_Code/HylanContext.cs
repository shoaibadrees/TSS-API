using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;

    public static class HylanContext
    {
        public static Hashtable CurrentUserSessions
        {
            get
            {
                if (System.Web.HttpContext.Current.Application["CurrentUserSessions"] == null)
                    return null;
                else
                    return (Hashtable)System.Web.HttpContext.Current.Application["CurrentUserSessions"];
            }
            set
            {
                if (System.Web.HttpContext.Current != null)
                    System.Web.HttpContext.Current.Application["CurrentUserSessions"] = value;
            }
        }
    }
