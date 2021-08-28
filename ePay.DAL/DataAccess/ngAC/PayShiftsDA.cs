using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
    public class PayShiftsDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<PayShiftsDC> LoadAll(DBConnection Connection)
        {
            List<PayShiftsDC> objPayDesignation = new List<PayShiftsDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayShiftsLoad");

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

        public PayShiftsDC LoadByPrimaryKey(DBConnection Connection, string Code)
        {
            PayShiftsDC objPayDesignation = new PayShiftsDC();
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
        public int Update(DBConnection Connection, List<PayShiftsDC> objPayDesignations)
        {
            int updatedCount = 0;
            foreach (PayShiftsDC objPayDesignation in objPayDesignations)
            {
                updatedCount = Update(Connection, objPayDesignation);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, PayShiftsDC objPayDesignation)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayShiftsUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("p_Code", DbType.String, objPayDesignation.Code);
            dbCommandWrapper.AddInParameter("p_Name", DbType.String, objPayDesignation.Name);
            dbCommandWrapper.AddInParameter("p_Start1", DbType.Time, objPayDesignation.Start1);
            dbCommandWrapper.AddInParameter("p_End1", DbType.Time, objPayDesignation.End1);
            dbCommandWrapper.AddInParameter("p_Split", DbType.String, objPayDesignation.Split);
            dbCommandWrapper.AddInParameter("p_Start2", DbType.Time, objPayDesignation.Start2);
            dbCommandWrapper.AddInParameter("p_End2", DbType.Time, objPayDesignation.End2);
            dbCommandWrapper.AddInParameter("p_Relaxation", DbType.Int32, objPayDesignation.Relaxation);
            dbCommandWrapper.AddInParameter("p_Duration", DbType.Int32, objPayDesignation.Duration);
            dbCommandWrapper.AddInParameter("p_NextDay", DbType.Boolean, objPayDesignation.NextDay);
            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync);

            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("p_ShiftEndingAdjustmentHours", DbType.Int32, objPayDesignation.ShiftEndingAdjustmentHours);


            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objPayDesignation.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<PayShiftsDC> objPayDesignations)
        {
            int insertCount = 0;
            foreach (PayShiftsDC objPayDesignation in objPayDesignations)
            {
                insertCount = Insert(Connection, objPayDesignation);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, PayShiftsDC objPayDesignation)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayShiftsInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("p_Code", DbType.String, objPayDesignation.Code);
            dbCommandWrapper.AddInParameter("p_Name", DbType.String, objPayDesignation.Name);
            dbCommandWrapper.AddInParameter("p_Start1", DbType.Time, objPayDesignation.Start1);
            dbCommandWrapper.AddInParameter("p_End1", DbType.Time, objPayDesignation.End1);
            dbCommandWrapper.AddInParameter("p_Split", DbType.String, objPayDesignation.Split);
            dbCommandWrapper.AddInParameter("p_Start2", DbType.Time, objPayDesignation.Start2);
            dbCommandWrapper.AddInParameter("p_End2", DbType.Time, objPayDesignation.End2);
            dbCommandWrapper.AddInParameter("p_Relaxation", DbType.Int32, objPayDesignation.Relaxation);
            dbCommandWrapper.AddInParameter("p_Duration", DbType.Int32, objPayDesignation.Duration);
            dbCommandWrapper.AddInParameter("p_NextDay", DbType.Boolean, objPayDesignation.NextDay);
            dbCommandWrapper.AddInParameter("p_IsSync", DbType.Boolean, objPayDesignation.IsSync);
            
            dbCommandWrapper.AddInParameter("p_RowState", DbType.String, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("p_AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("p_AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("p_EditOn", DbType.DateTime, objPayDesignation.EditOn);
            dbCommandWrapper.AddInParameter("p_EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("p_SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("p_CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("p_ShiftEndingAdjustmentHours", DbType.Int32, objPayDesignation.ShiftEndingAdjustmentHours);

            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }
        public int Delete(DBConnection Connection, List<PayShiftsDC> objPayDesignations)
        {
            int deleteCount = 0;
            foreach (PayShiftsDC objPayDesignation in objPayDesignations)
            {
                deleteCount = Delete(Connection, objPayDesignation);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, PayShiftsDC objPayDesignation)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayShiftsDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_Code", DbType.String, objPayDesignation.Code);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private PayShiftsDC FillObject(IDataReader reader)
        {
            PayShiftsDC objPayDesignation = null;
            if (reader != null && reader.Read())
            {
                objPayDesignation = new PayShiftsDC();
                objPayDesignation.Code = reader["Code"].ToString();
                objPayDesignation.Name = reader["Name"].ToString();
               // objPayDesignation.Description = reader["Description"].ToString();
                //objPayDesignation.SortOrder = reader["SortOrder"] == DBNull.Value ? null : (int?)reader["SortOrder"];
                objPayDesignation.IsSync = Convert.ToBoolean( reader["IsSync"]);
                objPayDesignation.RowState = Convert.ToString( reader["RowState"]);
                objPayDesignation.AddOn = reader["AddOn"] == DBNull.Value ? null : (DateTime?)reader["AddOn"];
                objPayDesignation.AddBy = Convert.ToString(reader["AddBy"]);
                objPayDesignation.EditOn = reader["EditOn"] == DBNull.Value ? null : (DateTime?)reader["EditOn"];
                objPayDesignation.EditBy = Convert.ToString(reader["EditBy"]);
                objPayDesignation.SyncDate = reader["SyncDate"] == DBNull.Value ? null : (DateTime?)reader["SyncDate"];
                objPayDesignation.CompanyID = reader["CompanyID"] == DBNull.Value ? null : (int?)reader["CompanyID"];

                reader.Close();
                reader.Dispose();
            }
            return objPayDesignation;
        }
        private PayShiftsDC FillObject(DataRow row)
        {
            PayShiftsDC objPayDesignation = null;
            objPayDesignation = new PayShiftsDC();
            objPayDesignation.Code = row["Code"].ToString();
            objPayDesignation.Name = row["Name"].ToString();
            objPayDesignation.Start1 = row["Start1"] == DBNull.Value ? null : row["Start1"].ToString();
            objPayDesignation.End1 = row["End1"] == DBNull.Value ? null : row["End1"].ToString();
            if (row["Split"] != DBNull.Value)
            {

               objPayDesignation.Split = Convert.ToBoolean(row["Split"]);
             }
            
          //  objPayDesignation.Start2 = row["Start2"] == DBNull.Value ? null : (DateTime?)row["Start2"];
           // objPayDesignation.End2 = row["End2"] == DBNull.Value ? null : (DateTime?)row["End2"];
            objPayDesignation.Relaxation = row["Relaxation"] == DBNull.Value ? null : (int?)(row["Relaxation"]);
            objPayDesignation.Duration = row["Duration"] == DBNull.Value ? null : (int?)(row["Duration"]);
            if (row["NextDay"] != DBNull.Value)
            {

                objPayDesignation.NextDay = Convert.ToBoolean(row["NextDay"]);
            }
            if (row["IsSync"] != DBNull.Value)
            {

               objPayDesignation.IsSync = Convert.ToBoolean(row["IsSync"]);
            }
            objPayDesignation.RowState = row["RowState"] == DBNull.Value ? null : Convert.ToString(row["RowState"]);
            objPayDesignation.AddOn = row["AddOn"] == DBNull.Value ? null : (DateTime?)row["AddOn"];
            
            objPayDesignation.AddBy = Convert.ToString(row["AddBy"]);
            //objPayDesignation.EditOn = row["EditOn"] == DBNull.Value ? null : (DateTime?)row["EditOn"];
            //objPayDesignation.EditBy = Convert.ToString(row["EditBy"]);
            //objPayDesignation.SyncDate = row["SyncDate"] == DBNull.Value ? null : (DateTime?)row["SyncDate"];
            //objPayDesignation.CompanyID = row["CompanyID"] == DBNull.Value ? null : (int?)row["CompanyID"];
            //objPayDesignation.ShiftEndingAdjustmentHours = row["ShiftEndingAdjustmentHours"] == DBNull.Value ? null : (int?)(row["ShiftEndingAdjustmentHours"]);
            return objPayDesignation;
        }
    }
}
