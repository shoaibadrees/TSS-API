using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataAccess
{
   public class AdhocReportDA
    {
        public AdhocReportDA()
        {
        }

        public DataTable GetAdhocReportTable(string SqlQuery, EPay.DataAccess.DBConnection connection)
        {

            DataSet ds = new DataSet();
            StringBuilder sqlStatement = new StringBuilder();
            string SQL;
            sqlStatement.Remove(0, sqlStatement.Length);

            SQL = SqlQuery;
            sqlStatement.Append(SQL);
            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(connection.dataBase.GetSqlStringCommand(sqlStatement.ToString()), connection);


            if (connection.Transaction == null)
            {
                // Execute the SQL statement, returning a DataSet.
                ds = connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);
            }
            else
            {
                // Execute the SQL statement, returning a DataSet.
                ds = connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand,
                    connection.Transaction);
            }

            return ds.Tables[0];

        }

       
    }
}
