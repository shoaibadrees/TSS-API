using EPay.DAL.DataClasses.Partials;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public class TASK_ROSTERDC
    {
        //------ Job
        public int JOB_ID { get; set; }
        public int PROJECT_ID { get; set; }       
        public string HYLAN_PROJECT_ID { get; set; }
        public string JOB_FILE_NUMBER { get; set; }
        public int TOTAL_TASKS { get; set; }
        public string NODE_ID1 { get; set; }
        public string NODE_ID2 { get; set; }
        public string NODE_ID3 { get; set; }
        public string HUB { get; set; }
        public Int32 HYLAN_PM { get; set; }
        public string STREET_ADDRESS { get; set; }
        public string CITY { get; set; }
        public string STATE { get; set; }
        public string ZIP { get; set; }
        public string LAT { get; set; }
        public string LONG { get; set; }
        public string POLE_LOCATION { get; set; }
        public string DOITT_NTP_STATUS_NAME { get; set; }
        public DateTime? DOITT_NTP_GRANTED_DATE { get; set; }
        public string JOB_CATEGORY_NAME { get; set; }
        public string JOB_STATUS_NAME { get; set; }
        public string ON_HOLD_REASON { get; set; }
        public string CLIENT_PM { get; set; }
        public string JOB_NOTES { get; set; }
        public int NUMBER_OF_SUBMITTED_PERMITS { get; set; }
        public string PERMIT_NOTES { get; set; }
        public string PUNCHLIST_COMPLETE { get; set; }
        public DateTime? PUNCHLIST_SUBMITTED_DATE { get; set; }
        public DateTime? CLIENT_APPROVAL_DATE { get; set; }
        public int NOTES_COUNT { get; set; }
        public DateTime? NOTES_DATE { get; set; }
        public int ATTACHMENTS_COUNT { get; set; }

        //public PermitsSummary PermitsSummary = new PermitsSummary();
        public int? PERMITS_COUNT { get; set; }
        public int? ACTIVE_COUNT { get; set; }
        public int? EXPIRED_COUNT { get; set; }
        public int? EXPIRING_5DAYS_COUNT { get; set; }
        public int? ON_HOLD_COUNT { get; set; }
        public int? REQUEST_EXTENSION_COUNT { get; set; }
        public int? REQUEST_RENEWAL_COUNT { get; set; }
        public int? PENDING_COUNT { get; set; }
        public int? REJECTED_COUNT { get; set; }

        //------ 1-Continuity to Zero M/H
        public bool CTZ_REQUIRED { get; set; }
        public DateTime? CTZ_FORECAST_DATE { get; set; }
        public DateTime? CTZ_ACT_COMPLETION_DATE { get; set; }
        public string CTZ_PARTY_RESPONSIBLE { get; set; }
        public string CTZ_NOTES { get; set; }


        //------ 2-Foundation Work
        public bool FDW_REQUIRED { get; set; }
        public string FDW_TYPE { get; set; }
        public DateTime? FDW_FORECAST_START_DATE { get; set; }
        public DateTime? FDW_ACT_START_DATE { get; set; }
        public DateTime? FDW_ACT_COMPLETION_DATE { get; set; }
        public string FDW_CONED_TICKET_NUMBER { get; set; }
        public string FDW_ON_HOLD_REASON { get; set; }
        public string FDW_ON_HOLD_OTHER { get; set; }
        public string FDW_NOTES { get; set; }


        //------ 3-Pole Work
        public bool PLW_REQUIRED { get; set; }
        public string PLW_TYPE { get; set; }
        public DateTime? PLW_FORECAST_START_DATE { get; set; }
        public DateTime? PLW_ACT_START_DATE { get; set; }
        public DateTime? PLW_ACT_COMPLETION_DATE { get; set; }
        public string PLW_ON_HOLD_REASON { get; set; }
        public string PLW_ON_HOLD_OTHER { get; set; }
        public string PLW_NOTES { get; set; }


        //------ 4-Fiber Dig
        public bool FBD_REQUIRED { get; set; }
        public string FBD_TYPE { get; set; }
        public DateTime? FBD_FORECAST_START_DATE { get; set; }
        public DateTime? FBD_ACT_START_DATE { get; set; }
        public DateTime? FBD_ACT_COMPLETION_DATE { get; set; }
        public int FBD_EST_LENGTH { get; set; }
        public int FBD_ACT_LENGTH { get; set; }
        public string FBD_ON_HOLD_REASON { get; set; }
        public string FBD_ON_HOLD_OTHER { get; set; }
        public string FBD_NOTES { get; set; }
        public string FBD_VAULT { get; set; }


        //------ 5-Power Dig
        public bool PWD_REQUIRED { get; set; }
        public DateTime? PWD_FORECAST_START_DATE { get; set; }
        public DateTime? PWD_ACT_START_DATE { get; set; }
        public DateTime? PWD_ACT_COMPLETION_DATE { get; set; }
        public int PWD_EST_LENGTH { get; set; }
        public int PWD_ACT_LENGTH { get; set; }
        public string PWD_ON_HOLD_REASON { get; set; }
        public string PWD_ON_HOLD_OTHER { get; set; }
        public string PWD_NOTES { get; set; }


        //------ 6-Underground Miscellaneous
        public bool UGM_REQUIRED { get; set; }
        public DateTime? UGM_ACT_COMPLETION_DATE { get; set; }
        public string UGM_ON_HOLD_REASON { get; set; }
        public string UGM_ON_HOLD_OTHER { get; set; }
        public string UGM_NOTES { get; set; }


        //------ 7-Fiber Pull
        public bool FBP_REQUIRED { get; set; }
        public string  FBP_TYPE { get; set; }
        public string FBP_Lateral_Node_Tail { get; set; }
        public DateTime? FBP_ACT_COMPLETION_DATE { get; set; }
        public string FBP_ON_HOLD_REASON { get; set; }
        public string FBP_ON_HOLD_OTHER { get; set; }
        public string FBP_NOTES { get; set; }


        //------  8- Fiber Splicing
        public bool FBS_REQUIRED { get; set; }
        public string FBS_TYPE { get; set; }
        public DateTime? FBS_ACT_COMPLETION_DATE { get; set; }
        public string FBS_ON_HOLD_REASON { get; set; }
        public string FBS_ON_HOLD_OTHER { get; set; }
        public string FBS_NOTES { get; set; }
        public DateTime? FBS_LIGHT_TEST_CLIENT_DATE { get; set; }


        //------ 9- ACPower To Pole
        public bool APP_REQUIRED { get; set; }
        public DateTime? APP_ACT_COMPLETION_DATE { get; set; }
        public string APP_ON_HOLD_REASON { get; set; }
        public string APP_ON_HOLD_OTHER { get; set; }
        public string APP_NOTES { get; set; }


        //------ 10- Shroud/Antenna
        public bool SRA_REQUIRED { get; set; }
        public DateTime? SRA_FORECAST_START_DATE { get; set; }
        public DateTime? SRA_ACT_COMPLETION_DATE { get; set; }
        public bool SRA_SHROUD_INSTALLED { get; set; }
        public bool SRA_ANTENA_INSTALLED { get; set; }
        public string SRA_SHROUD_SERIAL_NUMBER { get; set; }
        public string SRA_ION_SERIAL_NUMBER { get; set; }
        public string SRA_ON_HOLD_REASON { get; set; }
        public string SRA_ON_HOLD_OTHER { get; set; }
        public string SRA_NOTES { get; set; }


        //------ 11- PIM Sweeps
        public bool PMS_REQUIRED { get; set; }
        public DateTime? PMS_ACT_COMPLETION_DATE { get; set; }
        public DateTime? PMS_SUBMITTED_DATE { get; set; }
        public DateTime? PMS_CLIENT_APPROVAL_DATE { get; set; }
        public string PMS_ON_HOLD_REASON { get; set; }
        public string PMS_ON_HOLD_OTHER { get; set; }
        public string PMS_NOTES { get; set; }


    }

}
