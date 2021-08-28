
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 2/23/2017 3:00:46 PM
// Last Updated on: 

using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using EPay.Common;
using EPay.DataAccess;
using EPay.DataClasses;
using Microsoft.Practices.EnterpriseLibrary.Data;
using NMART.DataClasses;
namespace EPay.DataAccess
{		
	public partial class ATTACHMENTDA
	{
		public bool IsDirty {get; set;}
		
		//=================================================================
		//  	public Function LoadAll() As Boolean
		//=================================================================
		//  Loads all of the records in the database, and sets the currentRow to the first row
		//=================================================================
		public List<ATTACHMENTDC> LoadAll(DBConnection Connection)
		{
			List<ATTACHMENTDC> objATTACHMENT = new List<ATTACHMENTDC>();
			StringBuilder sql = new StringBuilder();
			sql.Append("proc_ATTACHMENTSLoadAll");

			DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
 
 
            DataSet ds = new DataSet();
			
			if (Connection.Transaction != null)
				ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
			else
				ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);
			
			  foreach (DataRow drRow in ds.Tables[0].Rows)
                {
				objATTACHMENT.Add(FillObject(drRow));
				}
				
            return objATTACHMENT;
		}
		
		public ATTACHMENTDC LoadByPrimaryKey(DBConnection Connection, int ATTACHMENT_ID)
		{
			ATTACHMENTDC objATTACHMENT = new ATTACHMENTDC();
			StringBuilder sql = new StringBuilder();
			sql.Append("proc_ATTACHMENTSLoadByPrimaryKey");

			DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
						dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, ATTACHMENT_ID);
 				

			IDataReader reader = null;

			if (Connection.Transaction != null)
				reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
			else
				reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

