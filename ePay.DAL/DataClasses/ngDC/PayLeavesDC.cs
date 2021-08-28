using System;
namespace EPay.DataClasses
{

    public class PayLeavesDC: AbstractDataClass
    {
        public int ID { get; set; }
        public string EmpCode { get; set; }
        public DateTime? Date { get; set; }
        public string Remarks { get; set; }
        
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public int Days { get; set; }
        public string Type { get; set; }
      
       
        public bool? IsSync { get; set; }
        public string RowState { get; set; }
        public DateTime? AddOn { get; set;}
        public string AddBy { get; set; }
        public DateTime? EditOn { get; set; }
        public string EditBy { get; set; }
        public DateTime? SyncDate { get; set; }
        public int? CompanyID { get; set; }
        public string Name { get; set; }

        public bool IsDirty { get; set; }

    }
}
