using System;
using System.Collections.Generic;

namespace EPay.DataClasses
{
    public partial class ROLEDC
    {
        public List<ROLES_PERMISSIONDC> PERMISSIONS { get; set; }

        public ROLEDC()
        {
            PERMISSIONS = new List<ROLES_PERMISSIONDC>();
        }
    }
}