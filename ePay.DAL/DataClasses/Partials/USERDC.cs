using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public partial class USERDC
    {
        public ROLEDC ROLE { get; set; }

        public int? USER_COMPANY_ID { get; set; }
        public int[] USER_COMPANIES { get; set; }
        public string USER_COMPANIES_NAMES { get; set; }
        public int[] USER_SCREENS { get; set; }
        public Boolean IS_LOGGEDIN { get; set; }
        public string  LAST_LOGIN { get; set; }
        public Int32 ALLOWED_LOGIN_ATTEMPTS { get; set; }
        public Int32 FAILED_LOGIN_ATTEMPTS { get; set; }
        public string FAILED_LOGIN_ATTEMPT_MESSAGE { get; set; }
        public string OLD_PSWD { get; set; }
        public string NEW_PSWD { get; set; }
        public DateTime PASSWORD_MODIFIED_ON { get; set; }
        public double PASSWORD_AGE { get; set; }
        public int[] HOME_RMAGS { get; set; }
        public USERDC()
        {
            this.ROLE = new ROLEDC();         
        }
        
    }
}
