using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NMART.BusinessLayer;
using NMART.DataClasses;
using NMART.DataAccess;
using nMart.Common;
using System.Web.Http.Results;
using System.Web.Http.Description;

namespace nMart.API.Controllers
{
    public class UsersRmagsController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<USERS_RMAGDC>))]

        public IHttpActionResult GetAll()
        {
            USERS_RMAGBL objUserRmag = new USERS_RMAGBL();
            List<USERS_RMAGDC> objResultList = new List<USERS_RMAGDC>();
            try
            {
                objResultList = objUserRmag.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }
      
         // GET api/values
        [HttpGet]
        public IHttpActionResult  Get(int id)
        {
            USERS_RMAGBL objUsers_Rmag = new USERS_RMAGBL();
            USERS_RMAGDC objResult = new USERS_RMAGDC();
            try{
                objResult = objUsers_Rmag.LoadByPrimaryKey(id);
            return Ok(new { objResult });
             }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<USERS_RMAGDC> objUser_Rmags)
        {
            USERS_RMAGBL objUsers_Rmag = new USERS_RMAGBL();
            try
            {
                int IsUpdated = objUsers_Rmag.Update(objUser_Rmags);
                return Ok();
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<USERS_RMAGDC> objUser_Rmags)
        {
            USERS_RMAGBL objUsers_Rmag = new USERS_RMAGBL();
            try
            {
                int IsInserted = objUsers_Rmag.Insert(objUser_Rmags);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<USERS_RMAGDC> objUser_Rmags)
        {
            USERS_RMAGBL objUsers_Rmag = new USERS_RMAGBL();
            try
            {
                int IsDeleted = objUsers_Rmag.Delete(objUser_Rmags);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }

        }
    }
}
