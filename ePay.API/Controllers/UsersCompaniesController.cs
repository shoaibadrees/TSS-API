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
    public class UsersCompaniesController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<USERS_COMPANIEDC>))]
        public IHttpActionResult GetAll()
        {
            USERS_COMPANIEBL objUserCompanies = new USERS_COMPANIEBL();
            List<USERS_COMPANIEDC> objResultList = new List<USERS_COMPANIEDC>();
            try
            {
                objResultList = objUserCompanies.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }


        // GET api/values
        [HttpGet]
        [ResponseType(typeof(USERS_COMPANIEDC))]
        public IHttpActionResult GetByUserID(int userID, string accessType)
        {
            USERS_COMPANIEBL objUserCompanies = new USERS_COMPANIEBL();
            USERS_COMPANIEDC objResultList = new USERS_COMPANIEDC();
            try
            {
                objResultList = objUserCompanies.LoadByUserID(userID, accessType);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<USERS_COMPANIEDC> objUsers_Companies)
        {
            USERS_COMPANIEBL objUsers_Companie = new USERS_COMPANIEBL();
            try
            {
                int IsInserted = objUsers_Companie.Insert(objUsers_Companies);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
    }
}
