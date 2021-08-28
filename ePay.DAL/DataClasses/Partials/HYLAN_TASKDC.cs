using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public class POST_MESSAGEDC {
        public string Type { get; set; }
        public string Message { get; set; }

        public string StackTrace { get; set; }
    }
    public class HYLAN_TASKDC
    {
        public HYLAN_TASKDC() {
            this.REQUIRED = "Y";
        }

        private POST_MESSAGEDC m_POST_MESSAGEDC = new POST_MESSAGEDC();
        public int TASK_ID { get; set; }
        public int JOB_ID { get; set; }
        public int TASK_TITLE_ID { get; set; }
        public string REQUIRED { get; set; }
        public string TASK_NAME { get; set; }
        public string NOTES { get; set; }
        public DateTime CREATED_ON { get; set; }
        public int CREATED_BY { get; set; }
        public DateTime MODIFIED_ON { get; set; }
        public int MODIFIED_BY { get; set; }
        public int LOCK_COUNTER { get; set; }
        public bool IsDirty { get; set; }

        public bool HasChanges { get; set; }
        public POST_MESSAGEDC POST_MESSAGEDC {
            get { return m_POST_MESSAGEDC; }
            set { m_POST_MESSAGEDC = value; }
        }
        
    }
    public class TASK_CONTINUITY_ZERODC : HYLAN_TASKDC
    {
        public DateTime? EST_COMPLETION_DATE { get; set; }
        public DateTime? ACT_COMPLETION_DATE { get; set; }

        public string PARTY_RESPONSIBLE { get; set; }
    }

    public class TASK_FIBER_POWER_DIGDC : HYLAN_TASKDC
    {
        public DateTime? EST_START_DATE { get; set; }
        public DateTime? ACT_START_DATE { get; set; }
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public int? EST_LENGTH { get; set; }
        public int? ACT_LENGTH { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
        public int FIBER_DIG_VAULT { get; set; }
        public int FIBER_DIG_TYPE { get; set; }
        
    }

    public class TASK_FIBER_PULL_SPLICEDC : HYLAN_TASKDC
    {
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
        public int FIBER_TYPE { get; set; }
        public int FIBER_OPTIC_POSITION { get; set; }
        public DateTime? LIGHT_TEST_CLIENT_DATE { get; set; }
    }

    public class TASK_FOUNDATION_POLE_WORKDC : HYLAN_TASKDC
    {
        public DateTime? EST_START_DATE { get; set; }
        public DateTime? ACT_START_DATE { get; set; }
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
        public int FOUNDATION_WORK_TYPE { get; set; }
        public int? POLE_WORK_TYPE { get; set; }
        public string CONED_TICKET_NUMBER { get; set; }
    }

    public class TASK_MISC_AC_POWERDC : HYLAN_TASKDC
    {
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
    }

    public class TASK_PIM_SWEEPDC : HYLAN_TASKDC
    {
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public DateTime? SUBMITTED_DATE { get; set; }
        public DateTime? CLIENT_APPROVAL_DATE { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
    }

    public class TASK_SHROUD_ANTENADC : HYLAN_TASKDC
    {
        public DateTime? EST_START_DATE { get; set; }
        public DateTime? ACT_COMPLETION_DATE { get; set; }
        public string SHROUD_INSTALLED { get; set; }
        public string ANTENA_INSTALLED { get; set; }
        public string SHROUD_SERIAL_NUMBER { get; set; }
        public string ION_SERIAL_NUMBER { get; set; }
        public int? ON_HOLD_REASON { get; set; }
        public string ON_HOLD_OTHER { get; set; }
    }

}
