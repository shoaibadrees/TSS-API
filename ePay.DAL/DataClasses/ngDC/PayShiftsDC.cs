using System;
namespace EPay.DataClasses
{

    public class PayShiftsDC: AbstractDataClass
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Start1 { get; set; }
        
        public string End1 { get; set; }
        public bool Split { get; set; }
        public string Start2 { get; set; }
        public string End2 { get; set; }
        public int? Relaxation { get; set; }
        public int? Duration { get; set; }
        public bool? NextDay { get; set; }
        public bool? IsSync { get; set; }
        public string RowState { get; set; }
        public DateTime? AddOn { get; set;}
        public string AddBy { get; set; }
        public DateTime? EditOn { get; set; }
        public string EditBy { get; set; }
        public DateTime? SyncDate { get; set; }
        public int? CompanyID { get; set; }
        public int? ShiftEndingAdjustmentHours { get; set; }
        public bool IsDirty { get; set; }

    }
}
