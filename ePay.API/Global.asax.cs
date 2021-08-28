using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using EPay.API.Helpers;
using System.Threading.Tasks;
using EPay.Common;
using EPay.BusinessLayer;
using EPay.DataClasses;
using EPay.API.Controllers;
using System.Net.Http;

namespace EPay.API
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            //GlobalConfiguration.Configuration.Services.Replace(typeof(IHostBufferPolicySelector), new NoBufferPolicySelector());
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            System.Web.HttpContext.Current.Application["LoginAttempts"] = new List<KeyValuePair<string, int>>();

            JsonSerializerSettings serializerSettings = 
                GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
            serializerSettings.TypeNameHandling = TypeNameHandling.Auto;

            Task.Run(() => ApplyGeocodingAsync());
        }


        public async Task ApplyGeocodingAsync()
        {
            JOBBL jobsBL = new JOBBL();
            List<JOBDC> jobListToBeUpdated = new List<JOBDC>();
            try
            {
                GeocoderLocation geoCode = null;
                int requestLimit = 2500;
                int requestCount = 0;

                List<JOBDC> jobList_InvalidLatLong = jobsBL.GetAllJobsWithInvalidLatLongs();
                if (jobList_InvalidLatLong != null && jobList_InvalidLatLong.Count>0 )
                {
                    try
                    {
                        foreach (var jobObj in jobList_InvalidLatLong)
                        {
                            if (requestCount > requestLimit)
                                break;
                            // Perform GeoCoding if Either Latitude or Longitude is missing
                            string completeAddress = jobObj.CompleteAddress;
                            // Do not Perform GeoCoding if Address Information is completely missing to minimize limit-violation of Google Maps API
                            if (!String.IsNullOrEmpty(completeAddress) )
                            {
                                geoCode = await GMGeocoder.GoeCodeAsync(completeAddress);
                                if (geoCode != null)
                                {
                                    jobObj.LAT = geoCode.Latitude.ToString();
                                    jobObj.LONG = geoCode.Longitude.ToString();
                                    if (jobObj != null)
                                    {
                                        jobListToBeUpdated.Add(jobObj);
                                    }
                                }
                                requestCount++;
                                await Task.Delay(300);
                            }                                                                                    
                        }                        
                    }
                    catch (Exception exp)
                    {
                        Util.Utility.InsertIntoErrorLog(exp.Message, exp.StackTrace, Constants.AdminUserID);
                    }
                }
            }
            catch (Exception exp)
            {
                Util.Utility.InsertIntoErrorLog(exp.Message, exp.StackTrace, Constants.AdminUserID);
            }

            //update the address
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                if (jobListToBeUpdated.Count > 0)
                {
                    jobsBL.UpdateJobLatLong(jobListToBeUpdated, true);                   
                }
            }
            catch (Exception exp)
            {
                Util.Utility.InsertIntoErrorLog(exp.Message, exp.StackTrace, Constants.AdminUserID);
            }
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Expose-Headers", "X-LastServerDateTime");

            //Due to cross server, requests were failing. This solved the issue...
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Cache-Control", "no-cache");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST,PUT");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
                HttpContext.Current.Response.End();
            }
        }
    }
}
