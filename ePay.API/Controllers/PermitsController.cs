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
using System.Web.Security;
using System.Configuration;

namespace EPay.API.Controllers
{
    public class PermitsController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<PERMITDC>))]

        public IHttpActionResult GetAll(string projectIDs = "All")
        {
            PERMITBL objUser = new PERMITBL();
            List<PERMITDC> objResultList = new List<PERMITDC>();
            objResultList = objUser.LoadAll(projectIDs);
            return Ok(new { objResultList });
        }


        public IHttpActionResult GetDashboard(string projectIDs = "All", string permitStatus = "All", string clientIDs = "All", string jobFileNo = "All", string submitedStartDt = "All", string submitedEndDt = "All")
        {
            PERMITBL objUser = new PERMITBL();
            List<PERMITDC> objResultList = new List<PERMITDC>();
            objResultList = objUser.LoadDashboard(projectIDs, permitStatus, clientIDs, jobFileNo, submitedStartDt, submitedEndDt);
            return Ok(new { objResultList });
        }

        // GET api/values
        //[HttpGet]
        // public IHttpActionResult Get(int projectid, int jobfilenumber)
        // {
        //     PERMITBL objUser = new PERMITBL();
        //     PERMITDC objResult = new PERMITDC();
        //     objResult = objUser.LoadByPrimaryKey(projectid, jobfilenumber);
        //     return Ok(new { objResult });
        // }

        // GET api/values
        [HttpGet]
        public IHttpActionResult GetByID(int permitid)
        {
            PERMITBL objUser = new PERMITBL();
            PERMITDC objResult = new PERMITDC();
            objResult = objUser.LoadByPrimaryKey(permitid);
            return Ok(new { objResult });
        }
        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert([FromBody]PERMITDC permit)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                PERMITBL bll = new PERMITBL();
                List<PERMITDC> list = new List<PERMITDC>();
                string currentPage = permit.CurrentPage;
                list.Add(permit);
                
                int id = bll.Insert(list,ref lstException);
                permit.PERMIT_ID = id;
                //return Ok(id);
                if (permit.PERMIT_ID != 0)
                {
                    permit = bll.LoadByPrimaryKey(permit.PERMIT_ID);
                    permit.CurrentPage = currentPage;
                    permit.TRANSACTION_SUCCESS = true;
                }
                return Ok(new { permit.PERMIT_ID, permit });
            }
            catch (Exception ex)
            {
                //if (ex.Message.Contains("UNIQUE KEY constraint"))
                //{
                //    throw new System.InvalidOperationException("JobNumber");
                //}
                //else
                return new TextResult(lstException, Request);
            }
        }

        [HttpPost]
        public IHttpActionResult Update([FromBody]PERMITDC permit)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bll = new PERMITBL();
                string currentPage = permit.CurrentPage;
                //int IsUpdated = 0;
                List<PERMITDC> list = new List<PERMITDC>();
                list.Add(permit);
                int UpdatedCount = bll.Update(list, ref lstException);

                if (UpdatedCount != 0)
                {
                    permit= bll.LoadByPrimaryKey(permit.PERMIT_ID);
                    permit.CurrentPage = currentPage;
                    permit.TRANSACTION_SUCCESS = true;
                }
                return Ok(new { permit.PERMIT_ID, permit });
                //if (UpdatedCount > 0)
                //    IsUpdated = 1;
                //return Ok(UpdatedCount);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);         
            }
        }


        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete([FromBody]List<PERMITDC> objUsers)
        {
            PERMITBL objUser = new PERMITBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                int IsDeleted = objUser.Delete(objUsers,ref lstException);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);
            }

       }
        [HttpGet]
        [ResponseType(typeof(List<DD_DTO>))]
        public IHttpActionResult GetJobFileNumbers(String projectIDs)
        {
            PERMITBL objUser = new PERMITBL();
            List<DD_DTO> objResultList = new List<DD_DTO>();
            objResultList = objUser.GetJobFileNumbers(projectIDs);
            return Ok(new { objResultList });
        }
    }
}
