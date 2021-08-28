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
    public class LookupController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<LOOK_UPDC>))]

        public IHttpActionResult GetAll()
        {
            LOOK_UPBL objLookUp = new LOOK_UPBL();
            List<LOOK_UPDC> objResultList = new List<LOOK_UPDC>();
            try
            {
                objResultList = objLookUp.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<LOOK_UPDC>))]

        public IHttpActionResult GetByType(string lookuptype)
        {
            LOOK_UPBL objLookUp = new LOOK_UPBL();
            List<LOOK_UPDC> objResultList = new List<LOOK_UPDC>();
            try
            {
                objResultList = objLookUp.LoadByType(lookuptype);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // GET api/values
        [HttpGet]
        public IHttpActionResult  Get(int id)
        {
            LOOK_UPBL objLookup = new LOOK_UPBL();
            LOOK_UPDC objResult = new LOOK_UPDC();
            try{
                objResult = objLookup.LoadByPrimaryKey(id);
            return Ok(new { objResult });

             }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<LOOK_UPDC> objLook_Ups)
        {
            LOOK_UPBL objLookup = new LOOK_UPBL();
            try
            {
                int IsUpdated = objLookup.Update(objLook_Ups);
                return Ok();
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<LOOK_UPDC> objLook_Ups)
        {
            LOOK_UPBL objLookup = new LOOK_UPBL();
            try
            {
                int IsInserted = objLookup.Insert(objLook_Ups);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<LOOK_UPDC> objLook_Ups)
        {
            LOOK_UPBL objLookup = new LOOK_UPBL();
            try
            {
                int IsDeleted = objLookup.Delete(objLook_Ups);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }
    }
}
