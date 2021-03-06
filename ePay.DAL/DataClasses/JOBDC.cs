// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/11/2017 9:45:57 PM
// Last Updated on: 

using System;
namespace EPay.DataClasses
{

    public partial class JOBDC : AbstractDataClass
    {
        public int PROJECT_ID { get; set; }
        public string JOB_FILE_NUMBER { get; set; }
        public string NODE_ID1 { get; set; }
        public string NODE_ID2 { get; set; }
        public string NODE_ID3 { get; set; }
        public string HUB { get; set; }
        public int? HYLAN_PM { get; set; }
        public string STREET_ADDRESS { get; set; }
        public string CITY { get; set; }
        public string STATE { get; set; }
        public string ZIP { get; set; }
        public string LAT { get; set; }
        public string LONG { get; set; }
        public string POLE_LOCATION { get; set; }
        public int? DOITT_NTP_STATUS { get; set; }
        public DateTime? DOITT_NTP_GRANTED_DATE { get; set; }
        public int? JOB_CATEGORY { get; set; }
        public int JOB_STATUS { get; set; }
        public string ON_HOLD_REASON { get; set; }
        public string CLIENT_PM { get; set; }
        public string JOB_NOTES { get; set; }
        public int? NUMBER_OF_SUBMITTED_PERMITS { get; set; }
        public string PERMIT_NOTES { get; set; }
        public string PUNCHLIST_COMPLETE { get; set; }
        public DateTime? PUNCHLIST_SUBMITTED_DATE { get; set; }
        public DateTime? CLIENT_APPROVAL_DATE { get; set; }
        public int? CREATED_BY { get; set; }
        public DateTime? CREATED_ON { get; set; }
        public int ? MODIFIED_BY { get; set; }
        public DateTime? MODIFIED_ON { get; set; }
        public int? LOCK_COUNTER { get; set; }
        public bool IsDirty { get; set; }
    }
}

