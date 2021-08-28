using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public partial class REPORTDC
    {
        public String COMPANY_NAME {get; set;}
        public String RMAG_NAME { get; set; }
        public double CUSTOMERS_SERVED { get; set; }
        public double CUSTOMERS_OUT { get; set; }
        public double CASES { get; set; }
        public double CUSTOMERS_OUT_PCT { get; set; }
        public String IS_COMPANY { get; set; }
        public String COMPANY_CITY { get; set; }
        public String COMPANY_STATE { get; set; }
        public String RELEASE_ROLE { get; set; }
        public String MODIFIED_ON { get; set; }
        public string TIME_ZONE_NAME { get; set; }
        public bool APPLY_DL_SAVING { get; set; }

        public double DISTRIBUTION { get; set; }
        public double DISTRIBUTION_PCT { get; set; }
        public double TRANSMISSION { get; set; }
        public double TRANSMISSION_PCT { get; set; }
        public double DAMAGE_ASSESSMENT { get; set; }
        public double DAMAGE_ASSESSMENT_PCT { get; set; }
        public double TREE { get; set; }
        public double TREE_PCT { get; set; }
        public double SUBSTATION { get; set; }
        public double SUBSTATION_PCT { get; set; }
        public double NET_UG { get; set; }
        public double NET_UG_PCT { get; set; }

        public double NON_NATIVE_DISTRIBUTION { get; set; }
        public double NON_NATIVE_TRANSMISSION { get; set; }
        public double NON_NATIVE_DAMAGE_ASSESSMENT { get; set; }
        public double NON_NATIVE_TREE { get; set; }
        public double NON_NATIVE_SUBSTATION { get; set; }
        public double NON_NATIVE_NET_UG { get; set; }
    }
}
