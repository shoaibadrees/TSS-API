using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.DataClasses;
using System.Reflection;
using EPay.Common;

namespace EPay.DataAccess
{
    public class TASK_MATRIXDA
    {

        public List<TASK_MATRIXDC> TaskMatrixLoadAll(string projectIDs, string jfnIDs, string jobStatusIDS, string taskStatusIDs, string tmDate, DBConnection Connection)
        {
            List<TASK_MATRIXDC> lstTaskMatrix = new List<TASK_MATRIXDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_TASK_MATRIX_LOADAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_jfnIDs", DbType.String, jfnIDs);
            dbCommandWrapper.AddInParameter("p_jobStatusIDs", DbType.String, jobStatusIDS);
            dbCommandWrapper.AddInParameter("p_taskStatusIDs", DbType.String, taskStatusIDs);

            DateTime tmDateTime = DateTime.MinValue;
            if (!String.IsNullOrEmpty(tmDate) && DateTime.TryParse(tmDate, out tmDateTime))
                dbCommandWrapper.AddInParameter("p_DatePrm", DbType.String, tmDate);
            else
                dbCommandWrapper.AddInParameter("p_DatePrm", DbType.String, "All");


            DataSet ds = new DataSet();
            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            lstTaskMatrix.AddRange(Utility.ConvertToObjects<TASK_MATRIXDC>(ds.Tables[0]));
            return lstTaskMatrix;
        }
        public List<TASK_MATRIXDC> TaskOnHoldLoadAll(string projectIDs, string jfnIDs, string jobStatusIDS, string taskNames, string tmDate, DBConnection Connection)
        {
            List<TASK_MATRIXDC> lstTaskMatrix = new List<TASK_MATRIXDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_TASK_MATRIX_ON_HOLD_LOADAll");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_projectIDs", DbType.String, projectIDs);
            dbCommandWrapper.AddInParameter("p_jfnIDs", DbType.String, jfnIDs);
            dbCommandWrapper.AddInParameter("p_jobStatusIDs", DbType.String, jobStatusIDS);
            dbCommandWrapper.AddInParameter("p_taskNames", DbType.String, taskNames);

            DateTime tmDateTime = DateTime.MinValue;
            if (!String.IsNullOrEmpty(tmDate) && DateTime.TryParse(tmDate, out tmDateTime))
                dbCommandWrapper.AddInParameter("p_DatePrm", DbType.String, tmDate);
            else
                dbCommandWrapper.AddInParameter("p_DatePrm", DbType.String, "All");

            int onHoldReasonsCount = 0;
            DataSet ds = new DataSet();
            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);
            if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0) {
                if (ds.Tables[1].Columns.Contains("ON_HOLD_REASON_COUNT")){
                    onHoldReasonsCount = (int)ds.Tables[1].Rows[0]["ON_HOLD_REASON_COUNT"];
                }
            }
            foreach (DataRow row in ds.Tables[0].Rows) {
                lstTaskMatrix.Add(FillObject(row, onHoldReasonsCount));
            }
            return lstTaskMatrix;
        }
        private TASK_MATRIXDC FillObject(DataRow row, TASK_MATRIXDC obj = null)
        {

            if (obj == null)
                obj = new TASK_MATRIXDC();
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
                    String logFile = System.Web.HttpContext.Current.Server.MapPath("~/ErrorLog-TaskMatrix.txt");
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

        private TASK_MATRIXDC FillObject(DataRow row, int onHoldReasonsCount)
        {
            TASK_MATRIXDC taskMatrixDC = new TASK_MATRIXDC();
            taskMatrixDC.JOB_ID = (int)row["JOB_ID"];
            taskMatrixDC.PROJECT_ID = (int)row["PROJECT_ID"];
            taskMatrixDC.HYLAN_PROJECT_ID = Convert.ToString(row["HYLAN_PROJECT_ID"]);
            taskMatrixDC.JOB_FILE_NUMBER = Convert.ToString(row["JOB_FILE_NUMBER"]);
            taskMatrixDC.CLIENT_NAME = Convert.ToString(row["CLIENT_NAME"]);
            taskMatrixDC.NEEDED_TASKS_COUNT = (int)row["NEEDED_TASKS_COUNT"];
            taskMatrixDC.TASK_NAME = Convert.ToString(row["TASK_NAME"]);
            taskMatrixDC.ON_HOLD_REASONS = new List<DD_DTO>();
            for (int colInd = row.Table.Columns.Count -1 ; colInd >= (row.Table.Columns.Count - onHoldReasonsCount); colInd--) {
                DD_DTO onHoldReason = new DD_DTO();
                onHoldReason.TEXT = row.Table.Columns[colInd].ColumnName.Replace(" ", "_").ToUpper();
                if (row.Table.Columns[colInd].ColumnName == "ON_HOLD_REASON_OTHER")
                {
                    onHoldReason.TEXT2 = Convert.ToString(row[row.Table.Columns[colInd].ColumnName]);
                }
                else
                    onHoldReason.VALUE = (int)row[row.Table.Columns[colInd].ColumnName];

                taskMatrixDC.ON_HOLD_REASONS.Add(onHoldReason);
            }

            //taskMatrixDC.REASON_A = (int)row["REASON_A"];
            //taskMatrixDC.REASON_B = (int)row["REASON_B"];
            //taskMatrixDC.Other = (int)row["Other"];
            //taskMatrixDC.ON_HOLD_REASON_OTHER = Convert.ToString(row["ON_HOLD_REASON_OTHER"]);

            return taskMatrixDC;
        }

    }
}
