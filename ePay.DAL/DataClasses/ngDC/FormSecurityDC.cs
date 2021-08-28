using System;
namespace EPay.DataClasses
{

    public class FormSecurityDC : AbstractDataClass
    {
        public int FormId { get; set; }
        public string Name { get; set; }
        public bool CanView { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        public bool CanPring { get; set; }
        
    }
}
