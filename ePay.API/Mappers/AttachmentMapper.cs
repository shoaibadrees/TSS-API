using System;
using System.Web.Script.Serialization;
using EPay.API.Helpers;
using EPay.DataClasses;

namespace EPay.API.Mappers
{
    public static class AttachmentMapper
    {
        public static ATTACHMENTDC ToDataModel(CustomMultipartFormDataStreamProvider streamProvider, int index)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var attachmentDC = new ATTACHMENTDC();
            attachmentDC.CREATED_BY =
                Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][CREATED_BY]"]);
            attachmentDC.CREATED_ON = DateTime.Now;
            //attachmentDC.MODIFIED_ON = DateTime.Now;
            attachmentDC.MODIFIED_BY =
                Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][MODIFIED_BY]"]);
            attachmentDC.DOCUMENT_CATEGORY =
                streamProvider.FormData["attachmentDCModels[" + index + "][DOCUMENT_CATEGORY]"];
            attachmentDC.Documentcategorydc = //serializer.Deserialize<DOCUMENTCATEGORYDC>(streamProvider.FormData["attachmentDCModels[" + index + "][Documentcategorydc]"]) ??
                new DOCUMENTCATEGORYDC
                {
                    CATEGORY_CODE = null,
                    CATEGORY_NAME = null
                };
            attachmentDC.FILE_NAME = streamProvider.FormData["attachmentDCModels[" + index + "][FILE_NAME]"];
            attachmentDC.FILE_TYPE = streamProvider.FormData["attachmentDCModels[" + index + "][FILE_TYPE]"];
            attachmentDC.FILE_SIZE = streamProvider.FormData["attachmentDCModels[" + index + "][FILE_SIZE]"];
            attachmentDC.FILE_TITLE = streamProvider.FormData["attachmentDCModels[" + index + "][FILE_TITLE]"];
            attachmentDC.FILE_KEYWORD = streamProvider.FormData["attachmentDCModels[" + index + "][FILE_KEYWORD]"];
            attachmentDC.PARENT_ID =
                Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][PARENT_ID]"]);
            attachmentDC.ENTITY_TYPE = streamProvider.FormData["attachmentDCModels[" + index + "][ENTITY_TYPE]"];
            attachmentDC.SCREEN_ID = Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][SCREEN_ID]"]);
            attachmentDC.SCREEN_RECORD_ID = Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][SCREEN_RECORD_ID]"]);
            attachmentDC.PROJECT_ID = streamProvider.FormData["attachmentDCModels[" + index + "][PROJECT_ID]"] == null || streamProvider.FormData["attachmentDCModels[" + index + "][PROJECT_ID]"]== "null" ? 0 :
                Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][PROJECT_ID]"]);
            attachmentDC.JOB_ID = streamProvider.FormData["attachmentDCModels[" + index + "][JOB_ID]"] == null || streamProvider.FormData["attachmentDCModels[" + index + "][JOB_ID]"] == "null" ? 0 :
                Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][JOB_ID]"]);
            attachmentDC.DAILY_ID = Convert.ToInt32(streamProvider.FormData["attachmentDCModels[" + index + "][DAILY_ID]"]);
            attachmentDC.IS_DELETED = false;
            return attachmentDC;
        }
    }
}