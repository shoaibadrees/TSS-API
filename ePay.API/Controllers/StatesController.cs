using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EPay.BusinessLayer;
using EPay.DataClasses;
using EPay.DataAccess;
using EPay.Common;
using System.Web.Http.Results;
using System.Web.Http.Description;

namespace EPay.API.Controllers
{
    public class StatesController : ApiController
    {
       
        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<ST_STATE_LDC>))]

        public IHttpActionResult GetAll()
        {
            ST_STATE_LBL objStates = new ST_STATE_LBL();
            List<ST_STATE_LDC> objResultList = new List<ST_STATE_LDC>();
            try
            {
                ST_STATE_LDC objState = new ST_STATE_LDC();
                //objState.ST_STATE = "";
                //objState.ST_STATENAME = "";
                objResultList = objStates.LoadAll();
                //objResultList.Insert (0,objState);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

      
    }
}
