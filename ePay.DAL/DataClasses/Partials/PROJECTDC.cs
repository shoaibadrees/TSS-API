using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public partial class PROJECTDC
    {
        public LOOK_UPDC PROJECT_STATUS_LU = new LOOK_UPDC();
        //public string CLIENT { get; set; }
        public string CLIENT_NAME { get; set; }
        public string ATTACHMENTS { get; set; }
        public int NOTES_COUNT { get; set; }
        public DateTime NOTES_DATE { get; set; }
        public decimal? PO_AMOUNT { get; set; }
        public string JOBS { get; set; }
    }
}
