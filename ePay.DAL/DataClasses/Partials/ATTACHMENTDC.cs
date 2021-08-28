using System;

namespace EPay.DataClasses
{
    public partial class ATTACHMENTDC
    {
        public int PARENT_ID { get; set; }
        public int SCREEN_ID { get; set; }
        public int SCREEN_RECORD_ID { get; set; }
        public int PROJECT_ID { get; set; }
        public int JOB_ID { get; set; }
        public int PERMIT_ID { get; set; }
        public int DAILY_ID { get; set; }
        public string PERMIT_NUMBER { get; set; }
        public string ENTITY_TYPE { get; set; }
        public string FILE_ICON { get; set; }
        public string UPDATED_FILE_NAME { get; set; }
        public string MODIFIED_ON1 { get; set; }
        public int? LOCK_COUNTER { get; set; }
        public string PERMIT_NUMBER_TEXT { get; set; }
        public string DOT_TRACKING_NUMBER { get; set; }

        public string PermitLinkText
        {
            get
            {
                string dot_tracking_no = string.IsNullOrEmpty(this.DOT_TRACKING_NUMBER) ? "" : this.DOT_TRACKING_NUMBER;
                string permit_number = string.IsNullOrEmpty(this.PERMIT_NUMBER_TEXT ) ? "" : "-" + this.PERMIT_NUMBER_TEXT;
                return dot_tracking_no + permit_number;
            }
        }

        public DOCUMENTCATEGORYDC Documentcategorydc  = new DOCUMENTCATEGORYDC();
    }

    public class DOCUMENTCATEGORYDC
    {
        public string CATEGORY_CODE { get; set; }
        public string CATEGORY_NAME { get; set; }
        public int CATEGORY_TYPE { get; set; }
    }
}
