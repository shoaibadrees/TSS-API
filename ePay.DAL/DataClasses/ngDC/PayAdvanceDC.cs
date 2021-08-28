using System;
namespace EPay.DataClasses
{

    public class PayAdvanceDC : AbstractDataClass
    {
        public int ID { get; set; }
        public string EmpCode { get; set; }
        public DateTime? Date { get; set; }
        public int Advance { get; set; }
        public string Description { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int NoOfInst { get; set; }
        public DateTime? EffDate { get; set; }
        public int? PaidAmount { get; set; }
        public int? InsAmount { get; set; }
      
        public DateTime? AddOn { get; set;}
        public string AddBy { get; set; }
        public DateTime? EditOn { get; set; }
        public string EditBy { get; set; }
        public bool? IsSync { get; set; }
        public string RowState { get; set; }
        public DateTime? SyncDate { get; set; }
        public int? CompanyID { get; set; }
        public string Name { get; set; }
        public bool isLoan { get; set; }
        public bool IsDirty { get; set; }

    }
}
