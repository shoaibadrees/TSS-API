using EPay.DataClasses;
using NMART.DataClasses;

namespace EPay.API.Mappers
{
    public class DailyAttachmentMapper
    {
        public static DAILY_ATTACHMENTDC ToDataModel(ATTACHMENTDC attachmentDC)
        {
            return new DAILY_ATTACHMENTDC
            {
                ATTACHMENT_ID = attachmentDC.ATTACHMENT_ID,
                DAILY_ID = attachmentDC.PARENT_ID
            };
        }
    }
}