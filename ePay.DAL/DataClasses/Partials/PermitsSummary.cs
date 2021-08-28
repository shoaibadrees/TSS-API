using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DAL.DataClasses.Partials
{
    public class PermitsSummary
    {
        public int? PERMITS_COUNT { get; set; }
        public int? ACTIVE_COUNT { get; set; }
        public int? EXPIRED_COUNT { get; set; }
        public int? EXPIRING_5DAYS_COUNT { get; set; }
        public int? ON_HOLD_COUNT { get; set; }
        public int? REQUEST_EXTENSION_COUNT { get; set; }
        public int? REQUEST_RENEWAL_COUNT { get; set; }
        public int? PENDING_COUNT { get; set; }
        public int? REJECTED_COUNT { get; set; }
    }
}
