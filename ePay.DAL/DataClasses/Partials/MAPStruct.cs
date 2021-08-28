using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    public class MAPStruct : AbstractDataClass
    {
        public int EVENT_ID { get; set; }
        public int RMAG_ID { get; set; }
        public string RESOURCE_TYPE { get; set; }
    }
}
