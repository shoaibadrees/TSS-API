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
    public class EmployeeController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<EmployeeDC>))]

        public IHttpActionResult GetAll()

      {
            EmployeeBL objUser = new EmployeeBL();
            List<EmployeeDC> objResultList = new List<EmployeeDC>();
            objResultList = objUser.LoadAll();
            return Ok(objResultList);
        }

        [HttpGet]
        [ResponseType(typeof(EmployeeDC))]

        public IHttpActionResult GetNew()

        {
            EmployeeBL objUser = new EmployeeBL();
           EmployeeDC objResult = new EmployeeDC();
            objResult = objUser.LoadNew();
            return Ok(objResult);
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
        public IHttpActionResult postEmployee([FromBody] EmployeeDC Employee)
        {
            //List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var bl = new EmployeeBL();

                EmployeeBL objUser = new EmployeeBL();
                EmployeeDC oldObj = new EmployeeDC();
                //get Object before saving
                //oldObj = objUser.LoadByPrimaryKey(PayDepartmentDC.Code);

                List<EmployeeDC> list = new List<EmployeeDC>();
                list.Add(Employee);
                int UpdatedCount = 0;
                if (Employee.Code != null && Employee.Code.Length > 0)
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
        public IHttpActionResult Delete([FromBody] EmployeeDC objUsers)
        {
            EmployeeBL objUser = new EmployeeBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            List<EmployeeDC> list = new List<EmployeeDC>();
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

        [HttpPost]
        [Route("api/UploadImage")]
        public HttpResponseMessage UploadImage()
        {
            Image image1 = new Image();
            string imageName = null;
            int imageID = 0;
            var httpRequest = HttpContext.Current.Request;
            //Upload Image
            var postedFile = httpRequest.Files["Image"];
            
            //Create custom filename

            //imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(1).ToArray());
            var Code = httpRequest.Form["code"];

            imageName = Code + Path.GetExtension(postedFile.FileName);
            var filePath = HttpContext.Current.Server.MapPath("~/Images/" + imageName);
            postedFile.SaveAs(filePath);

            //Save to DB
            using (DBModel1 db = new DBModel1())
            {
                Image image = new Image()
                {
                    
                    ImageName = imageName
                };
                db.Images.Add(image);
                db.SaveChanges();
            }
            return Request.CreateResponse(HttpStatusCode.Created);
        }



        [HttpGet]
        public HttpResponseMessage downloadPhoto(int itemId)
        {

            string photosPath = HttpContext.Current.Server.MapPath("~/Images/"); ;
            if (!System.IO.Directory.Exists(photosPath))
            {
                System.IO.Directory.CreateDirectory(photosPath);
            }

            string fullFileName = photosPath + itemId;
            string fileName = itemId.ToString();

            DirectoryInfo d = new DirectoryInfo(photosPath);
            FileInfo[] files = d.GetFiles(fileName + ".*");

            if (files.Length > 0)
            {
                fullFileName = files[0].FullName;
                fileName = files[0].Name;
            }
            else
            {
                //return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            // byte[] bytes = ItemId; ////-------------
            using (MemoryStream ms = new MemoryStream())
            {
                using (FileStream file = new FileStream(fullFileName, FileMode.Open, FileAccess.Read))
                {
                    byte[] bytes = new byte[file.Length];
                    file.Read(bytes, 0, (int)file.Length);
                    ms.Write(bytes, 0, (int)file.Length);

                    HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
                    httpResponseMessage.Content = new ByteArrayContent(bytes.ToArray());
                    httpResponseMessage.Content.Headers.Add("x-filename", fileName);
                    httpResponseMessage.Content.Headers.Add("Filename", fileName);
                    httpResponseMessage.Content.Headers.Add("Access-Control-Expose-Headers", "Filename");
                    //httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpg");
                    httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    //httpResponseMessage.Content.Headers.ContentDisposition.FileName = fileName;
                    httpResponseMessage.StatusCode = HttpStatusCode.OK;
                    return httpResponseMessage;



                    //var net = new System.Net.WebClient();
                    //var data = net.DownloadData(fullFileName);
                    //var content = new System.IO.MemoryStream(data);
                    //var contentType = "image/jpg";

                    // return File(content, contentType, fileName);
                }
            }

        }

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
