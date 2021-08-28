using System;

namespace EPay.DataClasses
{
    public partial class DailyHoursReportDC
    {
        public int DAILY_ID { get; set; }
        public int? JOB_ID { get; set; }
        public int? PROJECT_ID { get; set; }
        public string HYLAN_PROJECT_ID { get; set; }
        public string HYLAN_JOB_NUMBER { get; set; }
        public string JOB_FILE_NUMBER { get; set; }
        public int? DAILY_TYPE { get; set; }
        public string DAILY_TYPE_NAME { get; set; }
        public string DAILY_DATE { get; set; }
        public string DAY_OF_WEEK { get; set; }
        public int? DAILY_DAYS { get; set; }
        public int? STATUS { get; set; }
        public string DAILY_STATUS_NAME { get; set; }
        public string NAME { get; set; }
        public string JOB_TYPE { get; set; }
        public decimal? ST_HOURS { get; set; }
        public decimal? OT_HOURS { get; set; }
        public decimal? HOURS_DIFF { get; set; }
        public decimal? TOTAL_HOURS { get; set; }
        public string CLIENT_NAME { get; set; }
        public int DAILYS_ROW_COUNT { get; set; }
        public int JOBS_ROWS_COUNT { get; set; }


    }

  
}
