
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 2/23/2017 3:04:28 PM
// Last Updated on: 

using System;
namespace EPay.DataClasses
{		
	public partial class ATTACHMENTDC : AbstractDataClass
    {	
 		public int ATTACHMENT_ID { get; set; }
 		public string FILE_NAME { get; set; }
 		public string FILE_TITLE { get; set; }
 		public string FILE_KEYWORD { get; set; }
        public string HYLAN_PROJECT_ID { get; set; }
        public string JOB_FILE_NUMBER { get; set; }
        public string FILE_TYPE { get; set; }
        public string FILE_SIZE { get; set; }
        public string DOCUMENT_CATEGORY { get; set; }
 		public DateTime? CREATED_ON { get; set; }
 		public int CREATED_BY { get; set; }
 		public DateTime? MODIFIED_ON { get; set; }
 		public int MODIFIED_BY { get; set; }
 		public string USER { get; set; }
 		public bool IsDirty { get; set; }
	    public bool IS_DELETED { get; set; }
	}
}