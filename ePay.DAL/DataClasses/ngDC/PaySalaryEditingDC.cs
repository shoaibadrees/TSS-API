using System;
namespace EPay.DataClasses
{

    public class PaySalaryEditingDC : AbstractDataClass
    {
        public int ID { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string EmpCode { get; set; }
        public string EmpName { get; set; }
        public string  DesigCode { get; set; }
        public string DesigName { get; set; }
        public string DepCode { get; set; }
        public string DepName { get; set; }
        public string ShiftCode { get; set; }
        public string ShiftName { get; set; }
        public int BasicPay { get; set; }
        public int HouseAllow { get; set; }
        public int ConAllow { get; set; }
      
        public int UtilityAllow { get; set; }
        public int ITax { get; set; }
       
        public int OtherAllow { get; set; }
        public int OtherDed { get; set; }
        public int GrossSalary { get; set; }
        public int Advance { get; set; }
        public int NetSalary { get; set; }
        public Boolean Post { get; set; }
        public int NoOfDay { get; set; }
        public int TotalDays { get; set; }

        public DateTime? Date { get; set; }

        public Boolean Edit { get; set; }
        public float TotalWorkHour { get; set; }
        public string ChequeNo { get; set; }
        public float OverTime { get; set; }
        public int OverTimeAmount { get; set; }
        public int EOBIEmp { get; set; }
        public int SS { get; set; }
        public int EOBIEmployer { get; set; }
        public DateTime? AddOn { get; set;}
        public string AddBy { get; set; }
        public DateTime? EditOn { get; set; }
        public string EditBy { get; set; }
        public bool? IsSync { get; set; }
        public string RowState { get; set; }
        public DateTime? SyncDate { get; set; }
        public int? CompanyID { get; set; }
      
        public int Loan { get; set; }
        public int PerDaySalary { get; set; }
        public bool IsDirty { get; set; }

    }
}
