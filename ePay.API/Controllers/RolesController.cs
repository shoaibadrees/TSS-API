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
    public class RolesController : ApiController
    {
        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<ROLEDC>))]
        public IHttpActionResult GetAll()
        {
            ROLEBL objRole = new ROLEBL();
            List<ROLEDC> objResultList = new List<ROLEDC>();
            try
            {
                objResultList = objRole.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }


        // GET api/values
        [HttpGet]
        [ResponseType(typeof(ROLEDC))]
        public IHttpActionResult LoadRoleDetails(int id)
        {
            ROLEBL objRole = new ROLEBL();
            ROLEDC objResult = new ROLEDC();
            try
            {
                objResult = objRole.LoadRoleDetails(id);
                return Ok(new { objResult });
             }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // POST api/values
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult Update(List<ROLEDC> objROLES)
        {
            ROLEBL objRole = new ROLEBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                int IsUpdated = objRole.Update(objROLES, false, ref lstException);
              return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);
            }
        }

        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult UpdateRoleWithPermissions([FromBody] ROLEDC objROLE)
        {
            ROLEBL objRoleHandler = new ROLEBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            List<ROLEDC> objROLES = new List<ROLEDC>(1);
            objROLES.Add(objROLE);
            try
            {
                int IsUpdated = objRoleHandler.Update(objROLES, true, ref lstException);
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult Insert(List<ROLEDC> objRoles)
        {
            ROLEBL objRole = new ROLEBL();
            try
            {
                int IsInserted = objRole.Insert(objRoles);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult Delete(List<ROLEDC> objRoles)
        {
            ROLEBL objRole = new ROLEBL();
            try
            {
                int IsDeleted = objRole.Delete(objRoles);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }
    }
}
