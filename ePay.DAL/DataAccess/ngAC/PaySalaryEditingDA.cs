using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
    public class PaySalaryEditingDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<PaySalaryEditingDC> LoadAllEmployee(DBConnection Connection,int Month,int Year)
        {
            List<PaySalaryEditingDC> objPayDesignation = new List<PaySalaryEditingDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PaySalaryEditing_GetEmployee");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("Month", DbType.Int32, Month);
            dbCommandWrapper.AddInParameter("Year", DbType.Int32, Year);


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
        public List<PaySalaryEditingDC> LoadAll(DBConnection Connection)
        {
            List<PaySalaryEditingDC> objPayDesignation = new List<PaySalaryEditingDC>();
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

        public PaySalaryEditingDC LoadByPrimaryKey(DBConnection Connection, string ID)
        {
            PaySalaryEditingDC objPayDesignation = new PaySalaryEditingDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayDesignationsLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("ID", DbType.String, ID);


            IDataReader reader = null;

            if (Connection.Transaction != null)
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

            objPayDesignation = FillObject(reader);
            return objPayDesignation;
        }
        public int Update(DBConnection Connection, List<PaySalaryEditingDC> objPayDesignations)
        {
            int updatedCount = 0;
            foreach (PaySalaryEditingDC objPayDesignation in objPayDesignations)
            {
                updatedCount = Update(Connection, objPayDesignation);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, PaySalaryEditingDC objPayDesignation)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PaySalaryEditingUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("ID", DbType.String, objPayDesignation.ID);
          
            dbCommandWrapper.AddInParameter("Month", DbType.Int32,objPayDesignation.Month);
            dbCommandWrapper.AddInParameter("Year", DbType.Int32, objPayDesignation.Year);
            dbCommandWrapper.AddInParameter("EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("EmpName", DbType.String, objPayDesignation.EmpName);
            dbCommandWrapper.AddInParameter("DesigCode", DbType.String, objPayDesignation.DesigCode);
            dbCommandWrapper.AddInParameter("DesigName", DbType.String, objPayDesignation.DesigName);
            dbCommandWrapper.AddInParameter("DepCode", DbType.String, objPayDesignation.DepCode);
            dbCommandWrapper.AddInParameter("DepName", DbType.String, objPayDesignation.DepName);
            dbCommandWrapper.AddInParameter("ShiftCode", DbType.String, objPayDesignation.ShiftCode);
            dbCommandWrapper.AddInParameter("ShiftName", DbType.DateTime, objPayDesignation.ShiftName);
            dbCommandWrapper.AddInParameter("BasicPay", DbType.Int16, objPayDesignation.BasicPay);
            dbCommandWrapper.AddInParameter("HouseAllow", DbType.Int16, objPayDesignation.HouseAllow);
            dbCommandWrapper.AddInParameter("ConAllow", DbType.Int16, objPayDesignation.ConAllow);
            dbCommandWrapper.AddInParameter("UtilityAllow", DbType.Int16, objPayDesignation.UtilityAllow);
            dbCommandWrapper.AddInParameter("ITax", DbType.Int16, objPayDesignation.ITax);
            dbCommandWrapper.AddInParameter("OtherAllow", DbType.Int16, objPayDesignation.OtherAllow);
            dbCommandWrapper.AddInParameter("OtherDed", DbType.Int16, objPayDesignation.OtherDed);
            dbCommandWrapper.AddInParameter("GrossSalary", DbType.Int16, objPayDesignation.GrossSalary);
            dbCommandWrapper.AddInParameter("Advance", DbType.Int16, objPayDesignation.Advance);
            dbCommandWrapper.AddInParameter("NetSalary", DbType.Int16, objPayDesignation.NetSalary);
            dbCommandWrapper.AddInParameter("Post", DbType.Boolean, objPayDesignation.Post);
            dbCommandWrapper.AddInParameter("NoOfDay", DbType.Int16, objPayDesignation.NoOfDay);
            dbCommandWrapper.AddInParameter("TotalDays", DbType.Int16, objPayDesignation.TotalDays);
            dbCommandWrapper.AddInParameter("Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("Edit", DbType.Boolean, objPayDesignation.Edit);
            dbCommandWrapper.AddInParameter("TotalWorkHour", DbType.Int16, objPayDesignation.TotalWorkHour);
            dbCommandWrapper.AddInParameter("ChequeNo", DbType.String, objPayDesignation.ChequeNo);
            dbCommandWrapper.AddInParameter("Post", DbType.Boolean, objPayDesignation.Post);
            dbCommandWrapper.AddInParameter("OverTime", DbType.Int16, objPayDesignation.OverTime);
            dbCommandWrapper.AddInParameter("OverTimeAmount", DbType.Int16, objPayDesignation.OverTimeAmount);
            dbCommandWrapper.AddInParameter("EOBIEmp", DbType.Int16, objPayDesignation.EOBIEmp);
            dbCommandWrapper.AddInParameter("SS", DbType.Int16, objPayDesignation.SS);
            dbCommandWrapper.AddInParameter("EOBIEmployer", DbType.Int16, objPayDesignation.EOBIEmployer);
         
            dbCommandWrapper.AddInParameter("AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("IsSync", DbType.Boolean, objPayDesignation.IsSync);
            dbCommandWrapper.AddInParameter("EditOn", DbType.Boolean, objPayDesignation.EditOn);

            dbCommandWrapper.AddInParameter("RowState", DbType.Int16, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("Loan", DbType.Int32, objPayDesignation.Loan);
            dbCommandWrapper.AddInParameter("PerDaySalary", DbType.DateTime, objPayDesignation.PerDaySalary);



            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objPayDesignation.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<PaySalaryEditingDC> objPayDesignations)
        {
            int insertCount = 0;
            foreach (PaySalaryEditingDC objPayDesignation in objPayDesignations)
            {
                insertCount = Insert(Connection, objPayDesignation);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, PaySalaryEditingDC objPayDesignation)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PaySalaryEditingInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("ID", DbType.String, objPayDesignation.ID);

            dbCommandWrapper.AddInParameter("Month", DbType.Int32, objPayDesignation.Month);
            dbCommandWrapper.AddInParameter("Year", DbType.Int32, objPayDesignation.Year);
            dbCommandWrapper.AddInParameter("EmpCode", DbType.String, objPayDesignation.EmpCode);
            dbCommandWrapper.AddInParameter("EmpName", DbType.String, objPayDesignation.EmpName);
            dbCommandWrapper.AddInParameter("DesigCode", DbType.String, objPayDesignation.DesigCode);
            dbCommandWrapper.AddInParameter("DesigName", DbType.String, objPayDesignation.DesigName);
            dbCommandWrapper.AddInParameter("DepCode", DbType.String, objPayDesignation.DepCode);
            dbCommandWrapper.AddInParameter("DepName", DbType.String, objPayDesignation.DepName);
            dbCommandWrapper.AddInParameter("ShiftCode", DbType.String, objPayDesignation.ShiftCode);
            dbCommandWrapper.AddInParameter("ShiftName", DbType.DateTime, objPayDesignation.ShiftName);
            dbCommandWrapper.AddInParameter("BasicPay", DbType.Int16, objPayDesignation.BasicPay);
            dbCommandWrapper.AddInParameter("HouseAllow", DbType.Int16, objPayDesignation.HouseAllow);
            dbCommandWrapper.AddInParameter("ConAllow", DbType.Int16, objPayDesignation.ConAllow);
            dbCommandWrapper.AddInParameter("UtilityAllow", DbType.Int16, objPayDesignation.UtilityAllow);
            dbCommandWrapper.AddInParameter("ITax", DbType.Int16, objPayDesignation.ITax);
            dbCommandWrapper.AddInParameter("OtherAllow", DbType.Int16, objPayDesignation.OtherAllow);
            dbCommandWrapper.AddInParameter("OtherDed", DbType.Int16, objPayDesignation.OtherDed);
            dbCommandWrapper.AddInParameter("GrossSalary", DbType.Int16, objPayDesignation.GrossSalary);
            dbCommandWrapper.AddInParameter("Advance", DbType.Int16, objPayDesignation.Advance);
            dbCommandWrapper.AddInParameter("NetSalary", DbType.Int16, objPayDesignation.NetSalary);
            dbCommandWrapper.AddInParameter("Post", DbType.Boolean, objPayDesignation.Post);
            dbCommandWrapper.AddInParameter("NoOfDay", DbType.Int16, objPayDesignation.NoOfDay);
            dbCommandWrapper.AddInParameter("TotalDays", DbType.Int16, objPayDesignation.TotalDays);
            dbCommandWrapper.AddInParameter("Date", DbType.DateTime, objPayDesignation.Date);
            dbCommandWrapper.AddInParameter("Edit", DbType.Boolean, objPayDesignation.Edit);
            dbCommandWrapper.AddInParameter("TotalWorkHour", DbType.Int16, objPayDesignation.TotalWorkHour);
            dbCommandWrapper.AddInParameter("ChequeNo", DbType.String, objPayDesignation.ChequeNo);
            dbCommandWrapper.AddInParameter("Post", DbType.Boolean, objPayDesignation.Post);
            dbCommandWrapper.AddInParameter("OverTime", DbType.Int16, objPayDesignation.OverTime);
            dbCommandWrapper.AddInParameter("OverTimeAmount", DbType.Int16, objPayDesignation.OverTimeAmount);
            dbCommandWrapper.AddInParameter("EOBIEmp", DbType.Int16, objPayDesignation.EOBIEmp);
            dbCommandWrapper.AddInParameter("SS", DbType.Int16, objPayDesignation.SS);
            dbCommandWrapper.AddInParameter("EOBIEmployer", DbType.Int16, objPayDesignation.EOBIEmployer);

            dbCommandWrapper.AddInParameter("AddBy", DbType.String, objPayDesignation.AddBy);
            dbCommandWrapper.AddInParameter("AddOn", DbType.DateTime, objPayDesignation.AddOn);
            dbCommandWrapper.AddInParameter("EditBy", DbType.String, objPayDesignation.EditBy);
            dbCommandWrapper.AddInParameter("IsSync", DbType.Boolean, objPayDesignation.IsSync);
            dbCommandWrapper.AddInParameter("EditOn", DbType.Boolean, objPayDesignation.EditOn);

            dbCommandWrapper.AddInParameter("RowState", DbType.Int16, objPayDesignation.RowState);
            dbCommandWrapper.AddInParameter("SyncDate", DbType.DateTime, objPayDesignation.SyncDate);
            dbCommandWrapper.AddInParameter("CompanyID", DbType.Int32, objPayDesignation.CompanyID);
            dbCommandWrapper.AddInParameter("Loan", DbType.Int32, objPayDesignation.Loan);
            dbCommandWrapper.AddInParameter("PerDaySalary", DbType.DateTime, objPayDesignation.PerDaySalary);



            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }
        public int Delete(DBConnection Connection, List<PaySalaryEditingDC> objPayDesignations)
        {
            int deleteCount = 0;
            foreach (PaySalaryEditingDC objPayDesignation in objPayDesignations)
            {
                deleteCount = Delete(Connection, objPayDesignation);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, PaySalaryEditingDC objPayDesignation)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayAdvanceDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("ID", DbType.String, objPayDesignation.ID);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private PaySalaryEditingDC FillObject(IDataReader reader)
        {
            PaySalaryEditingDC objPayDesignation = null;
            if (reader != null && reader.Read())
            {
                objPayDesignation = new PaySalaryEditingDC();
                objPayDesignation.ID = Convert.ToInt32(reader["ID"]);
                objPayDesignation.Month= Convert.ToInt32(reader["Month"]);
                objPayDesignation.Year = Convert.ToInt32(reader["Year"]);
                objPayDesignation.EmpCode= reader["EmpCode"].ToString();
                objPayDesignation.EmpName= reader["EmpName"].ToString();
                objPayDesignation.DesigCode = reader["DesigCode"].ToString();
                objPayDesignation.DesigName = reader["DesigName"].ToString();
                objPayDesignation.DepCode = reader["DepCode"].ToString();
                objPayDesignation.DepName = reader["DepName"].ToString();
                objPayDesignation.ShiftCode = reader["ShiftCode"].ToString();
                objPayDesignation.ShiftName = reader["ShiftName"].ToString();
                objPayDesignation.BasicPay= Convert.ToInt32(reader["BasicPay"]);
                objPayDesignation.HouseAllow = Convert.ToInt32(reader["HouseAllow"]);
                objPayDesignation.ConAllow = Convert.ToInt32(reader["ConAllow"]);
                objPayDesignation.UtilityAllow = Convert.ToInt32(reader["UtilityAllow"]);
                objPayDesignation.ITax = Convert.ToInt32(reader["ITax"]);
                objPayDesignation.OtherAllow = Convert.ToInt32(reader["OtherAllow"]);
                objPayDesignation.OtherDed = Convert.ToInt32(reader["OtherDed"]);
                objPayDesignation.GrossSalary = Convert.ToInt32(reader["GrossSalary"]);
                objPayDesignation.Advance = Convert.ToInt32(reader["Advance"]);
                objPayDesignation.NetSalary = Convert.ToInt32(reader["NetSalary"]);
                objPayDesignation.Post = Convert.ToBoolean(reader["Post"]);
                objPayDesignation.NoOfDay = Convert.ToInt32(reader["NoOfDay"]);
                objPayDesignation.TotalDays =Convert.ToInt32(reader["TotalDays"]);
                objPayDesignation.Date = reader["Date"] == DBNull.Value ? null : (DateTime?)reader["Date"];
                objPayDesignation.Edit = Convert.ToBoolean(reader["Edit"]);
                objPayDesignation.TotalWorkHour = Convert.ToInt32(reader["TotalWorkHour"]);
                objPayDesignation.ChequeNo= reader["ChequeNo"].ToString();
              
                objPayDesignation.OverTime = Convert.ToInt32(reader["OverTime"]);
                objPayDesignation.OverTimeAmount = Convert.ToInt32(reader["OverTimeAmount"]);
                objPayDesignation.EOBIEmp = Convert.ToInt32(reader["EOBIEmp"]);
                objPayDesignation.SS = Convert.ToInt32(reader["SS"]);
                objPayDesignation.EOBIEmployer = Convert.ToInt32(reader["EOBIEmployer"]);
                objPayDesignation.AddOn = reader["AddOn"] == DBNull.Value ? null : (DateTime?)reader["AddOn"];
                objPayDesignation.AddBy = Convert.ToString(reader["AddBy"]);
                objPayDesignation.EditOn = reader["EditOn"] == DBNull.Value ? null : (DateTime?)reader["EditOn"];
                objPayDesignation.EditBy = Convert.ToString(reader["EditBy"]);
                objPayDesignation.IsSync = Convert.ToBoolean(reader["IsSync"]);
                objPayDesignation.RowState = Convert.ToString(reader["RowState"]);
                objPayDesignation.SyncDate = reader["SyncDate"] == DBNull.Value ? null : (DateTime?)reader["SyncDate"];
                objPayDesignation.CompanyID = Convert.ToInt32(reader["CompanyID"]);
                objPayDesignation.Loan=  Convert.ToInt32(reader["Loan"]);
                objPayDesignation.PerDaySalary = Convert.ToInt32(reader["PerDaySalary"]);



                reader.Close();
                reader.Dispose();
            }
            return objPayDesignation;
        }
        private PaySalaryEditingDC FillObject(DataRow row)
        {
            PaySalaryEditingDC objPayDesignation = null;
            objPayDesignation = new PaySalaryEditingDC();
            objPayDesignation.ID = Convert.ToInt32(row["ID"]);
            objPayDesignation.Month = Convert.ToInt32( row["Month"]);
            objPayDesignation.EmpCode = row["EmpCode"].ToString();
            objPayDesignation.EmpName = row["EmpName"].ToString();
            objPayDesignation.DesigCode = row["DesigCode"].ToString();
            objPayDesignation.DesigName = row["DesigName"].ToString();
            objPayDesignation.DepCode = row["DepCode"].ToString();
            objPayDesignation.DepName = row["DepName"].ToString();
            objPayDesignation.ShiftCode = row["ShiftCode"].ToString();
            objPayDesignation.ShiftName = row["ShiftName"].ToString();
            objPayDesignation.BasicPay =Convert.ToInt32( row["BasicPay"]);
            objPayDesignation.HouseAllow = Convert.ToInt32(row["HouseAllow"]);
            objPayDesignation.ConAllow = Convert.ToInt32(row["ConAllow"]);
            objPayDesignation.UtilityAllow = Convert.ToInt32(row["UtilityAllow"]);
            objPayDesignation.ITax = Convert.ToInt32(row["ITax"]);
            objPayDesignation.OtherAllow = Convert.ToInt32(row["OtherAllow"]);
            objPayDesignation.OtherDed = Convert.ToInt32(row["OtherDed"]);

            objPayDesignation.GrossSalary = Convert.ToInt32(row["GrossSalary"]);
            objPayDesignation.Advance = Convert.ToInt32(row["Advance"]);
            objPayDesignation.NetSalary = Convert.ToInt32(row["NetSalary"]);
            if (row["Post"] != DBNull.Value)
            {

                objPayDesignation.Post = Convert.ToBoolean(row["Post"]);
     }
            objPayDesignation.NoOfDay =Convert.ToInt32(row["NoOfDay"]);
            objPayDesignation.TotalDays = Convert.ToInt32(row["NoOfDay"]);

            objPayDesignation.ChequeNo = (row["ChequeNo"].ToString());
            objPayDesignation.OverTime = Convert.ToInt32(row["OverTime"]);
            objPayDesignation.OverTimeAmount = Convert.ToInt32(row["OverTimeAmount"]);
            objPayDesignation.EOBIEmp = Convert.ToInt32(row["EOBIEmp"]);
            objPayDesignation.SS = Convert.ToInt32(row["SS"]);
            objPayDesignation.EOBIEmployer = Convert.ToInt32(row["EOBIEmployer"]);

            objPayDesignation.Date = row["Date"] == DBNull.Value ? null : (DateTime?)row["Date"];



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
            objPayDesignation.Loan = Convert.ToInt32(row["Loan"]);
            objPayDesignation.PerDaySalary = Convert.ToInt32(row["PerDaySalary"]);

            return objPayDesignation;
        }
        private PaySalaryEditingDC FillObjectEmployee(DataRow row)

        {
            PaySalaryEditingDC objPayDesignation = null;
            objPayDesignation = new PaySalaryEditingDC();


            objPayDesignation.ID = Convert.ToInt32(row["ID"]);

            objPayDesignation.EmpCode = row["EmpCode"].ToString();
            objPayDesignation.EmpName = row["EmpName"].ToString();
            objPayDesignation.DesigCode = row["DesigCode"].ToString();
            objPayDesignation.DesigName = row["DesigName"].ToString();
            objPayDesignation.DepCode = row["DepCode"].ToString();
            objPayDesignation.DepName = row["DepName"].ToString();
            objPayDesignation.ShiftCode = row["ShiftCode"].ToString();
            objPayDesignation.ShiftName = row["ShiftName"].ToString();
            objPayDesignation.BasicPay = Convert.ToInt32(row["BasicPay"]);
            objPayDesignation.HouseAllow = row["HouseAllow"]== DBNull.Value ? 0 : Convert.ToInt16( row["HouseAllow"]);
            objPayDesignation.ConAllow = Convert.ToInt32(row["ConAllow"]);
            objPayDesignation.UtilityAllow = Convert.ToInt32(row["UtilityAllow"]);
            objPayDesignation.ITax = Convert.ToInt32(row["ITax"]);
            objPayDesignation.OtherAllow = Convert.ToInt32(row["OtherAllow"]);
            objPayDesignation.OtherDed = Convert.ToInt32(row["OtherDed"]);
            objPayDesignation.NoOfDay = Convert.ToInt32(row["NoOfDay"]);
            objPayDesignation.GrossSalary = Convert.ToInt32(row["GrossSalary"]);
            objPayDesignation.Advance = Convert.ToInt32(row["Advance"]);
            objPayDesignation.NetSalary = Convert.ToInt32(row["NetSalary"]);
            objPayDesignation.Post = Convert.ToBoolean(row["Post"]);
              if (row["Post"] != DBNull.Value)
            {

               objPayDesignation.Post = Convert.ToBoolean(row["Post"]);
               }

            objPayDesignation.TotalDays = Convert.ToInt32(row["TotalDays"]);

            objPayDesignation.ChequeNo =row["ChequeNo"] ==DBNull.Value ? null : (row["ChequeNo"].ToString());
            objPayDesignation.OverTime = row["OverTime"] == DBNull.Value ? 0 : Convert.ToInt32(row["OverTime"]);
            objPayDesignation.OverTimeAmount = row["OverTimeAmount"] == DBNull.Value ? 0 : Convert.ToInt32(row["OverTimeAmount"]);
            objPayDesignation.EOBIEmp = row["EOBIEmp"] == DBNull.Value ? 0 : Convert.ToInt32(row["EOBIEmp"]);
            
                objPayDesignation.SS = row["SS"] == DBNull.Value ? 0 : Convert.ToInt32(row["SS"]);
                objPayDesignation.EOBIEmployer = row["EOBIEmployer"] == DBNull.Value ? 0 : Convert.ToInt32(row["EOBIEmployer"]);

            objPayDesignation.Date = row["Date"] == DBNull.Value ? null : (DateTime?)row["Date"];
            objPayDesignation.AddOn = row["AddOn"] == DBNull.Value ? null : (DateTime?)row["AddOn"];
            objPayDesignation.AddBy = row["AddBy"]==DBNull.Value ? null :  Convert.ToString(row["AddBy"]);
               objPayDesignation.EditOn = row["EditOn"] == DBNull.Value ? null : (DateTime?)row["EditOn"];

                objPayDesignation.EditBy = row["EditBy"] == DBNull.Value ? null : Convert.ToString(row["EditBy"]);
              
            if (row["IsSync"] != DBNull.Value)
                {

                 objPayDesignation.IsSync = Convert.ToBoolean(row["IsSync"]);
               }
                 objPayDesignation.RowState = row["RowState"] == DBNull.Value ? null : Convert.ToString(row["RowState"]);
                  objPayDesignation.SyncDate = row["SyncDate"] == DBNull.Value ? null : (DateTime?)row["SyncDate"];
                  objPayDesignation.CompanyID = row["CompanyID"] == DBNull.Value ? null : (int?)row["CompanyID"];
                objPayDesignation.Loan = row["Loan"] == DBNull.Value ? 0 : Convert.ToInt32(row["Loan"]);
                objPayDesignation.PerDaySalary = row["PerDaySalary"] == DBNull.Value ? 0 : Convert.ToInt32(row["PerDaySalary"]);






                return objPayDesignation;
        }
    }
}
