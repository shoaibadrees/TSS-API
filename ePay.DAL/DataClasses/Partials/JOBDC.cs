using System;
using System.Collections;
using System.Data;
using System.Collections.Generic;
using EPay.DAL.DataClasses.Partials;

namespace EPay.DataClasses
{
    public partial class JOBDC
    {
        public int JOB_ID { get; set; }
        public string HYLAN_PM_NAME { get; set; }
        public string HYLAN_PROJECT_ID { get; set; }
        public LOOK_UPDC JOB_STATUS_LU = new LOOK_UPDC();
        public LOOK_UPDC JOB_CATEGORY_LU = new LOOK_UPDC();
        public LOOK_UPDC DOITT_NTP_STATUS_LU = new LOOK_UPDC();
        public int NEEDED_TASKS_COUNT { get; set; }
        public string ATTACHMENTS { get; set; }
        public string CLIENT_NAME { get; set; }
        public string PRIORITY { get; set; }
        public int CLIENT_ID { get; set; }
        public string CJ_NUMBER { get; set; }
        public string DID_NUMBER { get; set; }
        public PermitsSummary PermitsSummary = new PermitsSummary();
        public string PO_NUMBER { get; set; }
        public decimal? PO_AMOUNT { get; set; }
        public DateTime? INVOICE_DATE { get; set; }
        public decimal? INVOICE_AMOUNT { get; set; }
        public string CompleteAddress {
            get
            {
                string STREET_ADDRESS = this.STREET_ADDRESS == null ? "" : this.STREET_ADDRESS;
                string CITY = this.CITY == null ? "" : this.CITY;
                string STATE = this.STATE == null ? "" : this.STATE;
                string ZIP = this.ZIP == null ? "" : this.ZIP;

                return STREET_ADDRESS + "," + CITY + "," + STATE + "," + ZIP;
            }
        }
    }
}
