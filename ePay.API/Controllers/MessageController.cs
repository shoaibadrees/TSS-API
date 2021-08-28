using EPay.BusinessLayer;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using EPay.Common;

namespace EPay.API.Controllers
{
    public class MessageController: ApiController
    {
        // GET api/values
        [HttpGet]
        [ResponseType(typeof(MESSAGEDC))]
        public IHttpActionResult GetEmptyModel()
        {
            try
            {
                MESSAGEDC resultObject = new MESSAGEDC();
                return Ok(new { resultObject });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        // POST api/values
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult SendEmail(MESSAGEDC objMessage)
        {
            
            
            MESSAGEBL objMessageBL = new MESSAGEBL();
            try
            {
                int IsUpdated = objMessageBL.SendSMTPEmail(objMessage);
                return Ok(new { IsUpdated });
            }
            catch (Exception ex) {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult ScheduleMeeting(MESSAGEDC objMessage)
        {
            /* -- CALL_ON does't need to covnert to event tz bz it's already mentioned on the popup.
            if (!String.IsNullOrEmpty(objMessage.TIME_ZONE_CALL_ON)) {
                String strTimeZone = objMessage.TIME_ZONE_CALL_ON.Substring(objMessage.TIME_ZONE_CALL_ON.Length - 3, 3);
                String dtDate = objMessage.TIME_ZONE_CALL_ON.Substring(0,objMessage.TIME_ZONE_CALL_ON.Length - 4);
                objMessage.CALL_ON = Convert.ToDateTime(dtDate);
                bool iseffective = Utility.IsDayTimeSavingEffective((DateTime)objMessage.CALL_ON, strTimeZone);
                if(iseffective)
                {
                    objMessage.TIME_ZONE_CALL_ON = Convert.ToDateTime(objMessage.CALL_ON).AddHours(1).ToString("MM/dd/yyyy HH:mm:ss.sss") + " " + strTimeZone;
                }

            }*/
            MESSAGEBL objMessageBL = new MESSAGEBL();
            try
            {
                int IsUpdated = objMessageBL.ScheduleMeeting(objMessage);
                return Ok(new { IsUpdated });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
    }
}