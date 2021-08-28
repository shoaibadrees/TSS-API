using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using EPay.DataClasses;
using EPay.Common;
using System.Data.Common;
using EPay.DataAccess;

namespace EPay.DataAccess
{
    public partial class USERDA
    {
        public List<USERDC> GetUsersForExport(string USER_IDs, DBConnection Connection)
        {
            List<USERDC> objUSER = new List<USERDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ExportUsers");

            SqlDatabase database = (SqlDatabase)Connection.dataBase;

            DbCommand cmd = database.GetStoredProcCommand(sql.ToString());

            database.AddInParameter(cmd, "@p_USERS_IDs", SqlDbType.Structured, Utility.CreateIDsTable(Array.ConvertAll<string, int>(((String)USER_IDs).Split(','), Convert.ToInt32)));

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = database.ExecuteDataSet(cmd, Connection.Transaction);
            else
                ds = database.ExecuteDataSet(cmd);

            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow drRow in ds.Tables[0].Rows)
                {
                    objUSER.Add(FillObject(drRow));
                }
            }

            return objUSER;
        }

        public USERDC AuthenticateUser(DBConnection Connection, string username, string password)
        {
            password = Encryptor.Encrypt(password);
            USERDC objUSER = new USERDC();
            StringBuilder sql = new StringBuilder();
            
            sql.Append("proc_USERSLoadByUserNamePassword");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_USER_NAME", DbType.String, username);
            dbCommandWrapper.AddInParameter("p_PASSWORD", DbType.String, password);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            if (ds.Tables[0].Rows.Count > 0)
            {
               
                    objUSER=(FillObject(ds.Tables[0].Rows[0]));
               
            }
            return objUSER;
        }

        public int UpdateUser(DBConnection Connection, USERDC objUser)
        {
            return Update(Connection, objUser);
        }

        public int UpdateUserCompanies(DBConnection Connection, USERDC objUSER)
        {
            int updateCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_USERSUpdateUSERS_COMPANIES");

            SqlDatabase database = (SqlDatabase)Connection.dataBase;

            DbCommand cmd = database.GetStoredProcCommand(sql.ToString());

            database.AddInParameter(cmd, "p_USER_ID", SqlDbType.Int, objUSER.USER_ID);
            database.AddInParameter(cmd, "@p_USERS_COMPANIES_IDs", SqlDbType.Structured, Utility.CreateIDsTable(objUSER.USER_COMPANIES));
            try
            {
                if (Connection.Transaction != null)
                    updateCount = database.ExecuteNonQuery(cmd, Connection.Transaction);
                else
                    updateCount = database.ExecuteNonQuery(cmd);

                if (updateCount == 0)
                    objUSER.IsDirty = IsDirty = true;
            }
            catch (Exception exp)
            {
                //Utilities.InsertIntoErrorLog("Error: USERS_COMPANIES UPDATE ", exp.Message + "\r\n" + exp.StackTrace, objUSER.MODIFIED_BY);
                objUSER.SetError(exp);
                throw exp;
            }

            return updateCount;
        }

        public List<USERDC> LoggedUsers(DBConnection Connection)
        {
            List<USERDC> objUSER = new List<USERDC>();
            USERDC ObjUserDC;
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_LOGGEDUSERS");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
           

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            if (ds.Tables[0].Rows.Count > 0)
            {


                foreach (DataRow drRow in ds.Tables[0].Rows)
                {
                   
                    ObjUserDC = new USERDC();
                    ObjUserDC.USER_NAME = (String)drRow["USER_NAME"];
                    ObjUserDC.EMAIL_ADDRESS = (String)drRow["EMAIL_ADDRESS"];
                    ObjUserDC.ANSWER = drRow["COMPANIES"] == DBNull.Value ? "" : (String)drRow["COMPANIES"];
                    ObjUserDC.LAST_LOGIN = drRow["LAST_LOGIN"] == DBNull.Value ? DateTime.Now.ToString("dd-MM-yy HH:mm") : ((DateTime)drRow["LAST_LOGIN"]).ToString("dd-MM-yy HH:mm");
                    objUSER.Add(ObjUserDC);
                }
            }

            return objUSER;
        }

        public int UpdateUserLoginStatus(string UserName, string LoginStatus, DBConnection Connection)
        {
            int IsUpdated = 0;
            List<USERDC> objUSER = new List<USERDC>();
            USERDC ObjUserDC;
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_UpdateUSERLOGINSTATUS");
                      
            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_USER_NAME", DbType.String, UserName);
            dbCommandWrapper.AddInParameter("p_STATUS", DbType.String, LoginStatus);

            if (Connection.Transaction != null)
                IsUpdated = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                IsUpdated = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return IsUpdated;
        }

        public int ResetPassword(DBConnection Connection, string selectedUserIds, int currentUserId, string NewPassword)
        {
            int IsUpdated = 0;
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_USERSResetPassword");

            SqlDatabase database = (SqlDatabase)Connection.dataBase;

            DbCommand cmd = database.GetStoredProcCommand(sql.ToString());

            database.AddInParameter(cmd, "@p_USERS_IDs", SqlDbType.Structured, Utility.CreateIDsTable(Array.ConvertAll<string, int>(selectedUserIds.Split(','), Convert.ToInt32)));
            database.AddInParameter(cmd, "p_MODIFIED_BY", SqlDbType.Int, currentUserId);
            database.AddInParameter(cmd, "p_PASSWORD", DbType.String, Encryptor.Encrypt(NewPassword));

            if (Connection.Transaction != null)
                IsUpdated = database.ExecuteNonQuery(cmd, Connection.Transaction);
            else
                IsUpdated = database.ExecuteNonQuery(cmd);

            return IsUpdated;
        }

        public List<string> GetUsersEmailAddressByCompanyId(string companyIds, DBConnection Connection) {
            List<string> emailAddresses = new List<string>();
           
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_USERSGetEmailAddressByCompanyID");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_COMPANY_IDS", DbType.String, companyIds);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow row in ds.Tables[0].Rows) {
                emailAddresses.Add(Convert.ToString(row["EMAIL_ADDRESS"]));
            }
            return emailAddresses;
        }

        public List<string> GetUsersEmailAddressByEventId(int eventid,String eventtype,int notificationtype, DBConnection Connection)
        {
            List<string> emailAddresses = new List<string>();

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_USERSGetEmailAddressByEventID");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_EVENT_OR_USER_ID", DbType.Int32, eventid);
            dbCommandWrapper.AddInParameter("p_EVENT_TYPE", DbType.String, eventtype);
            dbCommandWrapper.AddInParameter("p_NOTIFICATION_TYPE", DbType.Int32, notificationtype);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow row in ds.Tables[0].Rows)
            {
                emailAddresses.Add(Convert.ToString(row["EMAIL_ADDRESS"]));
            }
            return emailAddresses;
        }

        public List<USERDC> GetUsersByUsername(string userName, DBConnection Connection)
        {
            List<USERDC> usersList = new List<USERDC>();

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_USERSGetByUsername");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_USERNAME", DbType.String, userName);

            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow row in ds.Tables[0].Rows)
            {
                USERDC user = new USERDC();
                user.USER_ID = Convert.ToInt32(row["USER_ID"]);
                user.USER_NAME = Convert.ToString(row["USER_NAME"]);
                user.SECURITY_QUESTION = Convert.ToString(row["SECURITY_QUESTION"]);
                user.ANSWER = Convert.ToString(row["ANSWER"]);
                user.EMAIL_ADDRESS = Convert.ToString(row["EMAIL_ADDRESS"]);

                usersList.Add(user);
            }
            return usersList;
        }
    }
}
