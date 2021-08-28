using System;
using System.Collections;
using System.Data;
using System.Collections.Generic;

namespace EPay.DataClasses
{

    public partial class COMPANIEDC
    {
       // public List<RMAGDC> COMPANYRMAGS = new List<RMAGDC>();
        public string UpdatedFields { get; set; }
        //public int[] RMAGS { get; set; }
        //public string RMAGS_NAMES { get; set; }
        public string COMPANY_CITY { get; set; }
        public string COMPANY_STATE { get; set; }
        public string COMPANY_ADDRESS { get; set; }
        public string COMPANY_ZIP { get; set; }
        public string COMPANY_HOME_RMAG_NAME { get; set; }

        public ST_STATE_LDC STATES = new ST_STATE_LDC();
        public int RMAG_ID { get; set; }

        public string BILLING_CONTACT_NAME { get; set; }
        public string BILLING_PHONE { get; set; }
        public string BILLING_CONTACT_EMAIL { get; set; }
        public string PROJECT_DIRECTOR_NAME { get; set; }
        public string PROJECT_DIRECTOR_PHONE { get; set; }
        public string PROJECT_DIRECTOR_EMAIL { get; set; }
        public string PROJECT_MANAGER_NAME { get; set; }
        public string PROJECT_MANAGER_PHONE { get; set; }
        public string PROJECT_MANAGER_EMAIL { get; set; }
        public int LOCK_COUNTER { get; set; }
    }
}
