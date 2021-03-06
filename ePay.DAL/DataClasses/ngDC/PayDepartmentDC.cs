using System;
namespace EPay.DataClasses
{

    public class PayDepartmentDC: AbstractDataClass
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        public bool? IsSync { get; set; }
        public string RowState { get; set; }
        public DateTime? AddOn { get; set; }
        public string AddBy { get; set; }
        public DateTime? EditOn { get; set; }
        public string EditBy { get; set; }
        public DateTime? SyncDate { get; set; }
        public int? CompanyID { get; set; }
        public bool IsDirty { get; set; }
        public bool Status {get; set;}
        public string ImageName { get; set; }

    }
}
