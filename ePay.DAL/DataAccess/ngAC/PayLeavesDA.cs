using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
    public class PayLeavesDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<PayLeavesDC> LoadAllEmployee(DBConnection Connection)
        {
            List<PayLeavesDC> objPayDesignation = new List<PayLeavesDC>();
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
        public List<PayLeavesDC> LoadAll(DBConnection Connection)
        {
            List<PayLeavesDC> objPayDesignation = new List<PayLeavesDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayLeavesLoadAll");

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

        public PayLeavesDC LoadByPrimaryKey(DBConnection Connection, string Code)
        {
            PayLeavesDC objPayDesignation = new PayLeavesDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayDesignationsLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_Code", DbType.String, Code);


            IDataReader reader = null;

            if (Connection.Transaction != null)
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

            objPayDesignation = FillObject(reader);
            return objPayDesignation;
        }
        public int Update(DBConnection Connection, List<PayLeavesDC> objPayDesignations)
        {
            int updatedCount = 0;
            foreach (PayLeavesDC objPayDesignation in objPayDesignations)
            {
                updatedCount = Update(Connection, objPayDesignation);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, PayLeavesDC objPayDesignation)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayLeavesUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_ID", DbType.String, objPayDesignation.ID);
            dbCommandWrapper.AddInParameter("p_EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("p_Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("p_Remarks", DbType.String, objPayDesignation.Remarks);
            dbCommandWrapper.AddInParameter("p_From", DbType.DateTime, objPayDesignation.From);
            dbCommandWrapper.AddInParameter("p_To", DbType.DateTime, objPayDesignation.To);
            dbCommandWrapper.AddInParameter("p_Days", DbType.Int16, objPayDesignation.Days);
            dbCommandWrapper.AddInParameter("p_Type", DbType.String, objPayDesignation.Type);
  
            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync);

            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);
           


            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objPayDesignation.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<PayLeavesDC> objPayDesignations)
        {
            int insertCount = 0;
            foreach (PayLeavesDC objPayDesignation in objPayDesignations)
            {
                insertCount = Insert(Connection, objPayDesignation);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, PayLeavesDC objPayDesignation)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("payLeavesInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("p_EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("p_Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("p_Remarks", DbType.String, objPayDesignation.Remarks);
            dbCommandWrapper.AddInParameter("p_From", DbType.DateTime, objPayDesignation.From);
            dbCommandWrapper.AddInParameter("p_To", DbType.DateTime, objPayDesignation.To);
            dbCommandWrapper.AddInParameter("p_Days", DbType.Int16, objPayDesignation.Days);
            dbCommandWrapper.AddInParameter("p_Type", DbType.String, objPayDesignation.Type);

            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync=true);

            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState=="1");
            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);


            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }
        public int Delete(DBConnection Connection, List<PayLeavesDC> objPayDesignations)
        {
            int deleteCount = 0;
            foreach (PayLeavesDC objPayDesignation in objPayDesignations)
            {
                deleteCount = Delete(Connection, objPayDesignation);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, PayLeavesDC objPayDesignation)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayLeavesDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_ID", DbType.String, objPayDesignation.ID);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private PayLeavesDC FillObject(IDataReader reader)
        {
            PayLeavesDC objPayDesignation = null;
            if (reader != null && reader.Read())
            {
                objPayDesignation = new PayLeavesDC();
                objPayDesignation.EmpCode = reader["EmpCode"].ToString();
                objPayDesignation.Date = reader["Date"] == DBNull.Value ? null : (DateTime?)reader["Date"];
                objPayDesignation.Remarks = reader["Remarks"].ToString();
                objPayDesignation.From = reader["From"] == DBNull.Value ? null : (DateTime?)reader["From"];
                objPayDesignation.To = reader["To"] == DBNull.Value ? null : (DateTime?)reader["To"];
                objPayDesignation.Days = Convert.ToInt16(reader["Days"]);
                objPayDesignation.Type = reader["Type"].ToString();
                // objPayDesignation.Description = reader["Description"].ToString();
                //objPayDesignation.SortOrder = reader["SortOrder"] == DBNull.Value ? null : (int?)reader["SortOrder"];
                objPayDesignation.IsSync = Convert.ToBoolean( reader["IsSync"]);
                objPayDesignation.RowState = Convert.ToString( reader["RowState"]);
                objPayDesignation.AddOn = reader["AddOn"] == DBNull.Value ? null : (DateTime?)reader["AddOn"];
                objPayDesignation.AddBy = Convert.ToString(reader["AddBy"]);
                objPayDesignation.EditOn = reader["EditOn"] == DBNull.Value ? null : (DateTime?)reader["EditOn"];
                objPayDesignation.EditBy = Convert.ToString(reader["EditBy"]);
                objPayDesignation.SyncDate = reader["SyncDate"] == DBNull.Value ? null : (DateTime?)reader["SyncDate"];
               

                reader.Close();
                reader.Dispose();
            }
            return objPayDesignation;
        }
        private PayLeavesDC FillObject(DataRow row)
        {
            PayLeavesDC objPayDesignation = null;
            objPayDesignation = new PayLeavesDC();
            objPayDesignation.ID = Convert.ToInt32(row["ID"]);
            objPayDesignation.EmpCode = row["EmpCode"].ToString();
            objPayDesignation.Date = row["Date"] == DBNull.Value ? null : (DateTime?)row["Date"];
            objPayDesignation.Remarks = row["Remarks"].ToString();
            objPayDesignation.From = row["From"] == DBNull.Value ? null : (DateTime?)row["From"];
            objPayDesignation.To = row["To"] == DBNull.Value ? null : (DateTime?)row["To"];
            objPayDesignation.Days = Convert.ToInt16(row["Days"]);
            objPayDesignation.Type = row["Type"].ToString();
            // objPayDesignation.Description = reader["Description"].ToString();
            //objPayDesignation.SortOrder = reader["SortOrder"] == DBNull.Value ? null : (int?)reader["SortOrder"];

            if (row["IsSync"] != DBNull.Value)
            {

               objPayDesignation.IsSync = Convert.ToBoolean(row["IsSync"]);
            }
            objPayDesignation.RowState = row["RowState"] == DBNull.Value ? null : Convert.ToString(row["RowState"]);
            objPayDesignation.AddOn = row["AddOn"] == DBNull.Value ? null : (DateTime?)row["AddOn"];
            
            objPayDesignation.AddBy = Convert.ToString(row["AddBy"]);
            objPayDesignation.EditOn = row["EditOn"] == DBNull.Value ? null : (DateTime?)row["EditOn"];
            objPayDesignation.EditBy = Convert.ToString(row["EditBy"]);
            objPayDesignation.SyncDate = row["SyncDate"] == DBNull.Value ? null : (DateTime?)row["SyncDate"];
            objPayDesignation.CompanyID = row["CompanyID"] == DBNull.Value ? null : (int?)row["CompanyID"];
            
            return objPayDesignation;
        }
        private PayLeavesDC FillObjectEmployee(DataRow row)
            
        {
            PayLeavesDC objPayDesignation = null;
            objPayDesignation = new PayLeavesDC();
           
            objPayDesignation.EmpCode = row["EmpCode"].ToString();

            objPayDesignation.Name = row["Name"].ToString();

            return objPayDesignation;
        }
    }
}
