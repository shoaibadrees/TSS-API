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
    public class RolesPermissionsController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<ROLES_PERMISSIONDC>))]

        public IHttpActionResult GetAll()
        {
            ROLES_PERMISSIONBL objRolesScreens = new ROLES_PERMISSIONBL();
            List<ROLES_PERMISSIONDC> objResultList = new List<ROLES_PERMISSIONDC>();
            try
            {
                objResultList = objRolesScreens.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<ROLES_PERMISSIONDC> objRolesScreenPerm)
        {
            ROLES_PERMISSIONBL objRolesScreenPermBL = new ROLES_PERMISSIONBL();
            try
            {
                int IsInserted = objRolesScreenPermBL.Insert(objRolesScreenPerm);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
    }
}
