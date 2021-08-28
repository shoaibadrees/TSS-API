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
using System.Web;
using Hylan.API.Models;

namespace EPay.API.Controllers

{
    public class PayDepartmentController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<PayDepartmentDC>))]

        public IHttpActionResult GetAll()

      {
            PayDepartmentBL objUser = new PayDepartmentBL();
            List<PayDepartmentDC> objResultList = new List<PayDepartmentDC>();
            objResultList = objUser.LoadAll();
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
        //public IHttpActionResult Get(int projectid, int PayDepartmentDCfilenumber)
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    PayDepartmentDC objResult = new PayDepartmentDC();
        //    objResult = objUser.LoadByKey(projectid, PayDesignationfilenumber);
        //    return Ok(new { objResult });
        //}

        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetByFilters(string projectIDs="All", string doITTNTPStatusIDs = "All", string PayDesignationCategoriesIDs = "All", string PayDesignationStatusIDs = "All", string clientIDs = "All")
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    List<PayDepartmentDC> objResultList = new List<PayDepartmentDC>();
        //    objResultList = objUser.LoadByFilters(projectIDs, doITTNTPStatusIDs, PayDesignationCategoriesIDs, PayDesignationStatusIDs, clientIDs);
        //    return Ok(new { objResultList });
        //}

        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetMapPayDesignationsByFilters(string projectIDs = "All", string PayDesignationStatusIDs = "All", string clientIDs = "All")
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    List<PayDepartmentDC> objResultList = new List<PayDepartmentDC>();
        //    objResultList = objUser.MapPayDesignationsLoadByFilters(projectIDs, PayDesignationStatusIDs, clientIDs);
        //    return Ok(new { objResultList });
        //}

        //[HttpGet]
        //public IHttpActionResult GetAllPayDesignationsWithInvalidLatLongs()
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    List<PayDepartmentDC> objResultList = new List<PayDepartmentDC>();
        //    objResultList = objUser.GetAllPayDesignationsWithInvalidLatLongs();
        //    return Ok(new { objResultList });
        //}
        //// GET api/values
        //[HttpGet]
        //public IHttpActionResult GetByID(int PayDesignationid)
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    PayDepartmentDC objResult = new PayDepartmentDC();
        //    objResult = objUser.LoadByPrimaryKey(PayDesignationid);
        //    return Ok(new { objResult });
        //}

        //// PUT api/values/5
        //[HttpPost]
        //public IHttpActionResult Insert([FromBody]PayDepartmentDC PayDepartmentDC)
        //{
        //    try
        //    {
        //        PayDepartmentBL objUser = new PayDepartmentBL();
        //        List<PayDepartmentDC> list = new List<PayDepartmentDC>();
        //        list.Add(PayDepartmentDC);
        //        int id = objUser.Insert(list);
        //        PayDepartmentDC.PayDesignation_ID = id;

        //        Task.Run(() => ApplyGeocodingAsync(null, PayDepartmentDC,Request));

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
        public IHttpActionResult postDepartment([FromBody]PayDepartmentDC payDepartment)
        {
            string imageName = null;
            var httpRequest = HttpContext.Current.Request;
            var postedFile = httpRequest.Files["Image"];
            //List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new PayDepartmentBL();

                PayDepartmentBL objUser = new PayDepartmentBL();
                PayDepartmentDC oldObj = new PayDepartmentDC();
                //get Object before saving
                //oldObj = objUser.LoadByPrimaryKey(PayDepartmentDC.Code);

                List<PayDepartmentDC> list = new List<PayDepartmentDC>();
                list.Add(payDepartment);
                int UpdatedCount = 0;
                if (payDepartment.Code != null && payDepartment.Code.Length > 0)
                {
                    UpdatedCount = bl.Update(list);
                }
                else
                {
                    UpdatedCount = bl.Insert(list);
                    

                }
                imageName = oldObj.ImageName;
                var filePath = HttpContext.Current.Server.MapPath("~/Images/" + imageName);
                postedFile.SaveAs(filePath);

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
        public IHttpActionResult Delete([FromBody]PayDepartmentDC objUsers)
        {
            PayDepartmentBL objUser = new PayDepartmentBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            List<PayDepartmentDC> list = new List<PayDepartmentDC>();
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
        //[HttpPost]
        //[Route("api/UploadImage")]
        //public HttpResponseMessage UploadImage()
        //{
        //    string imageName = null;
        //    var httpRequest = HttpContext.Current.Request;
        //    //Upload Image
        //    var postedFile = httpRequest.Files["Image"];
        //    //Create custom filename
        //    imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
        //    imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
        //    var filePath = HttpContext.Current.Server.MapPath("~/Image/" + imageName);
        //    postedFile.SaveAs(filePath);

        //    //Save to DB
        //    using (DBModel db = new DBModel())
        //    {
        //        Image image = new Image()
        //        {
                    
        //            ImageName = imageName
        //        };
        //        db.Images.Add(image);
        //        db.SaveChanges();
        //    }
        //    return Request.CreateResponse(HttpStatusCode.Created);
        //}
        //[HttpGet]
        //[ResponseType(typeof(List<DD_DTO>))]
        //public IHttpActionResult GetPayDesignationFileNumbers(String projectIDs)
        //{
        //    PayDepartmentBL objUser = new PayDepartmentBL();
        //    List<DD_DTO> objResultList = new List<DD_DTO>();
        //    objResultList = objUser.GetPayDesignationFileNumbers(projectIDs);
        //    return Ok(new { objResultList });
        //}

        //[HttpPost]
        //public IHttpActionResult UpdateGeoCodding([FromBody]PayDepartmentDC PayDepartmentDC)
        //{
        //    List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
        //    try
        //    {
        //        var bl = new PayDepartmentBL();

        //        PayDepartmentBL objUser = new PayDepartmentBL();
        //        PayDepartmentDC oldObj = new PayDepartmentDC();
        //        //get Object before saving
        //        oldObj = objUser.LoadByPrimaryKey(PayDepartmentDC.PayDesignation_ID);

        //        List<PayDepartmentDC> list = new List<PayDepartmentDC>();
        //        list.Add(PayDepartmentDC);
        //        int UpdatedCount = bl.Update(list, ref lstException);

        //        Task.Run(() => ApplyGeocodingAsync(oldObj, PayDepartmentDC, Request));

        //        return Ok(UpdatedCount);
        //    }
        //    catch (Exception ex)
        //    {
        //        return new TextResult(lstException, Request);
        //    }
        //}



        //private async Task ApplyGeocodingAsync(PayDepartmentDC oldObject, PayDepartmentDC newObject, HttpRequestMessage request)
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
        //        PayDepartmentBL PayDesignationsBL = new PayDepartmentBL();
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
        //                    List<PayDepartmentDC> PayDesignationListToBeUpdated = new List<PayDepartmentDC>();
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
