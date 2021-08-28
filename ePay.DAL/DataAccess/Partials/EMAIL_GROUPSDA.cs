using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.DataClasses;
using EPay.Common;

namespace EPay.DataAccess
{
    public class EMAIL_GROUPSDA
    {
        public string GetEmailsAgainstClient(DBConnection Connection, string clientName)
        {

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_EMAIL_GROUPS_Select");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("ClientName", DbType.String, clientName);


            var obj = Connection.dataBase.ExecuteScalar(dbCommandWrapper.DBCommand);
            string emails = null;
            if (obj != null)
            {
                emails = Convert.ToString(obj);
            }

            return emails;
        }
    }
}
