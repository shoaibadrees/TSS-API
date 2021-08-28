using System;

namespace EPay.DAL.DataClassesExtension
{
    public class FileDescription
    {
        public int ATTACHMENT_ID { get; set; }
        public string FILENAME { get; set; }
        public string FILETITLE { get; set; }
        public string FILEKEYWORD { get; set; }
        public int FILENUMBER { get; set; }
        public int DOCUMENTCATEGORY { get; set; }
        public DateTime CREATEDON { get; set; }
        public string CREATEDBY { get; set; }
        public DateTime MODIFIEDON { get; set; }
        public string MODIFIEDBY { get; set; }
        public int USERID { get; set; }
       
    }
}
