using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using System.Data;

namespace EPay.DataAccess
{
    public partial class ErroLogDA
    {

        //public int Insert(DBConnection Connection, List<ErrorLogDC> objErrorLogs)
        //{
        //    int insertCount = 0;
        //    foreach (ErrorLogDC errLog in objErrorLogs)
        //    {
        //        insertCount = Insert(Connection, errLog);
        //    }
        //    return insertCount;
        //}
       public int Insert(ErrorLogDC objErrorLog)
       {
           DBConnection Connection = new DBConnection();
           Connection.Open(false);
           int insertCount = 0;
           try
           {
                if (objErrorLog.On == DateTime.MinValue)
                {
                    objErrorLog.On = DateTime.Now;
                }
               StringBuilder sql = new StringBuilder();
               sql.Append("proc_ErrorLogInsert");

               DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


               dbCommandWrapper.AddOutParameter("EL_ID", DbType.Int32, objErrorLog.ErrorLogID);
               dbCommandWrapper.AddInParameter("AU_ERROR_RECEIVER", DbType.Int32, objErrorLog.ErrorReceiver);
               dbCommandWrapper.AddInParameter("EL_ERROR_ON", DbType.DateTime, objErrorLog.On);
               dbCommandWrapper.AddInParameter("EL_ERROR_FROM", DbType.String, objErrorLog.From);
               dbCommandWrapper.AddInParameter("EL_ERROR_DESCRIP", DbType.String, objErrorLog.Description);



               if (Connection.Transaction != null)
                   insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
               else
                   insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);
               Connection.Commit();
               return insertCount;
           }
           catch (Exception ex)
           {
               objErrorLog.SetError(ex);
               throw ex;
 
           }
       }
    }
}
