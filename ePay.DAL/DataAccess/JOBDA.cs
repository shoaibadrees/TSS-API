﻿
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/11/2017 9:59:49 PM
// Last Updated on: 

using EPay.Common;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;


namespace EPay.DataAccess
{
    public partial class JOBDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<JOBDC> LoadAll(DBConnection Connection)
        {
            List<JOBDC> objMANAGE_JOB = new List<JOBDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objMANAGE_JOB.Add(FillObject(drRow));
            }

            return objMANAGE_JOB;
        }

        public JOBDC LoadByPrimaryKey(DBConnection Connection, int JOB_ID)
        {
            JOBDC objMANAGE_JOB = new JOBDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_JOB_ID", DbType.Int32, JOB_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            if(ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                objMANAGE_JOB = FillObject(ds.Tables[0].Rows[0]);
            return objMANAGE_JOB;
        }

        public JOBDC LoadByKey(DBConnection Connection, int PROJECT_ID, int JOB_FILE_NUMBER)
        {
            JOBDC objMANAGE_JOB = new JOBDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSLoadByKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PROJECT_ID", DbType.Int32, PROJECT_ID);
            dbCommandWrapper.AddInParameter("p_JOB_FILE_NUMBER", DbType.String, JOB_FILE_NUMBER);


            IDataReader reader = null;

            if (Connection.Transaction != null)
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

            objMANAGE_JOB = FillObject(reader);
            return objMANAGE_JOB;
        }

        public List<JOBDC> LoadByFilters(DBConnection Connection,string projectIDs, string doITTNTPStatusIDs, string jobCategoryIDs, string jobStatusIDs, string clientIDs = "All")
        {
            List<JOBDC> objMANAGE_JOB = new List<JOBDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSLoadByFilters");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter ("p_ProjectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_DoITTNTPStatusIDs", DbType.String, doITTNTPStatusIDs);
            dbCommandWrapper.AddInParameter("p_JobCategoryIDs", DbType.String, jobCategoryIDs);
            dbCommandWrapper.AddInParameter("p_JobStatusIDs", DbType.String, jobStatusIDs);
            dbCommandWrapper.AddInParameter("p_clientIDs", DbType.String, clientIDs);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objMANAGE_JOB.Add(FillObject(drRow));
            }

            return objMANAGE_JOB;
        }

        public List<JOBDC> MapJobsLoadByFilters(DBConnection Connection, string projectIDs, string jobStatusIDs, string clientIDs = "All")
        {
            List<JOBDC> objMANAGE_JOB = new List<JOBDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MAP_JOBSLoadByFilters");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_ProjectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_JobStatusIDs", DbType.String, jobStatusIDs);
            dbCommandWrapper.AddInParameter("p_clientIDs", DbType.String, clientIDs);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objMANAGE_JOB.Add(FillObject(drRow));
            }

            return objMANAGE_JOB;
        }

        public List<JOBDC> GetAllJobsWithInvalidLatLongs(DBConnection Connection)
        {
            List<JOBDC> list = new List<JOBDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_GetAllJobsWithInvalidLatLongs");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
          
            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            list.AddRange(Utility.ConvertToObjects<JOBDC>(ds.Tables[0]));

            return list;
        }

        public int Update(DBConnection Connection, JOBDC objMANAGE_JOB, bool OnlyUpdateLatLong = false)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_JOB_ID", DbType.Int32, objMANAGE_JOB.JOB_ID);
            dbCommandWrapper.AddInParameter("p_PROJECT_ID", DbType.Int32, objMANAGE_JOB.PROJECT_ID);
            dbCommandWrapper.AddInParameter("p_JOB_FILE_NUMBER", DbType.String, objMANAGE_JOB.JOB_FILE_NUMBER);
            dbCommandWrapper.AddInParameter("p_NODE_ID1", DbType.String, objMANAGE_JOB.NODE_ID1);
            dbCommandWrapper.AddInParameter("p_NODE_ID2", DbType.String, objMANAGE_JOB.NODE_ID2);
            dbCommandWrapper.AddInParameter("p_NODE_ID3", DbType.String, objMANAGE_JOB.NODE_ID3);
            dbCommandWrapper.AddInParameter("p_HUB", DbType.String, objMANAGE_JOB.HUB);
            dbCommandWrapper.AddInParameter("p_HYLAN_PM", DbType.Int32, objMANAGE_JOB.HYLAN_PM);
            dbCommandWrapper.AddInParameter("p_STREET_ADDRESS", DbType.String, objMANAGE_JOB.STREET_ADDRESS);
            dbCommandWrapper.AddInParameter("p_CITY", DbType.String, objMANAGE_JOB.CITY);
            dbCommandWrapper.AddInParameter("p_STATE", DbType.String, objMANAGE_JOB.STATE);
            dbCommandWrapper.AddInParameter("p_ZIP", DbType.String, objMANAGE_JOB.ZIP);
            dbCommandWrapper.AddInParameter("p_LAT", DbType.String, objMANAGE_JOB.LAT);
            dbCommandWrapper.AddInParameter("p_LONG", DbType.String, objMANAGE_JOB.LONG);
            dbCommandWrapper.AddInParameter("p_POLE_LOCATION", DbType.String, objMANAGE_JOB.POLE_LOCATION);
            dbCommandWrapper.AddInParameter("p_DOITT_NTP_STATUS", DbType.Int32, objMANAGE_JOB.DOITT_NTP_STATUS);
            dbCommandWrapper.AddInParameter("p_DOITT_NTP_GRANTED_DATE", DbType.DateTime, objMANAGE_JOB.DOITT_NTP_GRANTED_DATE);
            dbCommandWrapper.AddInParameter("p_JOB_CATEGORY", DbType.Int32, objMANAGE_JOB.JOB_CATEGORY);
            dbCommandWrapper.AddInParameter("p_JOB_STATUS", DbType.Int32, objMANAGE_JOB.JOB_STATUS);
            dbCommandWrapper.AddInParameter("p_ON_HOLD_REASON", DbType.String, objMANAGE_JOB.ON_HOLD_REASON);
            dbCommandWrapper.AddInParameter("p_CLIENT_PM", DbType.String, objMANAGE_JOB.CLIENT_PM);
            dbCommandWrapper.AddInParameter("p_JOB_NOTES", DbType.String, objMANAGE_JOB.JOB_NOTES);
            dbCommandWrapper.AddInParameter("p_NUMBER_OF_SUBMITTED_PERMITS", DbType.Int32, objMANAGE_JOB.NUMBER_OF_SUBMITTED_PERMITS);
            dbCommandWrapper.AddInParameter("p_PERMIT_NOTES", DbType.String, objMANAGE_JOB.PERMIT_NOTES);
            dbCommandWrapper.AddInParameter("p_PUNCHLIST_COMPLETE", DbType.String, objMANAGE_JOB.PUNCHLIST_COMPLETE);
            dbCommandWrapper.AddInParameter("p_PUNCHLIST_SUBMITTED_DATE", DbType.DateTime, objMANAGE_JOB.PUNCHLIST_SUBMITTED_DATE);
            dbCommandWrapper.AddInParameter("p_CLIENT_APPROVAL_DATE", DbType.DateTime, objMANAGE_JOB.CLIENT_APPROVAL_DATE);
            dbCommandWrapper.AddInParameter("p_CJ_NUMBER", DbType.String, objMANAGE_JOB.CJ_NUMBER);
            dbCommandWrapper.AddInParameter("p_DID_NUMBER", DbType.String, objMANAGE_JOB.DID_NUMBER);
            dbCommandWrapper.AddInParameter("p_PRIORITY", DbType.String, objMANAGE_JOB.PRIORITY);
            dbCommandWrapper.AddInParameter("p_CREATED_BY", DbType.Int32, objMANAGE_JOB.CREATED_BY);
            dbCommandWrapper.AddInParameter("p_CREATED_ON", DbType.DateTime, objMANAGE_JOB.CREATED_ON);
            dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.String, objMANAGE_JOB.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objMANAGE_JOB.MODIFIED_ON);
            dbCommandWrapper.AddInParameter("p_OnlyUpdateLatLong", DbType.Boolean, OnlyUpdateLatLong);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objMANAGE_JOB.LOCK_COUNTER);
            dbCommandWrapper.AddInParameter("p_PO_NUMBER", DbType.String, objMANAGE_JOB.PO_NUMBER);
            dbCommandWrapper.AddInParameter("p_PO_AMOUNT", DbType.Decimal, objMANAGE_JOB.PO_AMOUNT);
            dbCommandWrapper.AddInParameter("p_INVOICE_DATE", DbType.DateTime, objMANAGE_JOB.INVOICE_DATE);
            dbCommandWrapper.AddInParameter("p_INVOICE_AMOUNT", DbType.Decimal, objMANAGE_JOB.INVOICE_AMOUNT);
            try
            {
                if (Connection.Transaction != null)
                    updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
                else
                    updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

                if (updateCount == 0)
                {
                    objMANAGE_JOB.IsDirty = IsDirty = true;
                    throw new Exception(Constants.ConcurrencyMessageSingleRow);
                }
            }
            catch (Exception exp)
            {
                //Utilities.InsertIntoErrorLog("Error: JOB UPDATE ", exp.Message + "\r\n" + exp.StackTrace, Convert.ToInt32(objMANAGE_JOB.MODIFIED_BY));
                objMANAGE_JOB.SetError(exp);
                throw exp;
            }

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<JOBDC> objMANAGE_JOBs)
        {
            int insertCount = 0;
            foreach (JOBDC objMANAGE_JOB in objMANAGE_JOBs)
            {
                insertCount = Insert(Connection, objMANAGE_JOB);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, JOBDC objMANAGE_JOB)
        {
            int p_JOB_ID = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddOutParameter("p_JOB_ID", DbType.Int32, objMANAGE_JOB.JOB_ID);
            dbCommandWrapper.AddInParameter("p_PROJECT_ID", DbType.Int32, objMANAGE_JOB.PROJECT_ID);
            dbCommandWrapper.AddInParameter("p_JOB_FILE_NUMBER", DbType.String, objMANAGE_JOB.JOB_FILE_NUMBER);
            dbCommandWrapper.AddInParameter("p_NODE_ID1", DbType.String, objMANAGE_JOB.NODE_ID1);
            dbCommandWrapper.AddInParameter("p_NODE_ID2", DbType.String, objMANAGE_JOB.NODE_ID2);
            dbCommandWrapper.AddInParameter("p_NODE_ID3", DbType.String, objMANAGE_JOB.NODE_ID3);
            dbCommandWrapper.AddInParameter("p_HUB", DbType.String, objMANAGE_JOB.HUB);
            dbCommandWrapper.AddInParameter("p_HYLAN_PM", DbType.Int32, objMANAGE_JOB.HYLAN_PM);
            dbCommandWrapper.AddInParameter("p_STREET_ADDRESS", DbType.String, objMANAGE_JOB.STREET_ADDRESS);
            dbCommandWrapper.AddInParameter("p_CITY", DbType.String, objMANAGE_JOB.CITY);
            dbCommandWrapper.AddInParameter("p_STATE", DbType.String, objMANAGE_JOB.STATE);
            dbCommandWrapper.AddInParameter("p_ZIP", DbType.String, objMANAGE_JOB.ZIP);
            dbCommandWrapper.AddInParameter("p_LAT", DbType.String, objMANAGE_JOB.LAT);
            dbCommandWrapper.AddInParameter("p_LONG", DbType.String, objMANAGE_JOB.LONG);
            dbCommandWrapper.AddInParameter("p_POLE_LOCATION", DbType.String, objMANAGE_JOB.POLE_LOCATION);
            dbCommandWrapper.AddInParameter("p_DOITT_NTP_STATUS", DbType.Int32, objMANAGE_JOB.DOITT_NTP_STATUS);
            dbCommandWrapper.AddInParameter("p_DOITT_NTP_GRANTED_DATE", DbType.DateTime, objMANAGE_JOB.DOITT_NTP_GRANTED_DATE);
            dbCommandWrapper.AddInParameter("p_JOB_CATEGORY", DbType.Int32, objMANAGE_JOB.JOB_CATEGORY);
            dbCommandWrapper.AddInParameter("p_JOB_STATUS", DbType.Int32, objMANAGE_JOB.JOB_STATUS);
            dbCommandWrapper.AddInParameter("p_ON_HOLD_REASON", DbType.String, objMANAGE_JOB.ON_HOLD_REASON);
            dbCommandWrapper.AddInParameter("p_CLIENT_PM", DbType.String, objMANAGE_JOB.CLIENT_PM);
            dbCommandWrapper.AddInParameter("p_JOB_NOTES", DbType.String, objMANAGE_JOB.JOB_NOTES);
            dbCommandWrapper.AddInParameter("p_NUMBER_OF_SUBMITTED_PERMITS", DbType.Int32, objMANAGE_JOB.NUMBER_OF_SUBMITTED_PERMITS);
            dbCommandWrapper.AddInParameter("p_PERMIT_NOTES", DbType.String, objMANAGE_JOB.PERMIT_NOTES);
            dbCommandWrapper.AddInParameter("p_PUNCHLIST_COMPLETE", DbType.String, objMANAGE_JOB.PUNCHLIST_COMPLETE);
            dbCommandWrapper.AddInParameter("p_PUNCHLIST_SUBMITTED_DATE", DbType.DateTime, objMANAGE_JOB.PUNCHLIST_SUBMITTED_DATE);
            dbCommandWrapper.AddInParameter("p_CLIENT_APPROVAL_DATE", DbType.DateTime, objMANAGE_JOB.CLIENT_APPROVAL_DATE);
            dbCommandWrapper.AddInParameter("p_PRIORITY", DbType.String, objMANAGE_JOB.PRIORITY);
            dbCommandWrapper.AddInParameter("p_CJ_NUMBER", DbType.String, objMANAGE_JOB.CJ_NUMBER);
            dbCommandWrapper.AddInParameter("p_DID_NUMBER", DbType.String, objMANAGE_JOB.DID_NUMBER);
            dbCommandWrapper.AddInParameter("p_CREATED_BY", DbType.Int32, objMANAGE_JOB.CREATED_BY);
            dbCommandWrapper.AddInParameter("p_CREATED_ON", DbType.DateTime, objMANAGE_JOB.CREATED_ON);
            dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.String, objMANAGE_JOB.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objMANAGE_JOB.MODIFIED_ON);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objMANAGE_JOB.LOCK_COUNTER);
            dbCommandWrapper.AddInParameter("p_PO_NUMBER", DbType.String, objMANAGE_JOB.PO_NUMBER);
            dbCommandWrapper.AddInParameter("p_PO_AMOUNT", DbType.Decimal, objMANAGE_JOB.PO_AMOUNT);
            dbCommandWrapper.AddInParameter("p_INVOICE_DATE", DbType.DateTime, objMANAGE_JOB.INVOICE_DATE);
            dbCommandWrapper.AddInParameter("p_INVOICE_AMOUNT", DbType.Decimal, objMANAGE_JOB.INVOICE_AMOUNT);


            if (Connection.Transaction != null)
                p_JOB_ID = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                p_JOB_ID = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            p_JOB_ID = Convert.ToInt32(dbCommandWrapper.DBCommand.Parameters["@p_JOB_ID"].Value);
            return p_JOB_ID;
        }
        public int Delete(DBConnection Connection, List<JOBDC> objMANAGE_JOBs, ref List<EXCEPTIONDC> lstExceptions)
        {
            int deleteCount = 0;
            try
            {
                foreach (JOBDC objMANAGE_JOB in objMANAGE_JOBs)
                {
                    try
                    {
                        Connection.Open(true);
                        deleteCount = Delete(Connection, objMANAGE_JOB);
                        Connection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = objMANAGE_JOB.JOB_ID;
                        objExcption.EXCEPTION_MESSAGE = exp.Message;
                        objExcption.STACK_TRACK = exp.StackTrace;
                        lstExceptions.Add(objExcption);
                        Connection.Rollback();
                    }
                }
                if (lstExceptions.Count > 0)
                    throw new Exception("Excption Occure");

            }
            catch (Exception exp)
            {
                throw exp;
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, JOBDC objMANAGE_JOB)
        {
            int deleteCount = 0;

            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("proc_MANAGE_JOBSDelete");

                DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

                dbCommandWrapper.AddInParameter("p_JOB_ID", DbType.Int32, objMANAGE_JOB.JOB_ID);

                if (Connection.Transaction != null)
                    deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
                else
                    deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            }
            catch (Exception exp)
            {
                //Utilities.InsertIntoErrorLog("Error: JOB DELETE ", exp.Message + "\r\n" + exp.StackTrace, Convert.ToInt32(objMANAGE_JOB.MODIFIED_BY));
                objMANAGE_JOB.SetError(exp);
                throw exp;
            }
            return deleteCount;
        }

        public List<DD_DTO> GetJobFileNumbers(DBConnection Connection, string projectIDs)
        {
            List<DD_DTO> objDD_DTO = new List<DD_DTO>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_MANAGE_JOBSGetJobNumbers");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_PROJECT_IDs", DbType.String, projectIDs);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                DD_DTO DD_DTO = new DD_DTO();
                if (drRow.Table.Columns.Contains("JOB_ID"))
                {
                    DD_DTO.VALUE = Convert.ToInt32(drRow["JOB_ID"]);
                }
                if (drRow.Table.Columns.Contains("JOB_FILE_NUMBER"))
                {
                    DD_DTO.TEXT = Convert.ToString(drRow["JOB_FILE_NUMBER"]);
                }
                if (drRow.Table.Columns.Contains("JOB_STATUS_NAME"))
                {
                    DD_DTO.TEXT2 = Convert.ToString(drRow["JOB_STATUS_NAME"]);
                }
                objDD_DTO.Add(DD_DTO);
            }
            return objDD_DTO;
        }

    }
}
