using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public partial class MESSAGEDC
    {
        public string FROM { get; set; }
        public int[] MESSAGE_RMAGS { get; set; }
        public int[] MESSAGE_COMPANIES { get; set; }
        public string USER_INFO { get; set; }
        public string CALL_PURPOSE_TEXT { get; set; }
        public string TIME_ZONE_CALL_ON { get; set; }
        public string EVENT_TYPE { get; set; }

        public string RMAG_NAMES { get; set; }
        public string EVENT_NAME { get; set; }
    }
}
