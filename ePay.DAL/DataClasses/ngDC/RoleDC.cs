using System;
namespace EPay.DataClasses
{		

	public class RoleDC : AbstractDataClass
    {	
 		public string RoleID { get; set; }
 		public string RoleDescription { get; set; }
 		public int SerialNo { get; set; }
 		public bool CanView { get; set; }
 		public bool CanAdd { get; set; }
 		public bool CanEdit { get; set; }
 		public bool CanDelete { get; set; }
 		public bool CanPrint { get; set; }
 		public string AddBy { get; set; }
 		public DateTime? AddOn { get; set; }
 		public string EditBy { get; set; }
 		public DateTime? EditOn { get; set; }
 		public bool IsSyncReq { get; set; }
 		public bool IsSync { get; set; }
 		public string RowState { get; set; }
 		public DateTime? SyncDate { get; set; }
 		public int? CompanyID { get; set; }
 		public bool IsDirty { get; set; }
	}
}
