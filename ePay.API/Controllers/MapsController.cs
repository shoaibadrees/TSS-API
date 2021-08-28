
using EPay.BusinessLayer;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace EPay.API.Controllers
{
    public class MapsController : ApiController
    {
        // GET api/values
        [HttpGet]
        [ResponseType(typeof(MESSAGEDC))]
        public IHttpActionResult GetEmptyModel()
        {
            try
            {
                MAPStruct resultObject = new MAPStruct();
                return Ok(new { resultObject });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        //[HttpGet]
        //public IHttpActionResult LoadMapData(int EVENT_ID, int RMAG_ID, string RESOURCE_TYPE)
        //{
        //    //REQUESTBL objRequestBL = new REQUESTBL();
        //    //RESPONSEBL objResponseBL = new RESPONSEBL();

        //    //List<REQUESTDC> requests = new List<REQUESTDC>();
        //    //List<RESPONSEDC> responses = new List<RESPONSEDC>();
        //    //List<Object> objResultList = new List<Object>();
        //    //try
        //    //{
        //    //    if (EVENT_ID != 0)
        //    //    {
        //    //        requests = objRequestBL.MapRequestsLoad(EVENT_ID, RMAG_ID, RESOURCE_TYPE);
        //    //        responses = objResponseBL.MAPResponsesLoad(EVENT_ID, RMAG_ID, RESOURCE_TYPE);
        //    //    }
        //    //    objResultList.Add(requests);
        //    //    objResultList.Add(responses);

        //       return Ok(new { requests, responses});

        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //   return new TextResult(ex.Message, Request,ex.StackTrace);
        //    //}
        //}
    }
}