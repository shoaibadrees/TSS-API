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
    public class PayLeavesController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<PayLeavesDC>))]

        public IHttpActionResult GetAll()

     {
            PayLeavesBL objUser = new PayLeavesBL();
            List<PayLeavesDC> objResultList = new List<PayLeavesDC>();
            objResultList = objUser.LoadAll();
            return Ok(objResultList);
        }
        [HttpGet]

        public IHttpActionResult GetAllEmployee()
        {
            PayLeavesBL objUser = new PayLeavesBL();
            List<PayLeavesDC> objResultList = new List<PayLeavesDC>();
            objResultList = objUser.LoadAllEmployee();
            return Ok(objResultList);
        }

        [HttpGet]
        [ResponseType(typeof(FormSecurityDC))]
        public IHttpActionResult GetFormSecurity(string formName)
        {
            FormSecurityDC obj = new FormSecurityDC()
            {
                CanDelete = true,
                CanEdit = true,
                CanPring = true,
                CanView = true,
                FormId = 0,
                Name = "testForm"
            };
            obj.CanDelete = true;
            obj.CanView = true;


            return Ok(obj);
        }

        // GET api/values
        //[HttpGet]
        //public IHttpActionResult Get(int projectid, int PayLeavesDCfilenumber)
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    PayLeavesDC objResult = new PayLeavesDC();
        //    objResult = objUser.LoadByKey(projectid, PayDesignationfilenumber);
        //    return Ok(new { objResult });
        //}

        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetByFilters(string projectIDs="All", string doITTNTPStatusIDs = "All", string PayDesignationCategoriesIDs = "All", string PayDesignationStatusIDs = "All", string clientIDs = "All")
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    List<PayLeavesDC> objResultList = new List<PayLeavesDC>();
        //    objResultList = objUser.LoadByFilters(projectIDs, doITTNTPStatusIDs, PayDesignationCategoriesIDs, PayDesignationStatusIDs, clientIDs);
        //    return Ok(new { objResultList });
        //}

        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetMapPayDesignationsByFilters(string projectIDs = "All", string PayDesignationStatusIDs = "All", string clientIDs = "All")
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    List<PayLeavesDC> objResultList = new List<PayLeavesDC>();
        //    objResultList = objUser.MapPayDesignationsLoadByFilters(projectIDs, PayDesignationStatusIDs, clientIDs);
        //    return Ok(new { objResultList });
        //}

        //[HttpGet]
        //public IHttpActionResult GetAllPayDesignationsWithInvalidLatLongs()
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    List<PayLeavesDC> objResultList = new List<PayLeavesDC>();
        //    objResultList = objUser.GetAllPayDesignationsWithInvalidLatLongs();
        //    return Ok(new { objResultList });
        //}
        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetByID(int PayDesignationid)
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    PayLeavesDC objResult = new PayLeavesDC();
        //    objResult = objUser.LoadByPrimaryKey(PayDesignationid);
        //    return Ok(new { objResult });
        //}

        //// PUT api/values/5
        //[HttpPost]
        //public IHttpActionResult Insert([FromBody]PayLeavesDC PayLeavesDC)
        //{
        //    try
        //    {
        //        PayLeavesBL objUser = new PayLeavesBL();
        //        List<PayLeavesDC> list = new List<PayLeavesDC>();
        //        list.Add(PayLeavesDC);
        //        int id = objUser.Insert(list);
        //        PayLeavesDC.PayDesignation_ID = id;

        //        Task.Run(() => ApplyGeocodingAsync(null, PayLeavesDC,Request));

        //        return Ok(id);
        //    }
        //    catch (Exception ex)
        //    {
        //        if (ex.Message.Contains("UNIQUE KEY constraint"))
        //        {
        //            throw new System.InvalidOperationException("PayDesignationNumber");
        //        }
        //        else
        //            throw ex;
        //    }
        //}

        [HttpPost]
        public IHttpActionResult postShifts([FromBody]PayLeavesDC payDepartment)
        {
            //List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new PayLeavesBL();

                PayLeavesBL objUser = new PayLeavesBL();
                PayLeavesDC oldObj = new PayLeavesDC();
                //get Object before saving
                //oldObj = objUser.LoadByPrimaryKey(PayLeavesDC.Code);

                List<PayLeavesDC> list = new List<PayLeavesDC>();
                list.Add(payDepartment);
                int UpdatedCount = 0;
                if (payDepartment.ID != null && payDepartment.ID> 0)
                {
                    UpdatedCount = bl.Update(list);
                }
                else
                {

                    UpdatedCount = bl.Insert(list);
                }

                if (UpdatedCount > 0)
                {
                    return Ok(true);
                }
                return Ok(false);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
                //return new TextResult(lstException, Request);
            }
        }


        //// DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete([FromBody]PayLeavesDC objUsers)
        {
            PayLeavesBL objUser = new PayLeavesBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            List<PayLeavesDC> list = new List<PayLeavesDC>();
            list.Add(objUsers);
            try
            {
                int IsDeleted = objUser.Delete(list);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request, "Following PayDesignations cannot be deleted as: ", "All the other records deleted successfully.", true);
            }

        }
        //[HttpGet]
        //[ResponseType(typeof(List<DD_DTO>))]
        //public IHttpActionResult GetPayDesignationFileNumbers(String projectIDs)
        //{
        //    PayLeavesBL objUser = new PayLeavesBL();
        //    List<DD_DTO> objResultList = new List<DD_DTO>();
        //    objResultList = objUser.GetPayDesignationFileNumbers(projectIDs);
        //    return Ok(new { objResultList });
        //}

        //[HttpPost]
        //public IHttpActionResult UpdateGeoCodding([FromBody]PayLeavesDC PayLeavesDC)
        //{
        //    List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
        //    try
        //    {
        //        var bl = new PayLeavesBL();

        //        PayLeavesBL objUser = new PayLeavesBL();
        //        PayLeavesDC oldObj = new PayLeavesDC();
        //        //get Object before saving
        //        oldObj = objUser.LoadByPrimaryKey(PayLeavesDC.PayDesignation_ID);

        //        List<PayLeavesDC> list = new List<PayLeavesDC>();
        //        list.Add(PayLeavesDC);
        //        int UpdatedCount = bl.Update(list, ref lstException);

        //        Task.Run(() => ApplyGeocodingAsync(oldObj, PayLeavesDC, Request));

        //        return Ok(UpdatedCount);
        //    }
        //    catch (Exception ex)
        //    {
        //        return new TextResult(lstException, Request);
        //    }
        //}



        //private async Task ApplyGeocodingAsync(PayLeavesDC oldObject, PayLeavesDC newObject, HttpRequestMessage request)
        //{
        //    bool applyGeoCoding = false;
        //    if (oldObject == null)
        //    {
        //        applyGeoCoding = true;
        //        //new geo codding
        //    }
        //    if (oldObject != null && oldObject.CompleteAddress != newObject.CompleteAddress)
        //    {
        //        applyGeoCoding = true;
        //    }

        //    if (applyGeoCoding)
        //    {
        //        PayLeavesBL PayDesignationsBL = new PayLeavesBL();
        //        string completeAddress = newObject.CompleteAddress;
        //        GeocoderLocation geoCode = null;
        //        try
        //        { 
        //            geoCode = await GMGeocoder.GoeCodeAsync(completeAddress);
        //        }
        //        catch (Exception exp)
        //        {
        //            int userID = Common.Utility.GetUserID(Request);
        //            Util.Utility.InsertIntoErrorLog(exp.Message, exp.StackTrace, userID);
        //        }

        //        if (geoCode != null)
        //        {
        //            newObject.LAT = geoCode.Latitude.ToString();
        //            newObject.LONG = geoCode.Longitude.ToString();
        //            if (newObject != null)
        //            {
        //                List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
        //                try
        //                {
        //                    List<PayLeavesDC> PayDesignationListToBeUpdated = new List<PayLeavesDC>();
        //                    PayDesignationListToBeUpdated.Add(newObject);
        //                    if (PayDesignationListToBeUpdated.Count > 0)
        //                    {
        //                        PayDesignationsBL.Update(PayDesignationListToBeUpdated, ref lstException, true);
        //                    }
        //                }
        //                catch (Exception exp)
        //                {
        //                    new TextResult(lstException, request);
        //                }
        //            }
        //        }

        //    }

        //    //return "Finished";
        //}
    }
}
