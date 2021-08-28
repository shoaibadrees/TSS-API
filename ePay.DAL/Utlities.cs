using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataAccess;
using EPay.DataClasses;
using System.Web;

namespace EPay.DataAccess
{
    public static class Utilities
    {
        public static void InsertIntoErrorLog(String source, String StrStackTrace, int UserName)
        {
            //Write into database
            try
            {

                ErroLogDA errorLog
                    = new ErroLogDA();

                ErrorLogDC errorLogDC
                    = new ErrorLogDC();
                if (StrStackTrace.Length > 1999)
                    errorLogDC.Description = StrStackTrace.Substring(0, 1999);
                else
                    errorLogDC.Description = StrStackTrace;
                errorLogDC.On = DateTime.Now;

                if (source.Length > 99)
                    errorLogDC.From = source.Substring(0, 99);
                else
                    errorLogDC.From = source;

                errorLogDC.ErrorReceiver = UserName;
                errorLog.Insert(errorLogDC);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            //Write into File
            try
            {
                String logFile = System.Web.HttpContext.Current.Server.MapPath("~/ErrorLog.txt");
                System.IO.FileStream file = new
                    System.IO.FileStream(logFile, System.IO.FileMode.Append);
                System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
                sw.WriteLine("DateTime: " + DateTime.Now.ToString());
                sw.WriteLine("Error Receiver: " + UserName);
                sw.WriteLine("From: " + source);
                sw.WriteLine("Description: " + StrStackTrace);
                sw.WriteLine("--------------------------------------------------");
                sw.Close();
                file.Close();
            }
            catch (Exception)
            {
            }
        }
        public static string NotesFormat(int notesCount, DateTime noteslastAddedDate)
        {
            string notes = string.Empty;
            if (notesCount == 0)
            {
                notes = "(0)";
            }
            else
            {
                string notesDate = String.Format("{0:MM/dd/yyyy HH:mm}", noteslastAddedDate);
                notes = "(" + notesCount + ") " + notesDate;
            }

            return notes; 
        }

        public static string AttachmentsFormat(int attchmentsCount)
        {
           return "(" + attchmentsCount + ") ";
        }

    }
}
