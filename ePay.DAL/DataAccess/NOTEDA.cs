﻿
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/19/2017 4:34:16 PM
// Last Updated on: 


using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;


namespace EPay.DataAccess
{
    public partial class NOTEDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<NOTEDC> LoadAll(DBConnection Connection)
        {
            List<NOTEDC> objNOTE = new List<NOTEDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_NOTESLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objNOTE.Add(FillObject(drRow));
            }

            return objNOTE;
        }

       
        public int Update(DBConnection Connection, List<NOTEDC> objNOTEs)
        {
            int updatedCount = 0;
            foreach (NOTEDC objNOTE in objNOTEs)
            {
                updatedCount = Update(Connection, objNOTE);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, NOTEDC objNOTE)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_NOTESUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("p_NOTE_ID", DbType.Int32, objNOTE.NOTE_ID);
            dbCommandWrapper.AddInParameter("p_NOTES", DbType.String, objNOTE.NOTES);
            dbCommandWrapper.AddInParameter("p_NOTES_TYPE", DbType.String, objNOTE.NOTES_TYPE);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objNOTE.LOCK_COUNTER);
            dbCommandWrapper.AddInParameter("p_SCREEN_ID", DbType.Int32, objNOTE.SCREEN_ID);
            dbCommandWrapper.AddInParameter("p_CREATED_BY", DbType.Int32, objNOTE.CREATED_BY);
            dbCommandWrapper.AddInParameter("p_CREATED_ON", DbType.DateTime, objNOTE.CREATED_ON);
            dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.Int32, objNOTE.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objNOTE.MODIFIED_ON);


            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objNOTE.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<NOTEDC> objNOTEs)
        {
            int insertCount = 0;
            foreach (NOTEDC objNOTE in objNOTEs)
            {
                objNOTE.CREATED_ON = DateTime.Now;
                objNOTE.MODIFIED_ON = DateTime.Now;
                insertCount = Insert(Connection, objNOTE);
            }
            return insertCount;
        }
       
        public int Delete(DBConnection Connection, List<NOTEDC> objNOTEs)
        {
            int deleteCount = 0;
            foreach (NOTEDC objNOTE in objNOTEs)
            {
                deleteCount = Delete(Connection, objNOTE);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, NOTEDC objNOTE)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_NOTESDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_NOTE_ID", DbType.Int32, objNOTE.NOTE_ID);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private NOTEDC FillObject(IDataReader reader)
        {
            NOTEDC objNOTE = null;
            if (reader != null && reader.Read())
            {
                objNOTE = new NOTEDC();
                objNOTE.NOTE_ID = (int)reader["NOTE_ID"];
                objNOTE.NOTES = Convert.ToString (reader["NOTES"]);
                objNOTE.NOTES_TYPE = reader["NOTES_TYPE"] == DBNull.Value ? null : (String)reader["NOTES_TYPE"];
                objNOTE.LOCK_COUNTER = reader["LOCK_COUNTER"] == DBNull.Value ? null : (int?)reader["LOCK_COUNTER"];
                objNOTE.SCREEN_ID = reader["SCREEN_ID"] == DBNull.Value ? null : (int?)reader["SCREEN_ID"];
                objNOTE.CREATED_BY = reader["CREATED_BY"] == DBNull.Value ? null : (int?)reader["CREATED_BY"];
                objNOTE.CREATED_ON = reader["CREATED_ON"] == DBNull.Value ? null : (DateTime?)reader["CREATED_ON"];
                objNOTE.MODIFIED_BY = reader["MODIFIED_BY"] == DBNull.Value ? null : (int?)reader["MODIFIED_BY"];
                objNOTE.MODIFIED_ON = reader["MODIFIED_ON"] == DBNull.Value ? null : (DateTime?)reader["MODIFIED_ON"];

                reader.Close();
                reader.Dispose();
            }
            return objNOTE;
        }
        private NOTEDC FillObject(DataRow row)
        {
            NOTEDC objNOTE = null;
            objNOTE = new NOTEDC();
            objNOTE.NOTE_ID = (int)row["NOTE_ID"];
            objNOTE.NOTES = Convert.ToString(row["NOTES"]);
            objNOTE.NOTES_TYPE = row["NOTES_TYPE"] == DBNull.Value ? null : (String)row["NOTES_TYPE"];
            objNOTE.LOCK_COUNTER = row["LOCK_COUNTER"] == DBNull.Value ? null : (int?)row["LOCK_COUNTER"];
            objNOTE.SCREEN_ID = row["SCREEN_ID"] == DBNull.Value ? null : (int?)row["SCREEN_ID"];
            objNOTE.USER_NAME = row["USER_NAME"] == DBNull.Value ? null : (String)row["USER_NAME"];
            objNOTE.CREATED_ON = row["CREATED_ON"] == DBNull.Value ? null : (DateTime?)row["CREATED_ON"];
            objNOTE.MODIFIED_BY = row["MODIFIED_BY"] == DBNull.Value ? null : (int?)row["MODIFIED_BY"];
            objNOTE.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? null : (DateTime?)row["MODIFIED_ON"];

            return objNOTE;
        }
    }
}