using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.BusinessLayer;
using EPay.DataClasses;
using EPay.DAL.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
   public class ErrorLogBL
    {
        public ErrorLogBL()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public bool Add(ErrorLogDC errorLog)
        {
            DBConnection conn = null;
            conn = new DBConnection();
            bool success = true;

            ErroLogDA errorLogHandler = new ErroLogDA();
           // ErrorLogDC errorLogList = new ErrorLogDC();

            try
            {
                
                conn.Open(false);
                errorLogHandler.Insert(errorLog);
            }
            catch (Exception exp)
            {
                success = false;
                throw exp;
            }
            finally
            {
                conn.Close();
            }
            return success;

        }
    }
}
