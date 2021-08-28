using System;
namespace EPay.DataClasses
{		
	
	public class UserDC : AbstractDataClass
    {	
 		public string UserCode { get; set; }
 		public string UserID { get; set; }
 		public string Password { get; set; }
 		public string RoleID { get; set; }
 		public bool? Status { get; set; }
 		public DateTime? LastLoginDate { get; set; }
 		public int? WrongTries { get; set; }
 		public DateTime? LastWrongTryDate { get; set; }
 		public DateTime? AddOn { get; set; }
 		public string AddBy { get; set; }
 		public DateTime? EditOn { get; set; }
 		public string EditBy { get; set; }
 		public bool? IsSyncReq { get; set; }
 		public string UserName { get; set; }
 		public string Address1 { get; set; }
 		public string Address2 { get; set; }
 		public string Email { get; set; }
 		public string PhoneHome { get; set; }
 		public string Cell1 { get; set; }
 		public string Cell2 { get; set; }
 		public string Other { get; set; }
 		public int? CompanyID { get; set; }
 		public bool IsSync { get; set; }
 		public string RowState { get; set; }
 		public DateTime? SyncDate { get; set; }
 		public bool IsDirty { get; set; }
	}
}
