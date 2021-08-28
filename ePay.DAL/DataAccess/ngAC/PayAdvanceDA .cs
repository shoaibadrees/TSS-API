using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
    public class PayAdvanceDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<PayAdvanceDC> LoadAllEmployee(DBConnection Connection)
        {
            List<PayAdvanceDC> objPayDesignation = new List<PayAdvanceDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayLoadEmployees");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objPayDesignation.Add(FillObjectEmployee(drRow));
            }

            return objPayDesignation;
        }
        public List<PayAdvanceDC> LoadAll(DBConnection Connection)
        {
            List<PayAdvanceDC> objPayDesignation = new List<PayAdvanceDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayAdvanceLoadAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objPayDesignation.Add(FillObject(drRow));
            }

            return objPayDesignation;
        }

        public PayAdvanceDC LoadByPrimaryKey(DBConnection Connection, string ID)
        {
            PayAdvanceDC objPayDesignation = new PayAdvanceDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayDesignationsLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_ID", DbType.String, ID);


            IDataReader reader = null;

            if (Connection.Transaction != null)
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

            objPayDesignation = FillObject(reader);
            return objPayDesignation;
        }
        public int Update(DBConnection Connection, List<PayAdvanceDC> objPayDesignations)
        {
            int updatedCount = 0;
            foreach (PayAdvanceDC objPayDesignation in objPayDesignations)
            {
                updatedCount = Update(Connection, objPayDesignation);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, PayAdvanceDC objPayDesignation)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayAdvanceUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_ID", DbType.String, objPayDesignation.ID);
            dbCommandWrapper.AddInParameter("p_EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("p_Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("p_Advance", DbType.DateTime, objPayDesignation.Advance);
            dbCommandWrapper.AddInParameter("p_Description", DbType.String, objPayDesignation.Description);
            dbCommandWrapper.AddInParameter("p_Month", DbType.DateTime, objPayDesignation.Month);
            dbCommandWrapper.AddInParameter("p_Year", DbType.DateTime, objPayDesignation.Year);
            dbCommandWrapper.AddInParameter("p_NoOfInst", DbType.Int16, objPayDesignation.NoOfInst);
            dbCommandWrapper.AddInParameter("p_EffDate", DbType.String, objPayDesignation.EffDate);
            dbCommandWrapper.AddInParameter("p_PaidAmount", DbType.DateTime, objPayDesignation.PaidAmount);
            dbCommandWrapper.AddInParameter("p_InsAmount", DbType.DateTime, objPayDesignation.InsAmount);
          
            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync);

            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("p_isLoan", DbType.Int32, objPayDesignation.isLoan);



            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objPayDesignation.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<PayAdvanceDC> objPayDesignations)
        {
            int insertCount = 0;
            foreach (PayAdvanceDC objPayDesignation in objPayDesignations)
            {
                insertCount = Insert(Connection, objPayDesignation);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, PayAdvanceDC objPayDesignation)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_payAdvanceInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_ID", DbType.String, objPayDesignation.ID);
            dbCommandWrapper.AddInParameter("p_EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("p_Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("p_Advance", DbType.DateTime, objPayDesignation.Advance);
            dbCommandWrapper.AddInParameter("p_Description", DbType.String, objPayDesignation.Description);
            dbCommandWrapper.AddInParameter("p_Month", DbType.DateTime, objPayDesignation.Month);
            dbCommandWrapper.AddInParameter("p_Year", DbType.DateTime, objPayDesignation.Year);
            dbCommandWrapper.AddInParameter("p_NoOfInst", DbType.Int16, objPayDesignation.NoOfInst);
            dbCommandWrapper.AddInParameter("p_EffDate", DbType.String, objPayDesignation.EffDate);
            dbCommandWrapper.AddInParameter("p_PaidAmount", DbType.DateTime, objPayDesignation.PaidAmount);
            dbCommandWrapper.AddInParameter("p_InsAmount", DbType.DateTime, objPayDesignation.InsAmount);

            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync);

            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("p_isLoan", DbType.Int32, objPayDesignation.isLoan);


            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }
        public int Delete(DBConnection Connection, List<PayAdvanceDC> objPayDesignations)
        {
            int deleteCount = 0;
            foreach (PayAdvanceDC objPayDesignation in objPayDesignations)
            {
                deleteCount = Delete(Connection, objPayDesignation);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, PayAdvanceDC objPayDesignation)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayAdvanceDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_ID", DbType.String, objPayDesignation.ID);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private PayAdvanceDC FillObject(IDataReader reader)
        {
            PayAdvanceDC objPayDesignation = null;
            if (reader != null && reader.Read())
            {
                objPayDesignation = new PayAdvanceDC();
                objPayDesignation.EmpCode = reader["EmpCode"].ToString();
                objPayDesignation.Date = reader["Date"] == DBNull.Value ? null : (DateTime?)reader["Date"];
                objPayDesignation.Advance =Convert.ToInt16( reader["Advance"]);
                objPayDesignation.Description = reader["Remarks"].ToString();
                objPayDesignation.Month = Convert.ToInt16(reader["Month"]);
                objPayDesignation.Year = Convert.ToInt16(reader["Year"]);
                objPayDesignation.NoOfInst = Convert.ToInt16(reader["NoOfInst"]);
                objPayDesignation.EffDate = reader["EffDate"] == DBNull.Value ? null : (DateTime?)reader["EffDate"];
                objPayDesignation.PaidAmount = Convert.ToInt16(reader["PaidAmount"]);
                objPayDesignation.InsAmount = Convert.ToInt16(reader["InsAmount"]);
                objPayDesignation.AddOn = reader["AddOn"] == DBNull.Value ? null : (DateTime?)reader["AddOn"];
                objPayDesignation.AddBy = Convert.ToString(reader["AddBy"]);
                objPayDesignation.EditOn = reader["EditOn"] == DBNull.Value ? null : (DateTime?)reader["EditOn"];
                objPayDesignation.EditBy = Convert.ToString(reader["EditBy"]);
                objPayDesignation.IsSync = Convert.ToBoolean(reader["IsSync"]);
                objPayDesignation.RowState = Convert.ToString(reader["RowState"]);
                objPayDesignation.SyncDate = reader["SyncDate"] == DBNull.Value ? null : (DateTime?)reader["SyncDate"];
                objPayDesignation.CompanyID = Convert.ToInt32(reader["CompanyID"]);
            
                objPayDesignation.isLoan = Convert.ToBoolean(reader["isLoan"]);

                reader.Close();
                reader.Dispose();
            }
            return objPayDesignation;
        }
        private PayAdvanceDC FillObject(DataRow row)
        {
            PayAdvanceDC objPayDesignation = null;
            objPayDesignation = new PayAdvanceDC();
            objPayDesignation.ID = Convert.ToInt32(row["ID"]);
            objPayDesignation.EmpCode = row["EmpCode"].ToString();
            objPayDesignation.Date = row["Date"] == DBNull.Value ? null : (DateTime?)row["Date"];
            objPayDesignation.Advance = Convert.ToInt16(row["Advance"]);
            objPayDesignation.Description = row["Description"].ToString();
            objPayDesignation.Month = Convert.ToInt16(row["Month"]);
            objPayDesignation.Year = Convert.ToInt16(row["Year"]);
            objPayDesignation.NoOfInst = Convert.ToInt16(row["NoOfInst"]);

            objPayDesignation.EffDate = row["EffDate"] == DBNull.Value ? null : (DateTime?)row["EffDate"];
            objPayDesignation.PaidAmount = Convert.ToInt16(row["PaidAmount"]);
            objPayDesignation.InsAmount = Convert.ToInt16(row["InsAmount"]);
             objPayDesignation.AddOn = row["AddOn"] == DBNull.Value ? null : (DateTime?)row["AddOn"];
           objPayDesignation.AddBy = Convert.ToString(row["AddBy"]);
            objPayDesignation.EditOn = row["EditOn"] == DBNull.Value ? null : (DateTime?)row["EditOn"];

            objPayDesignation.EditBy = Convert.ToString(row["EditBy"]);
            if (row["IsSync"] != DBNull.Value)
            {

                objPayDesignation.IsSync = Convert.ToBoolean(row["IsSync"]);
            }
            objPayDesignation.RowState = row["RowState"] == DBNull.Value ? null : Convert.ToString(row["RowState"]);
            objPayDesignation.SyncDate = row["SyncDate"] == DBNull.Value ? null : (DateTime?)row["SyncDate"];
            objPayDesignation.CompanyID = row["CompanyID"] == DBNull.Value ? null : (int?)row["CompanyID"];
            objPayDesignation.isLoan = Convert.ToBoolean(row["isLoan"]); 

            return objPayDesignation;
        }
        private PayAdvanceDC FillObjectEmployee(DataRow row)
            
        {
            PayAdvanceDC objPayDesignation = null;
            objPayDesignation = new PayAdvanceDC();
           
            objPayDesignation.EmpCode = row["EmpCode"].ToString();

            objPayDesignation.Name = row["Name"].ToString();

            return objPayDesignation;
        }
    }
}