			objATTACHMENT = FillObject(reader);
            return objATTACHMENT;
		}
		public int Update(DBConnection Connection, List<ATTACHMENTDC> objATTACHMENTs)        
        {
            int updatedCount = 0;
            foreach (ATTACHMENTDC objATTACHMENT in objATTACHMENTs)
            {
                updatedCount = Update(Connection, objATTACHMENT);
            }
            return updatedCount;
        }
		private int Update(DBConnection Connection, ATTACHMENTDC objATTACHMENT)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
			
            
			dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, objATTACHMENT.ATTACHMENT_ID);
			dbCommandWrapper.AddInParameter("p_FILE_TITLE",DbType.String , objATTACHMENT.FILE_TITLE);
			dbCommandWrapper.AddInParameter("p_FILE_KEYWORD", DbType.String, objATTACHMENT.FILE_KEYWORD);
            dbCommandWrapper.AddInParameter("p_DOCUMENT_CATEGORY", DbType.String, objATTACHMENT.Documentcategorydc.CATEGORY_CODE);
			dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objATTACHMENT.MODIFIED_ON);
			dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.Int32, objATTACHMENT.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objATTACHMENT.LOCK_COUNTER);
            try
            {

                if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
            {
                objATTACHMENT.IsDirty = IsDirty = true;
                throw new Exception(Constants.ConcurrencyMessageSingleRow);
            }
            }
            catch (Exception exp)
            {
                objATTACHMENT.SetError(exp);
                throw exp;
            }
            return updateCount;
        }
		public List<ATTACHMENTDC> Insert(DBConnection Connection, List<ATTACHMENTDC> objATTACHMENTs)        
        {
            List<ATTACHMENTDC> addedAttachmentdcs = new List<ATTACHMENTDC>();
            foreach (ATTACHMENTDC objATTACHMENT in objATTACHMENTs)
            {
                addedAttachmentdcs.Add(Insert(Connection, objATTACHMENT));
            }
            return  addedAttachmentdcs;
        }
		public ATTACHMENTDC Insert(DBConnection Connection, ATTACHMENTDC objATTACHMENT)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
			
            
			dbCommandWrapper.AddOutParameter("p_ATTACHMENT_ID", DbType.Int32, objATTACHMENT.ATTACHMENT_ID);
			dbCommandWrapper.AddInParameter("p_FILE_NAME", DbType.String, objATTACHMENT.UPDATED_FILE_NAME);
			dbCommandWrapper.AddInParameter("p_FILE_TITLE", DbType.String, objATTACHMENT.FILE_TITLE);
			dbCommandWrapper.AddInParameter("p_FILE_KEYWORD", DbType.String, objATTACHMENT.FILE_KEYWORD);
            dbCommandWrapper.AddInParameter("p_FILE_TYPE", DbType.String, objATTACHMENT.FILE_TYPE);
            dbCommandWrapper.AddInParameter("p_FILE_SIZE", DbType.String, objATTACHMENT.FILE_SIZE);
            dbCommandWrapper.AddInParameter("p_DOCUMENT_CATEGORY", DbType.String, objATTACHMENT.Documentcategorydc.CATEGORY_CODE);
			dbCommandWrapper.AddInParameter("p_CREATED_ON", DbType.DateTime, objATTACHMENT.CREATED_ON);
			dbCommandWrapper.AddInParameter("p_CREATED_BY", DbType.Int32, objATTACHMENT.CREATED_BY);
			dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objATTACHMENT.MODIFIED_ON);
			dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.Int32, objATTACHMENT.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_Is_DELETED", DbType.Boolean, objATTACHMENT.IS_DELETED);
            dbCommandWrapper.AddInParameter("p_SCREEN_ID", DbType.Int32, objATTACHMENT.SCREEN_ID);
            dbCommandWrapper.AddInParameter("p_SCREEN_RECORD_ID", DbType.Int32, objATTACHMENT.SCREEN_RECORD_ID);

            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);
		    objATTACHMENT.ATTACHMENT_ID = (int) dbCommandWrapper.DBCommand.Parameters["@p_ATTACHMENT_ID"].Value;

            return objATTACHMENT;
        }
		public int Delete(DBConnection Connection, List<ATTACHMENTDC> objATTACHMENTs)        
        {
            int deleteCount = 0;
            foreach (ATTACHMENTDC objATTACHMENT in objATTACHMENTs)
            {
                 objATTACHMENT.IS_DELETED = true;
                 deleteCount = Delete(Connection, objATTACHMENT);
            }
            return  deleteCount;
        }
		private int Delete(DBConnection Connection, ATTACHMENTDC objATTACHMENT)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ATTACHMENTSDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            
			dbCommandWrapper.AddInParameter("p_ATTACHMENT_ID", DbType.Int32, objATTACHMENT.ATTACHMENT_ID);
            dbCommandWrapper.AddInParameter("p_IS_DELETED", DbType.Int32, objATTACHMENT.IS_DELETED);
            dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objATTACHMENT.MODIFIED_ON);
            dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.Int32, objATTACHMENT.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objATTACHMENT.LOCK_COUNTER);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
		private ATTACHMENTDC FillObject(IDataReader reader)
        {
			ATTACHMENTDC objATTACHMENT = null;
            if (reader != null && reader.Read())
            {
                DataTable schemaTable = reader.GetSchemaTable();
                objATTACHMENT = new ATTACHMENTDC();
				objATTACHMENT.ATTACHMENT_ID = (int)reader["ATTACHMENT_ID"];
				objATTACHMENT.FILE_NAME = (String)reader["FILE_NAME"];
				objATTACHMENT.FILE_TITLE = (String)reader["FILE_TITLE"];
				objATTACHMENT.FILE_KEYWORD = reader["FILE_KEYWORD"] == DBNull.Value ? null : (String)reader["FILE_KEYWORD"];
                objATTACHMENT.HYLAN_PROJECT_ID = reader["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)reader["HYLAN_PROJECT_ID"];
                objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString(reader["JOB_FILE_NUMBER"]);
                objATTACHMENT.FILE_TYPE = reader["FILE_TYPE"] == DBNull.Value ? null : (String)reader["FILE_TYPE"];
                objATTACHMENT.FILE_SIZE = reader["FILE_SIZE"] == DBNull.Value ? null : (String)reader["FILE_SIZE"];
                objATTACHMENT.DOCUMENT_CATEGORY = (string)reader["DOCUMENT_CATEGORY"];
                objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)reader["CATEGORY_TYPE"];
                objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string) reader["CATEGORY_NAME"];
                objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)reader["CATEGORY_CODE"];
                objATTACHMENT.CREATED_ON = (DateTime)reader["CREATED_ON"];
				objATTACHMENT.CREATED_BY = (int)reader["CREATED_BY"];
				objATTACHMENT.MODIFIED_ON = (DateTime)reader["MODIFIED_ON"];               
                objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime(objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
                objATTACHMENT.MODIFIED_BY = (int)reader["MODIFIED_BY"];
                objATTACHMENT.LOCK_COUNTER = reader["LOCK_COUNTER"] == DBNull.Value ? null : (int?)reader["LOCK_COUNTER"];

                reader.Close();
                reader.Dispose();
            }
            return objATTACHMENT;
        }
		private ATTACHMENTDC FillObject(DataRow row)
        {
			ATTACHMENTDC objATTACHMENT = null;
			objATTACHMENT = new ATTACHMENTDC();
			objATTACHMENT.ATTACHMENT_ID = (int)row["ATTACHMENT_ID"];
			objATTACHMENT.FILE_NAME = (String)row["FILE_NAME"];
			objATTACHMENT.FILE_TITLE = (String)row["FILE_TITLE"];
			objATTACHMENT.FILE_KEYWORD = row["FILE_KEYWORD"] == DBNull.Value ? null : (String)row["FILE_KEYWORD"];
            objATTACHMENT.HYLAN_PROJECT_ID = row["HYLAN_PROJECT_ID"] == DBNull.Value ? null : (String)row["HYLAN_PROJECT_ID"];
            objATTACHMENT.JOB_FILE_NUMBER = Convert.ToString( row["JOB_FILE_NUMBER"]);
            objATTACHMENT.JOB_ID = row["JOB_ID"] == DBNull.Value ? 0 : (int)row["JOB_ID"];
            objATTACHMENT.PROJECT_ID = row["PROJECT_ID"] == DBNull.Value ? 0 : (int)row["PROJECT_ID"];
            objATTACHMENT.FILE_TYPE = row["FILE_TYPE"] == DBNull.Value ? null : (String)row["FILE_TYPE"];
            objATTACHMENT.FILE_SIZE = row["FILE_SIZE"] == DBNull.Value ? null : (String)row["FILE_SIZE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_CODE = (string)row["CATEGORY_CODE"];
            objATTACHMENT.Documentcategorydc.CATEGORY_NAME = (string) row["CATEGORY_NAME"];
            objATTACHMENT.Documentcategorydc.CATEGORY_TYPE = (int)row["CATEGORY_TYPE"];
            objATTACHMENT.CREATED_ON = (DateTime)row["CREATED_ON"];
			objATTACHMENT.CREATED_BY = (int)row["CREATED_BY"];
			objATTACHMENT.MODIFIED_ON = (DateTime)row["MODIFIED_ON"];
            objATTACHMENT.MODIFIED_ON1 = objATTACHMENT.MODIFIED_ON != null ? Convert.ToDateTime(objATTACHMENT.MODIFIED_ON).ToString(EPay.Common.Constants.LongDateFormat) : null;
            objATTACHMENT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objATTACHMENT.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];

            return objATTACHMENT;
        }
	}
}
