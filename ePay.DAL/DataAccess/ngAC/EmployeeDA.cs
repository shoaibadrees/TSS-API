using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
    public class EmployeeDA
    {
        public bool IsDirty { get; set; }

        //=================================================================
        //  	public Function LoadAll() As Boolean
        //=================================================================
        //  Loads all of the records in the database, and sets the currentRow to the first row
        //=================================================================
        public List<EmployeeDC> LoadAll(DBConnection Connection)
        {
            List<EmployeeDC> objPayDesignation = new List<EmployeeDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EmployeesLoadAll");

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

        public EmployeeDC LoadNew(DBConnection Connection)
        {
           EmployeeDC objPayDesignation = new EmployeeDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EmployeesLoadNew");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objPayDesignation=(FillObject(drRow));
            }

            return objPayDesignation;
        }

        public EmployeeDC LoadByPrimaryKey(DBConnection Connection, string Code)
        {
            EmployeeDC objPayDesignation = new EmployeeDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_PayDesignationsLoadByPrimaryKey");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("Code", DbType.String, Code);


            IDataReader reader = null;

            if (Connection.Transaction != null)
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                reader = Connection.dataBase.ExecuteReader(dbCommandWrapper.DBCommand);

            objPayDesignation = FillObject(reader);
            return objPayDesignation;
        }
        public int Update(DBConnection Connection, List<EmployeeDC> objPayDesignations)
        {
            int updatedCount = 0;
            foreach (EmployeeDC objPayDesignation in objPayDesignations)
            {
                updatedCount = Update(Connection, objPayDesignation);
            }
            return updatedCount;
        }
        private int Update(DBConnection Connection, EmployeeDC objPayDesignation)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EmployeesUpdate");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("Code", DbType.String, objPayDesignation.Code);
            dbCommandWrapper.AddInParameter("Name", DbType.String, objPayDesignation.Name);
            dbCommandWrapper.AddInParameter("FatherName", DbType.String, objPayDesignation.FatherName);
            dbCommandWrapper.AddInParameter("DOB", DbType.DateTime, objPayDesignation.DOB);
            dbCommandWrapper.AddInParameter("NICNo", DbType.Int32, objPayDesignation.NICNo);
            dbCommandWrapper.AddInParameter("Religion", DbType.String, objPayDesignation.Religion);
            dbCommandWrapper.AddInParameter("Qualification", DbType.String, objPayDesignation.Qualification);
            dbCommandWrapper.AddInParameter("Sex", DbType.String, objPayDesignation.Sex);
            dbCommandWrapper.AddInParameter("City", DbType.String, objPayDesignation.City);
            dbCommandWrapper.AddInParameter("Status", DbType.Boolean, objPayDesignation.Status);
            


            if (Connection.Transaction != null)
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                updateCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            if (updateCount == 0)
                objPayDesignation.IsDirty = IsDirty = true;

            return updateCount;
        }
        public int Insert(DBConnection Connection, List<EmployeeDC> objPayDesignations)
        {
            int insertCount = 0;
            foreach (EmployeeDC objPayDesignation in objPayDesignations)
            {
                insertCount = Insert(Connection, objPayDesignation);
            }
            return insertCount;
        }
        private int Insert(DBConnection Connection, EmployeeDC objPayDesignation)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EmployeesInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            

            dbCommandWrapper.AddInParameter("Code", DbType.String, objPayDesignation.Code);
            dbCommandWrapper.AddInParameter("Name", DbType.String, objPayDesignation.Name);
            dbCommandWrapper.AddInParameter("FatherName", DbType.String, objPayDesignation.FatherName);
            dbCommandWrapper.AddInParameter("DOB", DbType.DateTime, objPayDesignation.DOB);
            dbCommandWrapper.AddInParameter("NICNo", DbType.Int32, objPayDesignation.NICNo);
            dbCommandWrapper.AddInParameter("Religion", DbType.String, objPayDesignation.Religion);
            dbCommandWrapper.AddInParameter("Qualification", DbType.String, objPayDesignation.Qualification);
            dbCommandWrapper.AddInParameter("Sex", DbType.String, objPayDesignation.Sex);
            dbCommandWrapper.AddInParameter("City", DbType.String, objPayDesignation.City);
            dbCommandWrapper.AddInParameter("Status", DbType.Boolean, objPayDesignation.Status);


            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }
        public int Delete(DBConnection Connection, List<EmployeeDC> objPayDesignations)
        {
            int deleteCount = 0;
            foreach (EmployeeDC objPayDesignation in objPayDesignations)
            {
                deleteCount = Delete(Connection, objPayDesignation);
            }
            return deleteCount;
        }
        private int Delete(DBConnection Connection, EmployeeDC objPayDesignation)
        {
            int deleteCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EmployeesDelete");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("Code", DbType.String, objPayDesignation.Code);

            if (Connection.Transaction != null)
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                deleteCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return deleteCount;
        }
        private EmployeeDC FillObject(IDataReader reader)
        {
            EmployeeDC objPayDesignation = null;
            if (reader != null && reader.Read())
            {
                objPayDesignation = new EmployeeDC();
                objPayDesignation.Code = reader["Code"].ToString();
                objPayDesignation.Name = reader["Name"].ToString();
                objPayDesignation.FatherName = reader["FatherName"].ToString();
                objPayDesignation.DOB = reader["DOB"] == DBNull.Value ? null : (DateTime?)reader["DOB"];
                objPayDesignation.NICNo = reader["NICNo"] == DBNull.Value ? null : (int?)reader["NICNo"];
                objPayDesignation.Religion = Convert.ToString(reader["Religion"]);
                objPayDesignation.Qualification = Convert.ToString(reader["Qualification"]);
                objPayDesignation.Sex = Convert.ToString(reader["Sex"]);
                objPayDesignation.City = Convert.ToString(reader["City"]);
                objPayDesignation.Status = Convert.ToBoolean(reader["Status"]);



                reader.Close();
                reader.Dispose();
            }
            return objPayDesignation;
        }
        private EmployeeDC FillObject(DataRow row)
        {
            EmployeeDC objPayDesignation = null;
            objPayDesignation = new EmployeeDC();
            objPayDesignation.Code = row["Code"].ToString();
            objPayDesignation.Name = row["Name"].ToString();
            objPayDesignation.FatherName = row["FatherName"].ToString();
            objPayDesignation.NICNo = row["NICNo"] == DBNull.Value ? null : (int?)row["NICNo"];
            objPayDesignation.DOB = row["DOB"] == DBNull.Value ? null : (DateTime?)row["DOB"];
            objPayDesignation.Religion = Convert.ToString(row["Religion"]);
            objPayDesignation.Qualification = Convert.ToString(row["Qualification"]);
            objPayDesignation.Sex = Convert.ToString(row["Sex"]);
            objPayDesignation.City = Convert.ToString(row["City"]);
            if (row["Status"] != DBNull.Value)
            {

                objPayDesignation.Status = Convert.ToBoolean(row["Status"]);
            }
            

            return objPayDesignation;
        }
    }
}


