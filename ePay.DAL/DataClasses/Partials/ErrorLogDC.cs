using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public partial class ErrorLogDC : AbstractDataClass
    {
        public int ErrorLogID { get; set; }

        public int ErrorReceiver{get; set;}

        public DateTime On { get; set; }

        public string From { get; set; }

        public string Description { get; set; }
    }
}
