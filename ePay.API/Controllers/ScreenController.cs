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
    public class ScreenController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<SCREENDC>))]

        public IHttpActionResult GetAll()
        {
            SCREENBL objScreen = new SCREENBL();
            List<SCREENDC> objResultList = new List<SCREENDC>();
            try
            {
                objResultList = objScreen.LoadAll();
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
            SCREENBL objScreen = new SCREENBL();
            SCREENDC objResult = new SCREENDC();
            try{
                objResult = objScreen.LoadByPrimaryKey(id);
            return Ok(new { objResult });

             }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<SCREENDC> objScreens)
        {
            SCREENBL objScreen = new SCREENBL();
            try
            {
                int IsUpdated = objScreen.Update(objScreens);
                return Ok();
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<SCREENDC> objScreens)
        {
            SCREENBL objScreen = new SCREENBL();
            try
            {
                int IsInserted = objScreen.Insert(objScreens);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<SCREENDC> objScreens)
        {
            SCREENBL objScreen = new SCREENBL();
            try
            {
                int IsDeleted = objScreen.Delete(objScreens);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }
    }
}
