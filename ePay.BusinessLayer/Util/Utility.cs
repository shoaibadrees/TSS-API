using EPay.BusinessLayer;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace EPay.Util
{
   public class Utility
    {
        public Utility()
        {
            // Constructor
        }
        public static void InsertIntoErrorLog(String source, String StrStackTrace, int UserID)
        {
            //Write into database
            try
            {
                
                ErrorLogBL errorLog
                    = new ErrorLogBL();
                ErrorLogDC errorLogDC = new ErrorLogDC();
                if (StrStackTrace.Length > 1999)
                    errorLogDC.Description = StrStackTrace.Substring(0, 1999);
                else
                    errorLogDC.Description = StrStackTrace;
                errorLogDC.On = DateTime.Now;

                if (source.Length > 99)
                    errorLogDC.From = source.Substring(0, 99);
                else
                    errorLogDC.From = source;

                errorLogDC.ErrorReceiver = UserID;
                errorLog.Add(errorLogDC);
            }
            catch (Exception)
            {

            }
            //Write into File
            try
            {
                String logFile = System.Web.HttpContext.Current.Server.MapPath("~/ErrorLog.txt");

                System.IO.FileStream file = new
                    System.IO.FileStream(logFile, System.IO.FileMode.Append);
                System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
                sw.WriteLine("DateTime: " + DateTime.Now.ToString());
                sw.WriteLine("Error Receiver ID: " + UserID);
                //sw.WriteLine("Message: " + expection.Message);
                //sw.WriteLine("InnerException: " + expection.InnerException);
                sw.WriteLine("From: " + source);
                sw.WriteLine("Description: " + StrStackTrace);
                sw.WriteLine("--------------------------------------------------");
                sw.Close();
                file.Close();
            }
            catch(Exception ex)
            {
            }
        }
        public static string PrepareStringForDB(string data)
        {
            data = data.Replace("'", "''");
            return data;
        }

    }
}
