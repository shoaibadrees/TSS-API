using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.DataClasses;
namespace EPay.DataAccess
{
    public partial class PROJECTDA
    {
        private PROJECTDC FillObject(DataRow row)
        {
            PROJECTDC objPROJECT = null;
            objPROJECT = new PROJECTDC();
            objPROJECT.PROJECT_ID = (int)row["PROJECT_ID"];
            objPROJECT.HYLAN_PROJECT_ID = (String)row["HYLAN_PROJECT_ID"];
            objPROJECT.HYLAN_JOB_NUMBER = row["HYLAN_JOB_NUMBER"] == DBNull.Value ? null : (String)row["HYLAN_JOB_NUMBER"];
            objPROJECT.PROJECT_BID_NAME = row["PROJECT_BID_NAME"] == DBNull.Value ? null : (String)row["PROJECT_BID_NAME"];
            objPROJECT.PROJECT_ID = (int)row["PROJECT_ID"];
            objPROJECT.CLIENT = (int)row["CLIENT"];
            objPROJECT.TENTATIVE_PROJECT_START_DATE = row["TENTATIVE_PROJECT_START_DATE"] == DBNull.Value ? null : (DateTime?)row["TENTATIVE_PROJECT_START_DATE"];
            objPROJECT.ACTUAL_PROJECT_START_DATE = row["ACTUAL_PROJECT_START_DATE"] == DBNull.Value ? null : (DateTime?)row["ACTUAL_PROJECT_START_DATE"];
            objPROJECT.PROJECTED_END_DATE = row["PROJECTED_END_DATE"] == DBNull.Value ? null : (DateTime?)row["PROJECTED_END_DATE"];
            objPROJECT.ACTUAL_PROJECT_CLOSE_DATE = row["ACTUAL_PROJECT_CLOSE_DATE"] == DBNull.Value ? null : (DateTime?)row["ACTUAL_PROJECT_CLOSE_DATE"];
            objPROJECT.PROJECT_BID_DATE = row["PROJECT_BID_DATE"] == DBNull.Value ? null : (DateTime?)row["PROJECT_BID_DATE"];
            objPROJECT.PROJECT_AWARDED = row["PROJECT_AWARDED"] == DBNull.Value ? null : (DateTime?)row["PROJECT_AWARDED"];
            objPROJECT.BID_DOCUMENTS = row["BID_DOCUMENTS"] == DBNull.Value ? null : (String)row["BID_DOCUMENTS"];
            objPROJECT.NOTES = Utilities.NotesFormat(Convert.ToInt32(row["NOTES_COUNT"].ToString()), row["NOTES_DATE"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(row["NOTES_DATE"].ToString()));
            objPROJECT.ATTACHMENTS = Utilities.AttachmentsFormat(Convert.ToInt32(row["ATTACHMENTS_COUNT"].ToString()));
            objPROJECT.PO_NUMBER = row["PO_NUMBER"] == DBNull.Value ? null : (String)row["PO_NUMBER"];
            objPROJECT.PO_AMOUNT = row["PO_AMOUNT"] == DBNull.Value ? 0 : (decimal?)row["PO_AMOUNT"];
            objPROJECT.CREATED_ON = (DateTime)row["CREATED_ON"];
            objPROJECT.CREATED_BY = (int)row["CREATED_BY"];
            objPROJECT.MODIFIED_ON = (DateTime)row["MODIFIED_ON"];
            objPROJECT.MODIFIED_BY = (int)row["MODIFIED_BY"];
            objPROJECT.LOCK_COUNTER = (int)row["LOCK_COUNTER"];

            objPROJECT.CLIENT_NAME = row["CLIENT_NAME"] == DBNull.Value ? null : (String)row["CLIENT_NAME"];
            objPROJECT.PROJECT_STATUS = (int)row["PROJECT_STATUS"];
            if (row.Table.Columns.Contains("PROJECT_STATUS_NAME") && row["PROJECT_STATUS_NAME"] != DBNull.Value)
            {
                objPROJECT.PROJECT_STATUS_LU.LOOK_UP_ID = (int)row["PROJECT_STATUS"];
                objPROJECT.PROJECT_STATUS_LU.LU_TYPE = "PROJECT_STATUS";
                objPROJECT.PROJECT_STATUS_LU.LU_NAME = (string)row["PROJECT_STATUS_NAME"];
            }
            if (row.Table.Columns.Contains("JOBS"))
            {
                objPROJECT.JOBS = Convert.ToString(row["JOBS"]);
            }
            

            return objPROJECT;
        }
        private PROJECTDC FillObject(IDataReader reader)
        {
            PROJECTDC objPROJECT = null;
            if (reader != null && reader.Read())
            {
                DataTable schemaTable = reader.GetSchemaTable();
                objPROJECT = new PROJECTDC();
                objPROJECT.PROJECT_ID = (int)reader["PROJECT_ID"];
                objPROJECT.HYLAN_PROJECT_ID = (String)reader["HYLAN_PROJECT_ID"];
                objPROJECT.HYLAN_JOB_NUMBER = reader["HYLAN_JOB_NUMBER"] == DBNull.Value ? null : (String)reader["HYLAN_JOB_NUMBER"];
                objPROJECT.PROJECT_BID_NAME = reader["PROJECT_BID_NAME"] == DBNull.Value ? null : (String)reader["PROJECT_BID_NAME"];
                objPROJECT.CLIENT = (int)reader["CLIENT"];
                objPROJECT.TENTATIVE_PROJECT_START_DATE = reader["TENTATIVE_PROJECT_START_DATE"] == DBNull.Value ? null : (DateTime?)reader["TENTATIVE_PROJECT_START_DATE"];
                objPROJECT.ACTUAL_PROJECT_START_DATE = reader["ACTUAL_PROJECT_START_DATE"] == DBNull.Value ? null : (DateTime?)reader["ACTUAL_PROJECT_START_DATE"];
                objPROJECT.PROJECTED_END_DATE = reader["PROJECTED_END_DATE"] == DBNull.Value ? null : (DateTime?)reader["PROJECTED_END_DATE"];
                objPROJECT.ACTUAL_PROJECT_CLOSE_DATE = reader["ACTUAL_PROJECT_CLOSE_DATE"] == DBNull.Value ? null : (DateTime?)reader["ACTUAL_PROJECT_CLOSE_DATE"];
                objPROJECT.PROJECT_BID_DATE = reader["PROJECT_BID_DATE"] == DBNull.Value ? null : (DateTime?)reader["PROJECT_BID_DATE"];
                objPROJECT.PROJECT_AWARDED = reader["PROJECT_AWARDED"] == DBNull.Value ? null : (DateTime?)reader["PROJECT_AWARDED"];
                objPROJECT.BID_DOCUMENTS = reader["BID_DOCUMENTS"] == DBNull.Value ? null : (String)reader["BID_DOCUMENTS"];
                objPROJECT.NOTES = Utilities.NotesFormat(Convert.ToInt32(reader["NOTES_COUNT"].ToString()), reader["NOTES_DATE"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NOTES_DATE"].ToString()));
                objPROJECT.ATTACHMENTS = Utilities.AttachmentsFormat(Convert.ToInt32(reader["ATTACHMENTS_COUNT"].ToString()));
                objPROJECT.PO_NUMBER = reader["PO_NUMBER"] == DBNull.Value ? null : (String)reader["PO_NUMBER"];               
                objPROJECT.PO_AMOUNT = objPROJECT.PO_AMOUNT = reader["PO_AMOUNT"] == DBNull.Value ? 0 : (decimal?)reader["PO_AMOUNT"];
                objPROJECT.CREATED_ON = (DateTime)reader["CREATED_ON"];
                objPROJECT.CREATED_BY = (int)reader["CREATED_BY"];
                objPROJECT.MODIFIED_ON = (DateTime)reader["MODIFIED_ON"];
                objPROJECT.MODIFIED_BY = (int)reader["MODIFIED_BY"];
                objPROJECT.LOCK_COUNTER = (int)reader["LOCK_COUNTER"];

                objPROJECT.CLIENT_NAME = reader["CLIENT_NAME"] == DBNull.Value ? null : (String)reader["CLIENT_NAME"];
                objPROJECT.PROJECT_STATUS = (int)reader["PROJECT_STATUS"];
                if (schemaTable.Columns.Contains("PROJECT_STATUS_NAME") && reader["PROJECT_STATUS_NAME"] != DBNull.Value)
                {
                    objPROJECT.PROJECT_STATUS_LU.LOOK_UP_ID = objPROJECT.PROJECT_STATUS;
                    objPROJECT.PROJECT_STATUS_LU.LU_TYPE = "PROJECT_STATUS";
                    objPROJECT.PROJECT_STATUS_LU.LU_NAME = (String)reader["PROJECT_STATUS_NAME"];
                }

                reader.Close();
                reader.Dispose();
            }
            return objPROJECT;
        }
    }
}
