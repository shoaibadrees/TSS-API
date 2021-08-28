using Hylan.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hylan.DAL.DataClasses.Partials
{
    class PERMITS_DASHBOARDDC : AbstractDataClass
    {
        public int PERMIT_ID { get; set; }
        public int? PROJECT_ID { get; set; }
        public int? JOB_ID { get; set; }
        public string CLIENT { get; set; }
        public string POLE_LOCATION { get; set; }
        public string DOT_TRACKING_NUMBER { get; set; }
        public string PERMIT_NUMBER_TEXT { get; set; }
        public DateTime? SUBMITTED_DATE { get; set; }
        public DateTime? ISSUED_DATE { get; set; }
        public DateTime? VALID_DATE { get; set; }
        public DateTime? EXPIRES_DATE { get; set; }


        public string NODE_ID1 { get; set; }
        public string NODE_ID2 { get; set; }
        public string NODE_ID3 { get; set; }
        public string HUB { get; set; }
        public string HYLAN_PM { get; set; }
        public string STREET_ADDRESS { get; set; }
        public string CITY { get; set; }
        public string STATE { get; set; }
        public string ZIP { get; set; }
        public string LAT { get; set; }
        public string LONG { get; set; }
        
        
        public string PERMIT_TYPE { get; set; }
        
        public string SEGMENT { get; set; }
        public string IS_PROTECTED_STREET { get; set; }
        public DateTime? MARKOUT_START_DATE { get; set; }
        public DateTime? MARKOUT_END_DATE { get; set; }
        public bool STIPULATION_DAY { get; set; }
        public bool STIPULATION_NIGHT { get; set; }
        public bool STIPULATION_WEEKEND { get; set; }
        public string STIPULATIONS_OTHER { get; set; }

       
        public int? PERMIT_STATUS { get; set; }
        public string NOTES { get; set; }
        public DateTime? REJECTED_DATE { get; set; }
        public int? REJECTED_REASON { get; set; }
        //public int CREATED_BY { get; set; }
        //public DateTime CREATED_ON { get; set; }
        //public int MODIFIED_BY { get; set; }
        //public DateTime MODIFIED_ON { get; set; }
        //public int LOCK_COUNTER { get; set; }
        //public bool IsDirty { get; set; }
        

        //---PermitsSummary-------
        public int? PERMITS_COUNT { get; set; }
        public int? ACTIVE_COUNT { get; set; }
        public int? EXPIRED_COUNT { get; set; }
        public int? EXPIRING_5DAYS_COUNT { get; set; }
        public int? ON_HOLD_COUNT { get; set; }
        public int? REQUEST_EXTENSION_COUNT { get; set; }
        public int? REQUEST_RENEWAL_COUNT { get; set; }
        public int? PENDING_COUNT { get; set; }
        public int? REJECTED_COUNT { get; set; }
    }
}
