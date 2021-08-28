using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;


namespace EPay.DataAccess
{
    public partial class JOBDA
    {
        private JOBDC FillObject(IDataReader reader)
        {
            JOBDC objMANAGE_JOB = null;
            if (reader != null && reader.Read())
            {
                DataTable schemaTable = reader.GetSchemaTable();
                objMANAGE_JOB = new JOBDC();
                objMANAGE_JOB.JOB_ID = (int)reader["JOB_ID"];
                objMANAGE_JOB.PROJECT_ID = (int)reader["PROJECT_ID"];
                if (schemaTable.Columns.Contains("HYLAN_PROJECT_ID"))
                {
                    objMANAGE_JOB.HYLAN_PROJECT_ID = Convert.ToString(reader["HYLAN_PROJECT_ID"]);
                }
                objMANAGE_JOB.JOB_FILE_NUMBER = Convert.ToString(reader["JOB_FILE_NUMBER"]);
                objMANAGE_JOB.CJ_NUMBER = Convert.ToString(reader["CJ_NUMBER"]);
                objMANAGE_JOB.DID_NUMBER = Convert.ToString(reader["DID_NUMBER"]);
                objMANAGE_JOB.NODE_ID1 = Convert.ToString(reader["NODE_ID1"]);
                objMANAGE_JOB.NODE_ID2 = Convert.ToString(reader["NODE_ID2"]);
                objMANAGE_JOB.NODE_ID3 = Convert.ToString(reader["NODE_ID3"]);
                objMANAGE_JOB.HUB = Convert.ToString(reader["HUB"]);
                objMANAGE_JOB.HYLAN_PM = objMANAGE_JOB.HYLAN_PM = reader["HYLAN_PM"] == DBNull.Value ? null : (int?)reader["HYLAN_PM"];
                objMANAGE_JOB.STREET_ADDRESS = Convert.ToString(reader["STREET_ADDRESS"]);
                objMANAGE_JOB.CITY = Convert.ToString(reader["CITY"]);
                objMANAGE_JOB.STATE = (String)reader["STATE"];
                objMANAGE_JOB.ZIP = Convert.ToString(reader["ZIP"]);
                objMANAGE_JOB.LAT = Convert.ToString(reader["LAT"]);
                objMANAGE_JOB.LONG = Convert.ToString(reader["LONG"]);
                objMANAGE_JOB.POLE_LOCATION = Convert.ToString(reader["POLE_LOCATION"]);
                objMANAGE_JOB.DOITT_NTP_STATUS = reader["DOITT_NTP_STATUS"] == DBNull.Value ? null : (int?)reader["DOITT_NTP_STATUS"];
                if (objMANAGE_JOB.DOITT_NTP_STATUS != null && schemaTable.Columns.Contains("DOITT_NTP_STATUS_NAME"))
                {
                    objMANAGE_JOB.DOITT_NTP_STATUS_LU.LOOK_UP_ID = (int)objMANAGE_JOB.DOITT_NTP_STATUS;
                    objMANAGE_JOB.DOITT_NTP_STATUS_LU.LU_TYPE = "DOITT_NTP_STATUS";
                    objMANAGE_JOB.DOITT_NTP_STATUS_LU.LU_NAME = (String)reader["DOITT_NTP_STATUS_NAME"];
                }
                objMANAGE_JOB.DOITT_NTP_GRANTED_DATE = reader["DOITT_NTP_GRANTED_DATE"] == DBNull.Value ? null : (DateTime?)reader["DOITT_NTP_GRANTED_DATE"];
                objMANAGE_JOB.JOB_CATEGORY = reader["JOB_CATEGORY"] == DBNull.Value ? null : (int?)reader["JOB_CATEGORY"];
                if (objMANAGE_JOB.JOB_CATEGORY != null && schemaTable.Columns.Contains("JOB_CATEGORY_NAME"))
                {
                    objMANAGE_JOB.JOB_CATEGORY_LU.LOOK_UP_ID = (int)objMANAGE_JOB.JOB_CATEGORY;
                    objMANAGE_JOB.JOB_CATEGORY_LU.LU_TYPE = "JOB_CATEGORY";
                    objMANAGE_JOB.JOB_CATEGORY_LU.LU_NAME = (String)reader["JOB_CATEGORY_NAME"];
                }
                objMANAGE_JOB.JOB_STATUS = (int)reader["JOB_STATUS"];
                if (schemaTable.Columns.Contains("JOB_STATUS_NAME"))
                {
                    objMANAGE_JOB.JOB_STATUS_LU.LOOK_UP_ID = (int)objMANAGE_JOB.JOB_STATUS;
                    objMANAGE_JOB.JOB_STATUS_LU.LU_TYPE = "JOB_STATUS";
                    objMANAGE_JOB.JOB_STATUS_LU.LU_NAME = (String)reader["JOB_STATUS_NAME"];
                }
                objMANAGE_JOB.ON_HOLD_REASON = Convert.ToString(reader["ON_HOLD_REASON"]);
                objMANAGE_JOB.CLIENT_PM = Convert.ToString(reader["CLIENT_PM"]);
                objMANAGE_JOB.JOB_NOTES = Utilities.NotesFormat(Convert.ToInt32(reader["NOTES_COUNT"].ToString()), reader["NOTES_DATE"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NOTES_DATE"].ToString()));
                objMANAGE_JOB.ATTACHMENTS = Utilities.AttachmentsFormat(Convert.ToInt32(reader["ATTACHMENTS_COUNT"].ToString()));
                objMANAGE_JOB.NUMBER_OF_SUBMITTED_PERMITS = reader["NUMBER_OF_SUBMITTED_PERMITS"] == DBNull.Value ? null : (int?)reader["NUMBER_OF_SUBMITTED_PERMITS"];
                objMANAGE_JOB.PERMIT_NOTES = Convert.ToString(reader["PERMIT_NOTES"]);
                objMANAGE_JOB.PUNCHLIST_COMPLETE = Convert.ToString(reader["PUNCHLIST_COMPLETE"]);
                objMANAGE_JOB.PUNCHLIST_SUBMITTED_DATE = reader["PUNCHLIST_SUBMITTED_DATE"] == DBNull.Value ? null : (DateTime?)reader["PUNCHLIST_SUBMITTED_DATE"];
                objMANAGE_JOB.CLIENT_APPROVAL_DATE = reader["CLIENT_APPROVAL_DATE"] == DBNull.Value ? null : (DateTime?)reader["CLIENT_APPROVAL_DATE"];
                objMANAGE_JOB.PRIORITY = Convert.ToString(reader["PRIORITY"]);
                objMANAGE_JOB.CREATED_BY = reader["CREATED_BY"] == DBNull.Value ? null : (int?)reader["CREATED_BY"];
                objMANAGE_JOB.CREATED_ON = reader["CREATED_ON"] == DBNull.Value ? null : (DateTime?)reader["CREATED_ON"];
                objMANAGE_JOB.MODIFIED_BY = reader["MODIFIED_BY"] == DBNull.Value ? null : (int?)reader["MODIFIED_BY"];
                objMANAGE_JOB.MODIFIED_ON = reader["MODIFIED_ON"] == DBNull.Value ? null : (DateTime?)reader["MODIFIED_ON"];
                objMANAGE_JOB.LOCK_COUNTER = reader["LOCK_COUNTER"] == DBNull.Value ? null : (int?)reader["LOCK_COUNTER"];
                if (schemaTable.Columns.Contains("NEEDED_TASKS_COUNT"))
                {
                    objMANAGE_JOB.NEEDED_TASKS_COUNT = (int)reader["NEEDED_TASKS_COUNT"];
                }
                if (schemaTable.Columns.Contains("CLIENT"))
                {
                    objMANAGE_JOB.CLIENT_ID = (int)(reader["CLIENT"]);
                }
                objMANAGE_JOB.PO_NUMBER = reader["PO_NUMBER"] == DBNull.Value ? null : (String)reader["PO_NUMBER"];
                objMANAGE_JOB.PO_AMOUNT = reader["PO_AMOUNT"] == DBNull.Value ? 0 : (decimal?)reader["PO_AMOUNT"];
                objMANAGE_JOB.INVOICE_DATE = reader["INVOICE_DATE"] == DBNull.Value ? null : (DateTime?)reader["INVOICE_DATE"];
                objMANAGE_JOB.INVOICE_AMOUNT = reader["INVOICE_AMOUNT"] == DBNull.Value ? 0 : (decimal?)reader["INVOICE_AMOUNT"];
                reader.Close();
                reader.Dispose();
            }
            return objMANAGE_JOB;
        }
        private JOBDC FillObject(DataRow row)
        {
            JOBDC objMANAGE_JOB = null;
            objMANAGE_JOB = new JOBDC();
            objMANAGE_JOB.JOB_ID = (int)row["JOB_ID"];
            objMANAGE_JOB.PROJECT_ID = (int)row["PROJECT_ID"];
            if (row.Table.Columns.Contains("HYLAN_PROJECT_ID"))
            {
                objMANAGE_JOB.HYLAN_PROJECT_ID = Convert.ToString(row["HYLAN_PROJECT_ID"]);
            }
            if (row.Table.Columns.Contains("NEEDED_TASKS_COUNT"))
            {
                objMANAGE_JOB.NEEDED_TASKS_COUNT = (int)row["NEEDED_TASKS_COUNT"];
            }
            objMANAGE_JOB.JOB_FILE_NUMBER = Convert.ToString(row["JOB_FILE_NUMBER"]);
            objMANAGE_JOB.CJ_NUMBER = Convert.ToString(row["CJ_NUMBER"]);
            objMANAGE_JOB.DID_NUMBER = Convert.ToString(row["DID_NUMBER"]);
            objMANAGE_JOB.NODE_ID1 = Convert.ToString(row["NODE_ID1"]);
            objMANAGE_JOB.NODE_ID2 = Convert.ToString(row["NODE_ID2"]);
            objMANAGE_JOB.NODE_ID3 = Convert.ToString(row["NODE_ID3"]);
            objMANAGE_JOB.HUB = Convert.ToString(row["HUB"]);
            objMANAGE_JOB.HYLAN_PM = row["HYLAN_PM"] == DBNull.Value ? null : (int?)row["HYLAN_PM"];
            objMANAGE_JOB.STREET_ADDRESS = Convert.ToString(row["STREET_ADDRESS"]);
            objMANAGE_JOB.CITY = Convert.ToString(row["CITY"]);
            objMANAGE_JOB.STATE = (String)row["STATE"];
            objMANAGE_JOB.ZIP = Convert.ToString(row["ZIP"]);
            objMANAGE_JOB.LAT = Convert.ToString(row["LAT"]);
            objMANAGE_JOB.LONG = Convert.ToString(row["LONG"]);
            objMANAGE_JOB.POLE_LOCATION = Convert.ToString(row["POLE_LOCATION"]);
            objMANAGE_JOB.DOITT_NTP_STATUS = row["DOITT_NTP_STATUS"] == DBNull.Value ? null : (int?)row["DOITT_NTP_STATUS"];
            if (objMANAGE_JOB.DOITT_NTP_STATUS != null && row.Table.Columns.Contains("DOITT_NTP_STATUS_NAME"))
            {
                objMANAGE_JOB.DOITT_NTP_STATUS_LU.LOOK_UP_ID = (int)objMANAGE_JOB.DOITT_NTP_STATUS;
                objMANAGE_JOB.DOITT_NTP_STATUS_LU.LU_TYPE = "DOITT_NTP_STATUS";
                objMANAGE_JOB.DOITT_NTP_STATUS_LU.LU_NAME = (String)row["DOITT_NTP_STATUS_NAME"];
            }

            objMANAGE_JOB.DOITT_NTP_GRANTED_DATE = row["DOITT_NTP_GRANTED_DATE"] == DBNull.Value ? null : (DateTime?)row["DOITT_NTP_GRANTED_DATE"];
            objMANAGE_JOB.JOB_CATEGORY = row["JOB_CATEGORY"] == DBNull.Value ? null : (int?)row["JOB_CATEGORY"];
            if (objMANAGE_JOB.JOB_CATEGORY != null && row.Table.Columns.Contains("JOB_CATEGORY_NAME"))
            {
                objMANAGE_JOB.JOB_CATEGORY_LU.LOOK_UP_ID = (int)objMANAGE_JOB.JOB_CATEGORY;
                objMANAGE_JOB.JOB_CATEGORY_LU.LU_TYPE = "JOB_CATEGORY";
                objMANAGE_JOB.JOB_CATEGORY_LU.LU_NAME = (String)row["JOB_CATEGORY_NAME"];
            }
            objMANAGE_JOB.JOB_STATUS = (int)row["JOB_STATUS"];
            if (row.Table.Columns.Contains("JOB_STATUS_NAME"))
            {
                objMANAGE_JOB.JOB_STATUS_LU.LOOK_UP_ID = (int)objMANAGE_JOB.JOB_STATUS;
                objMANAGE_JOB.JOB_STATUS_LU.LU_TYPE = "JOB_STATUS";
                objMANAGE_JOB.JOB_STATUS_LU.LU_NAME = (String)row["JOB_STATUS_NAME"];
            }
            objMANAGE_JOB.ON_HOLD_REASON = Convert.ToString(row["ON_HOLD_REASON"]);
            objMANAGE_JOB.CLIENT_PM = Convert.ToString(row["CLIENT_PM"]);
            objMANAGE_JOB.JOB_NOTES = Utilities.NotesFormat(Convert.ToInt32(row["NOTES_COUNT"].ToString()), row["NOTES_DATE"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(row["NOTES_DATE"].ToString()));
            objMANAGE_JOB.ATTACHMENTS = Utilities.AttachmentsFormat(Convert.ToInt32(row["ATTACHMENTS_COUNT"].ToString()));
            objMANAGE_JOB.NUMBER_OF_SUBMITTED_PERMITS = row["NUMBER_OF_SUBMITTED_PERMITS"] == DBNull.Value ? null : (int?)row["NUMBER_OF_SUBMITTED_PERMITS"];
            objMANAGE_JOB.PERMIT_NOTES = Convert.ToString(row["PERMIT_NOTES"]);
            objMANAGE_JOB.PUNCHLIST_COMPLETE = Convert.ToString(row["PUNCHLIST_COMPLETE"]);
            objMANAGE_JOB.PUNCHLIST_SUBMITTED_DATE = row["PUNCHLIST_SUBMITTED_DATE"] == DBNull.Value ? null : (DateTime?)row["PUNCHLIST_SUBMITTED_DATE"];
            objMANAGE_JOB.CLIENT_APPROVAL_DATE = row["CLIENT_APPROVAL_DATE"] == DBNull.Value ? null : (DateTime?)row["CLIENT_APPROVAL_DATE"];
            objMANAGE_JOB.PRIORITY = Convert.ToString(row["PRIORITY"]);
            objMANAGE_JOB.CREATED_BY = row["CREATED_BY"] == DBNull.Value ? null : (int?)row["CREATED_BY"];
            objMANAGE_JOB.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? null : (DateTime?)row["CREATED_ON"];
            objMANAGE_JOB.MODIFIED_BY = row["MODIFIED_BY"] == DBNull.Value ? null : (int?)row["MODIFIED_BY"];
            objMANAGE_JOB.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? null : (DateTime?)row["MODIFIED_ON"];
            objMANAGE_JOB.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];
            if (row.Table.Columns.Contains("HYLAN_PM_NAME"))
                objMANAGE_JOB.HYLAN_PM_NAME = Convert.ToString(row["HYLAN_PM_NAME"]);
            if (row.Table.Columns.Contains("CLIENT_NAME"))
                objMANAGE_JOB.CLIENT_NAME = Convert.ToString(row["CLIENT_NAME"]);
            if (row.Table.Columns.Contains("CLIENT"))
            {
                objMANAGE_JOB.CLIENT_ID = (int)(row["CLIENT"]);
            }

            if (row.Table.Columns.Contains("PERMITS_COUNT"))
            {
                objMANAGE_JOB.PermitsSummary.PERMITS_COUNT = row["PERMITS_COUNT"]== DBNull.Value ? null : (int?)row["PERMITS_COUNT"];
                objMANAGE_JOB.PermitsSummary.ACTIVE_COUNT = row["ACTIVE_COUNT"] == DBNull.Value ? null : (int?)row["ACTIVE_COUNT"];
                objMANAGE_JOB.PermitsSummary.EXPIRED_COUNT = row["EXPIRED_COUNT"] == DBNull.Value ? null : (int?)row["EXPIRED_COUNT"];
                objMANAGE_JOB.PermitsSummary.EXPIRING_5DAYS_COUNT = row["EXPIRING_5DAYS_COUNT"] == DBNull.Value ? null : (int?)row["EXPIRING_5DAYS_COUNT"];
                objMANAGE_JOB.PermitsSummary.ON_HOLD_COUNT = row["ON_HOLD_COUNT"] == DBNull.Value ? null : (int?)row["ON_HOLD_COUNT"];
                objMANAGE_JOB.PermitsSummary.REQUEST_EXTENSION_COUNT = row["REQUEST_EXTENSION_COUNT"] ==DBNull.Value ? null : (int?)row["REQUEST_EXTENSION_COUNT"];
                objMANAGE_JOB.PermitsSummary.REQUEST_RENEWAL_COUNT = row["REQUEST_RENEWAL_COUNT"] == DBNull.Value ? null : (int?)row["REQUEST_RENEWAL_COUNT"];
                objMANAGE_JOB.PermitsSummary.PENDING_COUNT = row["PENDING_COUNT"] == DBNull.Value ? null : (int?)row["PENDING_COUNT"];
                objMANAGE_JOB.PermitsSummary.REJECTED_COUNT = row["REJECTED_COUNT"] == DBNull.Value ? null : (int?)row["REJECTED_COUNT"];

            }

            objMANAGE_JOB.PO_NUMBER = row["PO_NUMBER"] == DBNull.Value ? null : (String)row["PO_NUMBER"];
            objMANAGE_JOB.PO_AMOUNT = row["PO_AMOUNT"] == DBNull.Value ? 0 : (decimal?)row["PO_AMOUNT"];
            objMANAGE_JOB.INVOICE_DATE = row["INVOICE_DATE"] == DBNull.Value ? null : (DateTime?)row["INVOICE_DATE"];
            objMANAGE_JOB.INVOICE_AMOUNT = row["INVOICE_AMOUNT"] == DBNull.Value ? 0 : (decimal?)row["INVOICE_AMOUNT"];
            return objMANAGE_JOB;
        }
    }
}
