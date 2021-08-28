using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.DataClasses;
using System.Reflection;
namespace EPay.DataAccess
{
    public class TASK_ROSTERDA
    {

        public List<TASK_ROSTERDC> LoadAll(string projectIDs, DBConnection Connection)
        {
            List<TASK_ROSTERDC> lstTaskRoster = new List<TASK_ROSTERDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_TASK_ROSTER_LOADAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("@p_projectIDs", DbType.String, projectIDs);

            DataSet ds = new DataSet();
            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows) //-- JOBS table 
            {
                TASK_ROSTERDC jobObj = FillObject(drRow);
                if (jobObj.NOTES_COUNT > 0 && jobObj.NOTES_DATE != null)
                {
                    jobObj.JOB_NOTES = "(" + jobObj.NOTES_COUNT + ") " + (Convert.ToDateTime(jobObj.NOTES_DATE).ToString("MM/dd/yyyy HH:mm"));
                }
                else
                    jobObj.JOB_NOTES = string.Empty;
                
                lstTaskRoster.Add(jobObj);
            }

            FillTables(lstTaskRoster, ds);
            return lstTaskRoster;
        }


        private void FillTables(List<TASK_ROSTERDC> lstTaskRoster, DataSet ds)
        {
            if (ds.Tables.Count > 2)
            {
                for (int i = 1; i < ds.Tables.Count; i++)  //-- skip JOBS table
                {
                    foreach (DataRow drRow in ds.Tables[i].Rows)
                    {
                        int job_ID = Convert.ToInt32(drRow["JOB_ID"]);
                        var objJobFound = lstTaskRoster.Find(x => x.JOB_ID == job_ID);
                        if (objJobFound != null)
                            FillObject(drRow, objJobFound);
                    }
                }
            }
        }

        private TASK_ROSTERDC FillObject(DataRow row, TASK_ROSTERDC obj = null)
        {

            if (obj == null)
                obj = new TASK_ROSTERDC();
            foreach (DataColumn column in row.Table.Columns)
            {
                try
                {
                    PropertyInfo prop = obj.GetType().GetProperty(column.ColumnName);
                    object value = row[column.ColumnName];
                    prop.SetValue(obj, row.IsNull(prop.Name) ? null : row[prop.Name], null);
                }

                catch (Exception ex)
                {
                    String logFile = System.Web.HttpContext.Current.Server.MapPath("~/ErrorLog-TaskRoster.txt");
                    System.IO.FileStream file = new
                        System.IO.FileStream(logFile, System.IO.FileMode.Append);
                    System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
                    sw.WriteLine("DateTime: " + DateTime.Now.ToString());
                    sw.WriteLine("Column Name: " + column.ColumnName);
                    sw.WriteLine("Row Value: " + Convert.ToString(row[column.ColumnName]));
                    sw.WriteLine("Description: " + ex.Message);
                    sw.WriteLine("--------------------------------------------------");
                    sw.Close();
                    file.Close();
                    throw (ex);
                }
            }


            return obj;
        }

    }
}
