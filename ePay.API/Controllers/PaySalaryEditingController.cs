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
    public class PaySalaryEditingController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<PaySalaryEditingDC>))]

        public IHttpActionResult GetAll()

     {
            PaySalaryEditingBL objUser = new PaySalaryEditingBL();
            List<PaySalaryEditingDC> objResultList = new List<PaySalaryEditingDC>();
            objResultList = objUser.LoadAll();
            return Ok(objResultList);
        }
        [HttpGet]

        public IHttpActionResult GetAllEmployee(int Month , int Year)
        {
            PaySalaryEditingBL objUser = new PaySalaryEditingBL();
            List<PaySalaryEditingDC> objResultList = new List<PaySalaryEditingDC>();
            objResultList = objUser.LoadAllEmployee(Month,Year);
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

     
     

        [HttpPost]
        public IHttpActionResult postShifts([FromBody]PaySalaryEditingDC payDepartment)
        {
            //List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new PaySalaryEditingBL();

                PaySalaryEditingBL objUser = new PaySalaryEditingBL();
                PaySalaryEditingDC oldObj = new PaySalaryEditingDC();
                //get Object before saving
                //oldObj = objUser.LoadByPrimaryKey(PayLeavesDC.Code);

                List<PaySalaryEditingDC> list = new List<PaySalaryEditingDC>();
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
        public IHttpActionResult Delete([FromBody]PaySalaryEditingDC objUsers)
        {
            PaySalaryEditingBL objUser = new PaySalaryEditingBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            List<PaySalaryEditingDC> list = new List<PaySalaryEditingDC>();
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
