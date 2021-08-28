using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using EPay.DataClasses;

namespace EPay.DataAccess
{
    public partial class ATTACHMENTDA
    {
        //public ATTACHMENTDC GetLastInserted(DBConnection Connection, int index)
        //{
        //    ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
        //    StringBuilder sql = new StringBuilder();
        //    sql.Append("proc_ATTACHMENTSLoadLastInserted");

        //    DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
        //    dbCommandWrapper.AddInParameter("p_Attachment_ID", DbType.Int32, index);
        //    IDataReader reader = null;

        //    if (Connection.Transaction != null)
        //        reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
        //    else
        //        reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

        //    objATTACHMENT = FillObject(reader);
        //    return objATTACHMENT;
        //}

        public List<ATTACHMENTDC> LoadAllProjectAttachments(DBConnection Connection, string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PROJECT_ATTACHMENTSLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_attachmentTypeIDs", DbType.String, attachmentTypeIDs);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillProjectAttachmentObject(drRow));
            }
            return objATTACHMENT;
        }

        public ATTACHMENTDC LoadSingleByProjectId(DBConnection Connection, int PROJECT_ID, int ATTACHMENT_ID)
        {
            ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PROJECT_ATTACHMENTSLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PROJECT_ID", DbType.Int32, PROJECT_ID);
            dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, ATTACHMENT_ID);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT = FillProjectAttachmentObject(drRow);
            }
            return objATTACHMENT;
        }
        public List<ATTACHMENTDC> LoadAllJobAttachments(DBConnection Connection, string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_JOB_ATTACHMENTSLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_attachmentTypeIDs", DbType.String, attachmentTypeIDs);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillJobAttachmentObject(drRow));
            }

            return objATTACHMENT;
        }
        public ATTACHMENTDC LoadSingleByJobId(DBConnection Connection, int JOB_ID, int ATTACHMENT_ID)
        {
            ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_JOB_ATTACHMENTSLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_JOB_ID", DbType.Int32, JOB_ID);
            dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, ATTACHMENT_ID);
            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT = FillJobAttachmentObject(drRow);
            }

            return objATTACHMENT;
        }
        public List<ATTACHMENTDC> LoadAllPermitAttachments(DBConnection Connection, string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PERMIT_ATTACHMENTSLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_attachmentTypeIDs", DbType.String, attachmentTypeIDs);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillPermitAttachmentObject(drRow));
            }

            return objATTACHMENT;
        }

        public List<ATTACHMENTDC> LoadAllDailyAttachments(DBConnection Connection, string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_DAILY_ATTACHMENTSLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_attachmentTypeIDs", DbType.String, attachmentTypeIDs);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillDailyAttachmentObject(drRow));
            }

            return objATTACHMENT;
        }
        public ATTACHMENTDC LoadSingleByPermitId(DBConnection Connection, int PERMIT_ID, int ATTACHMENT_ID)
        {
            ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PERMIT_ATTACHMENTSLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PERMIT_ID", DbType.Int32, PERMIT_ID);
            dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, ATTACHMENT_ID);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT =FillPermitAttachmentObject(drRow);
            }

            return objATTACHMENT;
        }

        public ATTACHMENTDC LoadSingleByDailyId(DBConnection Connection, int DAILY_ID, int ATTACHMENT_ID)
        {
            ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_DAILY_ATTACHMENTSLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_DAILY_ID", DbType.Int32, DAILY_ID);
            dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, ATTACHMENT_ID);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT = FillDailyAttachmentObject(drRow);
            }

            return objATTACHMENT;
        }
        public List<ATTACHMENTDC> LoadByProjectId(DBConnection Connection, int PROJECT_ID)
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSLoadByProject");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PROJECT_ID", DbType.Int32, PROJECT_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillProjectAttachmentObject(drRow));
            }
            return objATTACHMENT;
        }

        public List<ATTACHMENTDC> LoadByJobId(DBConnection Connection, int JOB_ID)
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSLoadByJob");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_JOB_ID", DbType.Int32, JOB_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillJobAttachmentObject(drRow));
            }
            return objATTACHMENT;
        }

        public List<ATTACHMENTDC> LoadByPermitId(DBConnection Connection, int PERMIT_ID)
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSLoadByPermit");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PERMIT_ID", DbType.Int32, PERMIT_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillPermitAttachmentObject(drRow));
            }
            return objATTACHMENT;
        }

        public List<ATTACHMENTDC> LoadByDailyId(DBConnection Connection, int DAILY_ID)
        {
            List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSLoadByDaily");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_Daily_ID", DbType.Int32, DAILY_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objATTACHMENT.Add(FillDailyAttachmentObject(drRow));
            }
            return objATTACHMENT;
        }

        public List<DOCUMENTCATEGORYDC> LoaddocumentCategories(DBConnection Connection, int CATEGORY_ID)
        {
            List<DOCUMENTCATEGORYDC> objDOCUMENTCATEGORY = new List<DOCUMENTCATEGORYDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_DOCUMENTCATEGORIESByType");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_CATEGORY_TYPE_ID", DbType.Int32, CATEGORY_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objDOCUMENTCATEGORY.Add(FillDocumentCategoryObject(drRow));
            }

            return objDOCUMENTCATEGORY;
        }

        private DOCUMENTCATEGORYDC FillDocumentCategoryObject(DataRow row)
        {
            DOCUMENTCATEGORYDC objDocumentCategory = null;
            objDocumentCategory = new DOCUMENTCATEGORYDC();
            objDocumentCategory.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objDocumentCategory.CATEGORY_NAME = (String)row["CATEGORY_NAME"];

            return objDocumentCategory;
        }

        private ATTACHMENTDC FillPermitAttachmentObject(DataRow row)
        {
            ATTACHMENTDC objATTACHMENT = null;
            objATTACHMENT = new ATTACHMENTDC();
            objATTACHMENT.ATTACHMENT_ID = (int)row["ATTACHMENT_ID"];
            objATTACHMENT.PERMIT_ID = (int)row["PERMIT_ID"];
            objATTACHMENT.PERMIT_NUMBER = row["PERMIT_NUMBER"] == DBNull.Value ? "" : (string)row["PERMIT_NUMBER"]; ;
            objATTACHMENT.FILE_NAME = (String)row["FILE_NAME"];
            objATTACHMENT.FILE_TITLE = (String)row["FILE_TITLE"];
            objATTACHMENT.FILE_KEYWORD = row["FILE_KEYWORD"] == DBNull.Value ? null : (String)row["FILE_KEYWORD"];
            objATTACHMENT.HYLAN_PROJECT_ID = row["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)row["HYLAN_PROJECT_ID"];
            if (row["JOB_FILE_NUMBER"] != DBNull.Value)
                objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString (row["JOB_FILE_NUMBER"]);
            objATTACHMENT.PARENT_ID = row["PERMIT_ID"] == DBNull.Value ? 0 : (int)row["PERMIT_ID"];
            objATTACHMENT.JOB_ID = row["JOB_ID"] == DBNull.Value ? 0 : (int)row["JOB_ID"];
            objATTACHMENT.PROJECT_ID = row["PROJECT_ID"] == DBNull.Value ? 0 : (int)row["PROJECT_ID"];
            objATTACHMENT.FILE_TYPE = row["FILE_TYPE"] == DBNull.Value ? null : (String)row["FILE_TYPE"];
            objATTACHMENT.FILE_SIZE = row["FILE_SIZE"] == DBNull.Value ? null : (String)row["FILE_SIZE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string)row["CATEGORY_NAME"];
            objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)row["CATEGORY_TYPE"];
            objATTACHMENT.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["CREATED_ON"];
            objATTACHMENT.CREATED_BY = (int)row["CREATED_BY"];
            objATTACHMENT.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MODIFIED_ON"];           
            objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime(objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
            objATTACHMENT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objATTACHMENT.USER = (String)row["USER"];
            objATTACHMENT.ENTITY_TYPE = "Permit";
            objATTACHMENT.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];

            if (row.Table.Columns.Contains("DOT_TRACKING_NUMBER"))
            {
                objATTACHMENT.DOT_TRACKING_NUMBER = Convert.ToString(row["DOT_TRACKING_NUMBER"]);
            }
            if (row.Table.Columns.Contains("PERMIT_NUMBER_TEXT"))
            {
                objATTACHMENT.PERMIT_NUMBER_TEXT = Convert.ToString(row["PERMIT_NUMBER_TEXT"]);
            }

            return objATTACHMENT;
        }
        private ATTACHMENTDC FillJobAttachmentObject(DataRow row)
        {
            ATTACHMENTDC objATTACHMENT = null;
            objATTACHMENT = new ATTACHMENTDC();
            objATTACHMENT.ATTACHMENT_ID = (int)row["ATTACHMENT_ID"];
            objATTACHMENT.PERMIT_NUMBER = row["PERMIT_NUMBER"] == DBNull.Value ? "" : (string)row["PERMIT_NUMBER"]; ;
            objATTACHMENT.FILE_NAME = (String)row["FILE_NAME"];
            objATTACHMENT.FILE_TITLE = (String)row["FILE_TITLE"];
            objATTACHMENT.FILE_KEYWORD = row["FILE_KEYWORD"] == DBNull.Value ? null : (String)row["FILE_KEYWORD"];
            objATTACHMENT.HYLAN_PROJECT_ID = row["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)row["HYLAN_PROJECT_ID"];
            if (row["JOB_FILE_NUMBER"] != DBNull.Value)
                objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString(row["JOB_FILE_NUMBER"]);
            objATTACHMENT.PARENT_ID = row["JOB_ID"] == DBNull.Value ? 0 : (int)row["JOB_ID"];
            objATTACHMENT.JOB_ID = row["JOB_ID"] == DBNull.Value ? 0 : (int)row["JOB_ID"];
            objATTACHMENT.PROJECT_ID = row["PROJECT_ID"] == DBNull.Value ? 0 : (int)row["PROJECT_ID"];
            objATTACHMENT.FILE_TYPE = row["FILE_TYPE"] == DBNull.Value ? null : (String)row["FILE_TYPE"];
            objATTACHMENT.FILE_SIZE = row["FILE_SIZE"] == DBNull.Value ? null : (String)row["FILE_SIZE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string)row["CATEGORY_NAME"];
            objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)row["CATEGORY_TYPE"];
            objATTACHMENT.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["CREATED_ON"];
            objATTACHMENT.CREATED_BY = (int)row["CREATED_BY"];
            objATTACHMENT.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MODIFIED_ON"];            
            objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime(objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
            objATTACHMENT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objATTACHMENT.USER = (String)row["USER"];
            objATTACHMENT.ENTITY_TYPE = "Job";
            objATTACHMENT.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];

            return objATTACHMENT;
        }
        private ATTACHMENTDC FillProjectAttachmentObject(DataRow row)
        {
            ATTACHMENTDC objATTACHMENT = null;
            objATTACHMENT = new ATTACHMENTDC();
            objATTACHMENT.ATTACHMENT_ID = (int)row["ATTACHMENT_ID"];
            objATTACHMENT.PERMIT_NUMBER = row["PERMIT_NUMBER"] == DBNull.Value ? "" : (string)row["PERMIT_NUMBER"]; 
            objATTACHMENT.FILE_NAME = (String)row["FILE_NAME"];
            objATTACHMENT.FILE_TITLE = (String)row["FILE_TITLE"];
            objATTACHMENT.FILE_KEYWORD = row["FILE_KEYWORD"] == DBNull.Value ? null : (String)row["FILE_KEYWORD"];
            objATTACHMENT.HYLAN_PROJECT_ID = row["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)row["HYLAN_PROJECT_ID"];
            if (row["JOB_FILE_NUMBER"] != DBNull.Value)
            objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString(row["JOB_FILE_NUMBER"]);
            objATTACHMENT.PROJECT_ID = row["PROJECT_ID"] == DBNull.Value ? 0 : (int)row["PROJECT_ID"];
            objATTACHMENT.FILE_TYPE = row["FILE_TYPE"] == DBNull.Value ? null : (String)row["FILE_TYPE"];
            objATTACHMENT.FILE_SIZE = row["FILE_SIZE"] == DBNull.Value ? null : (String)row["FILE_SIZE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string)row["CATEGORY_NAME"];
            objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)row["CATEGORY_TYPE"];
            objATTACHMENT.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["CREATED_ON"];
            objATTACHMENT.CREATED_BY = (int)row["CREATED_BY"];
            objATTACHMENT.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MODIFIED_ON"];
            objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime( objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
            objATTACHMENT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objATTACHMENT.USER = (String)row["USER"];
            objATTACHMENT.ENTITY_TYPE = "Project";
            objATTACHMENT.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];

            return objATTACHMENT;
        }

        private ATTACHMENTDC FillDailyAttachmentObject(DataRow row)
        {
            ATTACHMENTDC objATTACHMENT = null;
            objATTACHMENT = new ATTACHMENTDC();
            objATTACHMENT.ATTACHMENT_ID = (int)row["ATTACHMENT_ID"];
            objATTACHMENT.DAILY_ID = (int)row["DAILY_ID"];
           // objATTACHMENT.PERMIT_NUMBER = row["PERMIT_NUMBER"] == DBNull.Value ? "" : (string)row["PERMIT_NUMBER"]; ;
            objATTACHMENT.FILE_NAME = (String)row["FILE_NAME"];
            objATTACHMENT.FILE_TITLE = (String)row["FILE_TITLE"];
            objATTACHMENT.FILE_KEYWORD = row["FILE_KEYWORD"] == DBNull.Value ? null : (String)row["FILE_KEYWORD"];
            objATTACHMENT.HYLAN_PROJECT_ID = row["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)row["HYLAN_PROJECT_ID"];
            if (row["JOB_FILE_NUMBER"] != DBNull.Value)
                objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString(row["JOB_FILE_NUMBER"]);
            objATTACHMENT.PARENT_ID = row["DAILY_ID"] == DBNull.Value ? 0 : (int)row["DAILY_ID"];
            objATTACHMENT.JOB_ID = row["JOB_ID"] == DBNull.Value ? 0 : (int)row["JOB_ID"];
            objATTACHMENT.PROJECT_ID = row["PROJECT_ID"] == DBNull.Value ? 0 : (int)row["PROJECT_ID"];
            objATTACHMENT.FILE_TYPE = row["FILE_TYPE"] == DBNull.Value ? null : (String)row["FILE_TYPE"];
            objATTACHMENT.FILE_SIZE = row["FILE_SIZE"] == DBNull.Value ? null : (String)row["FILE_SIZE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string)row["CATEGORY_NAME"];
            objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)row["CATEGORY_TYPE"];
            objATTACHMENT.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["CREATED_ON"];
            objATTACHMENT.CREATED_BY = (int)row["CREATED_BY"];
            objATTACHMENT.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? (DateTime?)null : (DateTime)row["MODIFIED_ON"];
            objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime(objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
            objATTACHMENT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objATTACHMENT.USER = (String)row["USER"];
            objATTACHMENT.ENTITY_TYPE = "Daily";
            objATTACHMENT.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];

            //if (row.Table.Columns.Contains("DOT_TRACKING_NUMBER"))
            //{
            //    objATTACHMENT.DOT_TRACKING_NUMBER = Convert.ToString(row["DOT_TRACKING_NUMBER"]);
            //}
            //if (row.Table.Columns.Contains("PERMIT_NUMBER_TEXT"))
            //{
            //    objATTACHMENT.PERMIT_NUMBER_TEXT = Convert.ToString(row["PERMIT_NUMBER_TEXT"]);
            //}

            return objATTACHMENT;
        }
    }
}
