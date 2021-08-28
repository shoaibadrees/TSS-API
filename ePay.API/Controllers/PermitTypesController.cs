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
    public class PermitTypesController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<PERMIT_TYPEDC>))]

        public IHttpActionResult GetAll()
        {
            PERMIT_TYPEBL objLookUp = new PERMIT_TYPEBL();
            List<PERMIT_TYPEDC> objResultList = new List<PERMIT_TYPEDC>();
            try
            {
                objResultList = objLookUp.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        
        public IHttpActionResult GetAllWithCode()
        {
            PERMIT_TYPEBL objLookUp = new PERMIT_TYPEBL();
            List<PERMIT_TYPEDC> objResultList = new List<PERMIT_TYPEDC>();
            try
            {
                objResultList = objLookUp.LoadAll(true);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // GET api/values
        //[HttpGet]
        //[ResponseType(typeof(List<PERMITS_LOOK_UPDC>))]

        //public IHttpActionResult GetByType(string lookuptype)
        //{
        //    PERMITS_LOOK_UPBL objLookUp = new PERMITS_LOOK_UPBL();
        //    List<PERMITS_LOOK_UPDC> objResultList = new List<PERMITS_LOOK_UPDC>();
        //    try
        //    {
        //        objResultList = objLookUp.LoadByType(lookuptype);
        //        return Ok(new { objResultList });

        //    }
        //    catch (Exception ex)
        //    {
        //       return new TextResult(ex.Message, Request,ex.StackTrace);
        //    }
        //}

        // GET api/values
        [HttpGet]
        public IHttpActionResult  Get(string id)
        {
            PERMIT_TYPEBL objLookup = new PERMIT_TYPEBL();
            PERMIT_TYPEDC objResult = new PERMIT_TYPEDC();
            try{
                objResult = objLookup.LoadByPrimaryKey(id);
            return Ok(new { objResult });

             }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            PERMIT_TYPEBL objLookup = new PERMIT_TYPEBL();
            try
            {
                int IsUpdated = objLookup.Update(objPERMITS_LOOK_UPs);
                return Ok();
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            PERMIT_TYPEBL objLookup = new PERMIT_TYPEBL();
            try
            {
                int IsInserted = objLookup.Insert(objPERMITS_LOOK_UPs);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            PERMIT_TYPEBL objLookup = new PERMIT_TYPEBL();
            try
            {
                int IsDeleted = objLookup.Delete(objPERMITS_LOOK_UPs);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }
    }
}
