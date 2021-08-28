using EPay.DataClasses;
using NMART.DataClasses;

namespace EPay.API.Mappers
{
    public class JobAttachmentMapper
    {
        public static JOB_ATTACHMENTDC ToDataModel(ATTACHMENTDC attachmentDC)
        {
            return new JOB_ATTACHMENTDC
            {
                ATTACHMENT_ID = attachmentDC.ATTACHMENT_ID,
                JOB_ID = attachmentDC.PARENT_ID
            };
        }
    }
}