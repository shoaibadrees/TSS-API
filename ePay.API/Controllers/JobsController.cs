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
using System.Threading.Tasks;
using OfficeOpenXml;
using System.IO;
using System.Net.Http.Headers;

namespace EPay.API.Controllers
{
    public class JobsController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<JOBDC>))]

        public IHttpActionResult GetAll()
        {
            JOBBL objUser = new JOBBL();
            List<JOBDC> objResultList = new List<JOBDC>();
            objResultList = objUser.LoadAll();
            return Ok(new { objResultList });
        }


        // GET api/values
        [HttpGet]
        public IHttpActionResult Get(int projectid, int jobfilenumber)
        {
            JOBBL objUser = new JOBBL();
            JOBDC objResult = new JOBDC();
            objResult = objUser.LoadByKey(projectid, jobfilenumber);
            return Ok(new { objResult });
        }

        // GET api/values
        [HttpGet]
        public IHttpActionResult GetByFilters(string projectIDs="All", string doITTNTPStatusIDs = "All", string jobCategoriesIDs = "All", string jobStatusIDs = "All", string clientIDs = "All")
        {
            JOBBL objUser = new JOBBL();
            List<JOBDC> objResultList = new List<JOBDC>();
            objResultList = objUser.LoadByFilters(projectIDs, doITTNTPStatusIDs, jobCategoriesIDs, jobStatusIDs, clientIDs);
            return Ok(new { objResultList });
        }

        // GET api/values
        [HttpGet]
        public IHttpActionResult GetMapJobsByFilters(string projectIDs = "All", string jobStatusIDs = "All", string clientIDs = "All")
        {
            JOBBL objUser = new JOBBL();
            List<JOBDC> objResultList = new List<JOBDC>();
            objResultList = objUser.MapJobsLoadByFilters(projectIDs, jobStatusIDs, clientIDs);
            return Ok(new { objResultList });
        }

        [HttpGet]
        public IHttpActionResult GetAllJobsWithInvalidLatLongs()
        {
            JOBBL objUser = new JOBBL();
            List<JOBDC> objResultList = new List<JOBDC>();
            objResultList = objUser.GetAllJobsWithInvalidLatLongs();
            return Ok(new { objResultList });
        }
        // GET api/values
        [HttpGet]
        public IHttpActionResult GetByID(int jobid)
        {
            JOBBL objUser = new JOBBL();
            JOBDC objResult = new JOBDC();
            objResult = objUser.LoadByPrimaryKey(jobid);
            return Ok(new { objResult });
        }
        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert([FromBody]JOBDC jobDC)
        {
            try
            {
                JOBBL objUser = new JOBBL();
                List<JOBDC> list = new List<JOBDC>();
                list.Add(jobDC);
                int id = objUser.Insert(list);
                jobDC.JOB_ID = id;
                
                Task.Run(() => ApplyGeocodingAsync(null, jobDC,Request));

                return Ok(id);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("UNIQUE KEY constraint"))
                {
                    throw new System.InvalidOperationException("JobNumber");
                }
                else
                    throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult Update([FromBody]JOBDC jobDC)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new JOBBL();

                JOBBL objUser = new JOBBL();
                JOBDC oldObj = new JOBDC();
                //get Object before saving
                oldObj = objUser.LoadByPrimaryKey(jobDC.JOB_ID);

                List<JOBDC> list = new List<JOBDC>();
                list.Add(jobDC);
                int UpdatedCount = bl.Update(list, ref lstException);

                Task.Run(() => ApplyGeocodingAsync(oldObj, jobDC,Request)); 

                return Ok(UpdatedCount);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);             
            }
        }


        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete([FromBody]List<JOBDC> objUsers)
        {
            JOBBL objUser = new JOBBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                int IsDeleted = objUser.Delete(objUsers,ref lstException);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request, "Following jobs cannot be deleted as: ", "All the other records deleted successfully.", true);
            }

        }
        [HttpGet]
        [ResponseType(typeof(List<DD_DTO>))]
        public IHttpActionResult GetJobFileNumbers(String projectIDs)
        {
            JOBBL objUser = new JOBBL();
            List<DD_DTO> objResultList = new List<DD_DTO>();
            objResultList = objUser.GetJobFileNumbers(projectIDs);
            return Ok(new { objResultList });
        }

        [HttpPost]
        public IHttpActionResult UpdateGeoCodding([FromBody]JOBDC jobDC)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new JOBBL();

                JOBBL objUser = new JOBBL();
                JOBDC oldObj = new JOBDC();
                //get Object before saving
                oldObj = objUser.LoadByPrimaryKey(jobDC.JOB_ID);

                List<JOBDC> list = new List<JOBDC>();
                list.Add(jobDC);
                int UpdatedCount = bl.Update(list, ref lstException);

                Task.Run(() => ApplyGeocodingAsync(oldObj, jobDC, Request));

                return Ok(UpdatedCount);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);
            }
        }



        private async Task ApplyGeocodingAsync(JOBDC oldObject, JOBDC newObject, HttpRequestMessage request)
        {
            bool applyGeoCoding = false;
            if (oldObject == null)
            {
                applyGeoCoding = true;
                //new geo codding
            }
            if (oldObject != null && oldObject.CompleteAddress != newObject.CompleteAddress)
            {
                applyGeoCoding = true;
            }

            if (applyGeoCoding)
            {
                JOBBL jobsBL = new JOBBL();
                string completeAddress = newObject.CompleteAddress;
                GeocoderLocation geoCode = null;
                try
                { 
                    geoCode = await GMGeocoder.GoeCodeAsync(completeAddress);
                }
                catch (Exception exp)
                {
                    int userID = Common.Utility.GetUserID(Request);
                    Util.Utility.InsertIntoErrorLog(exp.Message, exp.StackTrace, userID);
                }

                if (geoCode != null)
                {
                    newObject.LAT = geoCode.Latitude.ToString();
                    newObject.LONG = geoCode.Longitude.ToString();
                    if (newObject != null)
                    {
                        List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
                        try
                        {
                            List<JOBDC> jobListToBeUpdated = new List<JOBDC>();
                            jobListToBeUpdated.Add(newObject);
                            if (jobListToBeUpdated.Count > 0)
                            {
                                jobsBL.Update(jobListToBeUpdated, ref lstException, true);
                            }
                        }
                        catch (Exception exp)
                        {
                            new TextResult(lstException, request);
                        }
                    }
                }

            }

            //return "Finished";
        }

    }
}
