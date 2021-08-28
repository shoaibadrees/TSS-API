using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public class TASK_MATRIXDC
    {
        public int JOB_ID { get; set; }
        public int PROJECT_ID { get; set; }
        public string HYLAN_PROJECT_ID { get; set; }
        public string JOB_FILE_NUMBER { get; set; }
        public string CLIENT_NAME { get; set; }
        public int NEEDED_TASKS_COUNT { get; set; }
        public string CTZ_STATUS { get; set; }
        public string FDW_STATUS { get; set; }
        public string PLW_STATUS { get; set; }
        public string FBD_STATUS { get; set; }
        public string PWD_STATUS { get; set; }
        public string UGM_STATUS { get; set; }
        public string FBP_STATUS { get; set; }
        public string FBS_STATUS { get; set; }
        public string APP_STATUS { get; set; }
        public string SRA_STATUS { get; set; }
        public string PMS_STATUS { get; set; }

        public string TASK_NAME { get; set; }
        public List<DD_DTO> ON_HOLD_REASONS { get; set; }
    }
}
