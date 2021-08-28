using System;
namespace EPay.DataClasses
{		
	public  partial class MATERIALDC : AbstractDataClass
    {
        private POST_MESSAGEDC m_POST_MESSAGEDC = new POST_MESSAGEDC();
        public int MATERIAL_ID { get; set; }
 		public int DAILY_TYPE { get; set; }
 		public string ID_NUMBER { get; set; }
 		public string MATERIAL_NAME { get; set; }
        public int MATERIAL_VALUE_ID { get; set; }
        public int DAILY_ID { get; set; }
        public decimal? UNITS { get; set; }
        public string COMMENTS { get; set; }

        public int? SUB_CATEGORY { get; set; }
        public DateTime CREATED_ON { get; set; }
        public int CREATED_BY { get; set; }
        public DateTime MODIFIED_ON { get; set; }
        public int MODIFIED_BY { get; set; }
        public int LOCK_COUNTER { get; set; }
        public bool IsDirty { get; set; }
        public bool HasChanges { get; set; }
        public POST_MESSAGEDC POST_MESSAGEDC
        {
            get { return m_POST_MESSAGEDC; }
            set { m_POST_MESSAGEDC = value; }
        }
    }
}
