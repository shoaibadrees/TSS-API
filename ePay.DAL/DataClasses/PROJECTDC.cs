
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/11/2017 5:38:29 PM
// Last Updated on: 

using System;
namespace EPay.DataClasses
{
    public partial class PROJECTDC:AbstractDataClass
    {
        public int PROJECT_ID { get; set; }
        public string HYLAN_PROJECT_ID { get; set; }
        public string HYLAN_JOB_NUMBER { get; set; }
        public string PROJECT_BID_NAME { get; set; }
        public int CLIENT { get; set; }
        public int PROJECT_STATUS { get; set; }
        public DateTime? TENTATIVE_PROJECT_START_DATE { get; set; }
        public DateTime? ACTUAL_PROJECT_START_DATE { get; set; }
        public DateTime? PROJECTED_END_DATE { get; set; }
        public DateTime? ACTUAL_PROJECT_CLOSE_DATE { get; set; }
        public DateTime? PROJECT_BID_DATE { get; set; }
        public DateTime? PROJECT_AWARDED { get; set; }
        public string BID_DOCUMENTS { get; set; }
        public string NOTES { get; set; }
        public string PO_NUMBER { get; set; }
        public string CREATED_NAME { get; set; }
        public string MODIFIED_NAME { get; set; }
        public DateTime CREATED_ON { get; set; }
        public int CREATED_BY { get; set; }
        public DateTime MODIFIED_ON { get; set; }
        public int MODIFIED_BY { get; set; }
        public int LOCK_COUNTER { get; set; }
        public bool ISDIRTY { get; set; }
    }
}
