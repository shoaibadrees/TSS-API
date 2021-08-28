using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using EPay.API.Helpers;
using EPay.API.Mappers;
using EPay.BusinessLayer;
using EPay.Common;
using EPay.DataClasses;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using NMART.BusinessLayer;
using NMART.DataClasses;

namespace EPay.API.Controllers
{
    public class AttachmentController : ApiController
    {
        private static string baseVirtualPath = System.Configuration.ConfigurationSettings.AppSettings["AttachmentFolder"];
        private string baseFolder = HttpContext.Current.Server.MapPath(baseVirtualPath);
        private string permitsFolder = "";
        public async Task<HttpResponseMessage> Upload()
        {
            try
            {
                if (Request.Content.IsMimeMultipartContent())
                {
                    new ATTACHMENTBL().CreateDirectory(baseFolder);
                    var streamProvider = new CustomMultipartFormDataStreamProvider(baseFolder);
                    await Request.Content.ReadAsMultipartAsync(streamProvider);

                    var attachmentsDataModel = new List<ATTACHMENTDC>();
                    for (int i = 0; i < streamProvider.FormData.Count / 19; i++)
                        attachmentsDataModel.Add(AttachmentMapper.ToDataModel(streamProvider, i));
                    return Request.CreateResponse(HttpStatusCode.OK, attachmentsDataModel);
                }
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable,
                    "This request is not properly formatted"));
            }
            catch (Exception ex)
            {
                Logging.LogExceptionInFile(ex.Message, ex.Source, "", ex.StackTrace);
                throw ex;
            }
        }

        public IHttpActionResult InsertAll([FromBody]List<ATTACHMENTDC> attachmentDCViewList)
        {
            try
            {
                var attachmentBL = new ATTACHMENTBL();
                var attachmentDCList = attachmentBL.Insert(attachmentDCViewList);
                attachmentBL.CopyFileToAttachmentDirectory(attachmentDCList, baseFolder);
                return Ok(attachmentDCList);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        private USERDC GetUser(List<ATTACHMENTDC> attachmentDCViewList)
        {
            try
            {
                var userBL = new USERBL();
                return userBL.LoadByPrimaryKey(attachmentDCViewList.FirstOrDefault().MODIFIED_BY);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        

        [HttpGet]
        [ResponseType(typeof(List<ATTACHMENTDC>))]
        public IHttpActionResult Get(int SCREEN_ID, int SCREEN_RECORD_ID)
        {
            try
            {
                ATTACHMENTBL objAttachment = new ATTACHMENTBL();
                List<ATTACHMENTDC> objResultList = new List<ATTACHMENTDC>();
                if (SCREEN_ID > 0 && SCREEN_RECORD_ID > 0)
                {
                    if (SCREEN_ID == 3)
                        objResultList = objAttachment.LoadByJobId(SCREEN_RECORD_ID);
                    else if (SCREEN_ID == 2)
                        objResultList = objAttachment.LoadByProjectId(SCREEN_RECORD_ID);
                    else if(SCREEN_ID == 5)
                        objResultList = objAttachment.LoadByPermitId(SCREEN_RECORD_ID);
                    else if (SCREEN_ID == 6)
                        objResultList = objAttachment.LoadByDailyId(SCREEN_RECORD_ID);
                }
                return Ok(new { objResultList });
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }

        }

        [HttpGet]
        [ResponseType(typeof(List<ATTACHMENTDC>))]
        public IHttpActionResult GetAll(string userID = null, string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            try
            {
                ATTACHMENTBL objAttachment = new ATTACHMENTBL();
                List<ATTACHMENTDC> objResultList = new List<ATTACHMENTDC>();
                objResultList = objAttachment.LoadAllProjectAttachments(projectIDs, attachmentTypeIDs);
                objResultList.AddRange(objAttachment.LoadAllJobAttachments(projectIDs, attachmentTypeIDs));
                objResultList.AddRange(objAttachment.LoadAllPermitAttachments(projectIDs, attachmentTypeIDs));
                objResultList.AddRange(objAttachment.LoadAllDailyAttachments(projectIDs, attachmentTypeIDs));
                return Ok(new { objResultList });
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        [HttpGet]
        [ResponseType(typeof(List<DOCUMENTCATEGORYDC>))]
        public IHttpActionResult GetCategories(int documentCategoryId)
        {
            try
            {
                ATTACHMENTBL objAttachment = new ATTACHMENTBL();
                return Ok(objAttachment.LoaddocumentCategories(documentCategoryId));
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }

        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update([FromBody]List<ATTACHMENTDC> objAttachmentlist)
        {
            ATTACHMENTBL objAttachment = new ATTACHMENTBL();
            try
            {
                foreach (var thisAttachment in objAttachmentlist)
                {
                    thisAttachment.MODIFIED_ON = DateTime.Now;
                }
                int IsUpdated = objAttachment.Update(objAttachmentlist);
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
                new TextResult(ex.Message, Request, ex.StackTrace);
                throw ex;
            }
        }

        [HttpGet]
        public HttpResponseMessage Download(string name, string type, int parentId, int projectId, int jobId, int permitId,int DailyId)
        {
            try
            {
                if (!string.IsNullOrEmpty(name))
                {
                    string filePath = "";
                    if (type == "Daily")
                    {
                        projectId = projectId == -1 ? 0 : projectId;
                        jobId = jobId == -1 ? 0 : jobId;
                        filePath = baseFolder + @"\" + "Project" + @"\" + projectId +
                                   @"\" + "Jobs" + @"\" + jobId + @"\" + "Daily" + @"\" + parentId + @"\" + name;
                        if (!File.Exists(filePath))
                        {
                            filePath = baseFolder + @"\DAILY\" + parentId + @"\" + name;
                        }
                    }
                    else if (type == "Permit")
                    {
                        filePath = baseFolder + @"\" + "Project" + @"\" + projectId +
                                   @"\" + "Jobs" + @"\" + jobId + @"\" + "Permits" + @"\" + parentId + @"\" + name;
                        if (!File.Exists(filePath))
                        {
                            filePath = baseFolder + @"\Permits\" + parentId + @"\" + name;
                        }
                    }
                    else if (type == "Job")
                    {
                        filePath = baseFolder + @"\" + "Project" + @"\" + projectId + @"\" + "Jobs" + @"\" + parentId + @"\" + name;
                    }
                    else if (type == "Project")
                    {
                        filePath = baseFolder + @"\" + type + @"\" + projectId + @"\" + name;
                    }
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (FileStream file = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                        {
                            byte[] bytes = new byte[file.Length];
                            file.Read(bytes, 0, (int)file.Length);
                            ms.Write(bytes, 0, (int)file.Length);

                            HttpResponseMessage httpResponseMessage = new HttpResponseMessage();
                            httpResponseMessage.Content = new ByteArrayContent(bytes.ToArray());
                            httpResponseMessage.Content.Headers.Add("x-filename", name);
                            httpResponseMessage.Content.Headers.Add("Filename", name);
                            httpResponseMessage.Content.Headers.Add("Access-Control-Expose-Headers", "Filename");
                            httpResponseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                            httpResponseMessage.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                            httpResponseMessage.Content.Headers.ContentDisposition.FileName = name;
                            httpResponseMessage.StatusCode = HttpStatusCode.OK;
                            return httpResponseMessage;
                        }
                    }
                }
                return this.Request.CreateResponse(HttpStatusCode.NotFound, "File not found.");
            }
            catch (Exception ex)
            {
                Logging.LogExceptionInFile(ex.Message, ex.Source, "", ex.StackTrace);
                throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult Delete(List<ATTACHMENTDC> objAttachments)
        {
            ATTACHMENTBL objAttachment = new ATTACHMENTBL();
            try
            {
                int IsDeleted = objAttachment.Delete(objAttachments);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                new TextResult(ex.Message, Request, ex.StackTrace);
                throw ex;
            }

        }
    }
}

