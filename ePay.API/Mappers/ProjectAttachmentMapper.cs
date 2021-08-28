using EPay.DataClasses;
using NMART.DataClasses;

namespace EPay.API.Mappers
{
    public class ProjectAttachmentMapper
    {
        public static PROJECT_ATTACHMENTDC ToDataModel(ATTACHMENTDC attachmentDC)
        {
            return new PROJECT_ATTACHMENTDC
            {
                ATTACHMENT_ID = attachmentDC.ATTACHMENT_ID,
                PROJECT_ID = attachmentDC.PARENT_ID
            };
        }
    }
}