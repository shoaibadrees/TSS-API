using EPay.DataClasses;
using NMART.DataClasses;

namespace EPay.API.Mappers
{
    public class PermitAttachmentMapper
    {
        public static PERMIT_ATTACHMENTDC ToDataModel(ATTACHMENTDC attachmentDC)
        {
            return new PERMIT_ATTACHMENTDC
            {
                ATTACHMENT_ID = attachmentDC.ATTACHMENT_ID,
                PERMIT_ID = attachmentDC.PARENT_ID
            };
        }
    }
}