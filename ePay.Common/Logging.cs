using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace EPay.Common
{
    public static class Logging
    {
        public static void LogExceptionInFile(string strMsg, string strSource, string strCatagory, string strStackTrace)
        {
            try
            {
                String logFile = System.Configuration.ConfigurationSettings.AppSettings["LogFile"];
                string baseFolder = HttpContext.Current.Server.MapPath("~/" + logFile);
                if (String.IsNullOrEmpty(baseFolder))
                    baseFolder = "EMS.EXEC_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + ".log";

                System.IO.FileStream file = new
                    System.IO.FileStream(baseFolder, System.IO.FileMode.Append);
                System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
                sw.WriteLine("DateTime: " + DateTime.Now.ToString());
                sw.WriteLine("Error Message: " + strMsg);
                sw.WriteLine("Error Category: " + strCatagory);
                sw.WriteLine("From: " + strSource);
                sw.WriteLine("Description: " + strStackTrace);
                sw.WriteLine("--------------------------------------------------");
                sw.Close();
                file.Close();
            }
            catch (Exception exp)
            {
            }
        }
        public static void LogException(Exception exception, string additionalInfo)
        {
            try
            {
                String logFile = System.Configuration.ConfigurationSettings.AppSettings["LogFile"];
                if (String.IsNullOrEmpty(logFile))
                    logFile = "EMS.EXEC_" + DateTime.Now.Month + "_" + DateTime.Now.Day + "_" + DateTime.Now.Year + ".log";
                System.IO.FileStream file = new
                    System.IO.FileStream(logFile, System.IO.FileMode.Append);
                System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
                sw.WriteLine("DateTime: " + DateTime.Now.ToString());
                sw.WriteLine("Custom Information: " + additionalInfo);
                sw.WriteLine("Error Message: " + exception.Message);
                sw.WriteLine("Stack Trace: " + exception.StackTrace);
                sw.WriteLine("--------------------------------------------------");
                sw.Close();
                file.Close();
            }
            catch (Exception exp)
            {

            }
        }
    }
}
