using System;
namespace EPay.DataClasses
{

    public class EmployeeDC : AbstractDataClass
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string FatherName { get; set; }
        public string City { get; set; }
        
        public string Religion { get; set; }
        public DateTime? DOB { get; set; }
        public string Qualification { get; set; }
       
        public string Sex { get; set; }
       
        public int? NICNo { get; set; }
        public bool IsDirty { get; set; }
        public bool Status {get; set;}
        


    }
}
