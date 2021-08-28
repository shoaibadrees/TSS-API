using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Linq;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.DataClasses;

using EPay.Common;
using EPay.DAL.DataClasses;
using EPay.DataAccess; 

namespace EPay.DataAccess
{
    public partial class REPORTDA
    {
       
        public List<REPORTDC> GenerateOutageNumbersReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID, String snapshotDateTime,
            String reportType, int snapshotType, DBConnection Connection)
        {
            List<REPORTDC> listREPORTDC = new List<REPORTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_GenerateOutageReport");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("P_EVENT_ID", DbType.Int32, EVENT_ID);
            dbCommandWrapper.AddInParameter("p_RMAG_ID", DbType.Int32, RMAG_ID);
            dbCommandWrapper.AddInParameter("p_COMPANY_ID", DbType.Int32, COMPANY_ID);
            dbCommandWrapper.AddInParameter("P_SNAPSHOT_DATETIME", DbType.String, snapshotDateTime);
            dbCommandWrapper.AddInParameter("P_REPORT_TYPE", DbType.String, reportType);
            dbCommandWrapper.AddInParameter("p_SS_MATCHING_TYPE", DbType.Int32, snapshotType);
            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);
            if (ds.Tables.Count > 0)
            {
                foreach (DataRow drRow in ds.Tables[0].Rows)
                {
                    listREPORTDC.Add(FillObject(drRow));
                }
            }
            return listREPORTDC;
        }
        public List<REPORTDC> GenerateResourceReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID,
            String snapshotDateTime, int snapshotType, DBConnection Connection)
        {
            List<REPORTDC> allocList = new List<REPORTDC>();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_GenerateResourceAllocationReport");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("P_EVENT_ID", DbType.Int32, EVENT_ID);
            dbCommandWrapper.AddInParameter("p_RMAG_ID", DbType.Int32, RMAG_ID);
            dbCommandWrapper.AddInParameter("p_COMPANY_ID", DbType.Int32, COMPANY_ID);
            dbCommandWrapper.AddInParameter("P_SNAPSHOT_DATETIME", DbType.String, snapshotDateTime);
            dbCommandWrapper.AddInParameter("p_SS_MATCHING_TYPE", DbType.Int32, snapshotType);
            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            if (ds.Tables.Count > 0)
            {
                foreach (DataRow drRow in ds.Tables[0].Rows)
                {
                    allocList.Add(FillAllocationReportObject(drRow));
                }
            }
            return allocList;
        }
        private REPORTDC FillObject(DataRow row)
        {
            REPORTDC reportDc = new REPORTDC();
            if (row.Table.Columns.Contains("COMPANY_NAME"))
                reportDc.COMPANY_NAME = row["COMPANY_NAME"] == DBNull.Value ? null : (String)row["COMPANY_NAME"];
            if (row.Table.Columns.Contains("RMAG_NAME"))
                reportDc.RMAG_NAME = row["RMAG_NAME"] == DBNull.Value ? null : (String)row["RMAG_NAME"];
            if (row.Table.Columns.Contains("CUSTOMER_SERVED"))
                reportDc.CUSTOMERS_SERVED = row["CUSTOMER_SERVED"] == DBNull.Value ? 0 : Convert.ToDouble(row["CUSTOMER_SERVED"]);
            if (row.Table.Columns.Contains("CUSTOMER_OUT"))
                reportDc.CUSTOMERS_OUT = row["CUSTOMER_OUT"] == DBNull.Value ? 0 : Convert.ToDouble(row["CUSTOMER_OUT"]);
            if (row.Table.Columns.Contains("CASES"))
                reportDc.CASES = row["CASES"] == DBNull.Value ? 0 : Convert.ToDouble(row["CASES"]);

            if (reportDc.CUSTOMERS_SERVED != 0)
                reportDc.CUSTOMERS_OUT_PCT = Math.Round((reportDc.CUSTOMERS_OUT / reportDc.CUSTOMERS_SERVED) * 100, 2);
            #region Cases Report
            if (row.Table.Columns.Contains("DISTRIBUTION"))
            {
                reportDc.DISTRIBUTION = row["DISTRIBUTION"] == DBNull.Value ? 0 : Convert.ToDouble(row["DISTRIBUTION"]);
                var sum = row.Table.AsEnumerable().Where(r => r["DISTRIBUTION"] != DBNull.Value).Sum(x => x.Field<System.Int64>("DISTRIBUTION"));
                if (sum != 0)
                {
                    reportDc.DISTRIBUTION_PCT = Math.Round((reportDc.DISTRIBUTION / sum) * 100, 1);
                }
            }

            if (row.Table.Columns.Contains("TRANSMISSION"))
            {
                reportDc.TRANSMISSION = row["TRANSMISSION"] == DBNull.Value ? 0 : Convert.ToDouble(row["TRANSMISSION"]);
                var sum = row.Table.AsEnumerable().Where(r => r["TRANSMISSION"] != DBNull.Value).Sum(x => x.Field<System.Int64>("TRANSMISSION"));
                if (sum != 0)
                {
                    reportDc.TRANSMISSION_PCT = Math.Round((reportDc.TRANSMISSION / sum) * 100, 1);
                }
            }
            if (row.Table.Columns.Contains("DAMAGE_ASSESSMENT"))
            {
                reportDc.DAMAGE_ASSESSMENT = row["DAMAGE_ASSESSMENT"] == DBNull.Value ? 0 : Convert.ToDouble(row["DAMAGE_ASSESSMENT"]);
                var sum = row.Table.AsEnumerable().Where(r => r["DAMAGE_ASSESSMENT"] != DBNull.Value).Sum(x => x.Field<System.Int64>("DAMAGE_ASSESSMENT"));
                if (sum != 0)
                {
                    reportDc.DAMAGE_ASSESSMENT_PCT = Math.Round((reportDc.DAMAGE_ASSESSMENT / sum) * 100, 1);
                }
            }
            if (row.Table.Columns.Contains("TREE"))
            {
                reportDc.TREE = row["TREE"] == DBNull.Value ? 0 : Convert.ToDouble(row["TREE"]);
                var sum = row.Table.AsEnumerable().Where(r => r["TREE"] != DBNull.Value).Sum(x => x.Field<System.Int64>("TREE"));
                if (sum != 0)
                {
                    reportDc.TREE_PCT = Math.Round((reportDc.TREE / sum) * 100, 1);
                }
            }
            if (row.Table.Columns.Contains("SUBSTATION"))
            {
                reportDc.SUBSTATION = row["SUBSTATION"] == DBNull.Value ? 0 : Convert.ToDouble(row["SUBSTATION"]);
                var sum = row.Table.AsEnumerable().Where(r => r["SUBSTATION"] != DBNull.Value).Sum(x => x.Field<System.Int64>("SUBSTATION"));
                if (sum != 0)
                {
                    reportDc.SUBSTATION_PCT = Math.Round((reportDc.SUBSTATION / sum) * 100, 1);
                }
            }
            if (row.Table.Columns.Contains("NET_UG"))
            {
                reportDc.NET_UG = row["NET_UG"] == DBNull.Value ? 0 : Convert.ToDouble(row["NET_UG"]);
                var sum = row.Table.AsEnumerable().Where(r => r["NET_UG"] != DBNull.Value).Sum(x => x.Field<System.Int64>("NET_UG"));
                if (sum != 0)
                {
                    reportDc.NET_UG_PCT = Math.Round((reportDc.NET_UG / sum) * 100, 1);
                }
            }
            #endregion

            #region Resources Report
            if (row.Table.Columns.Contains("NON_NATIVE_DISTRIBUTION"))
            {
                reportDc.NON_NATIVE_DISTRIBUTION = row["NON_NATIVE_DISTRIBUTION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_DISTRIBUTION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_TRANSMISSION"))
            {
                reportDc.NON_NATIVE_TRANSMISSION = row["NON_NATIVE_TRANSMISSION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_TRANSMISSION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_DAMAGE_ASSESSMENT"))
            {
                reportDc.NON_NATIVE_DAMAGE_ASSESSMENT = row["NON_NATIVE_DAMAGE_ASSESSMENT"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_DAMAGE_ASSESSMENT"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_TREE"))
            {
                reportDc.NON_NATIVE_TREE = row["NON_NATIVE_TREE"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_TREE"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_SUBSTATION"))
            {
                reportDc.NON_NATIVE_SUBSTATION = row["NON_NATIVE_SUBSTATION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_SUBSTATION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_NET_UG"))
            {
                reportDc.NON_NATIVE_NET_UG = row["NON_NATIVE_NET_UG"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_NET_UG"]);
            }
            #endregion

            return reportDc;
        }
        private REPORTDC FillAllocationReportObject(DataRow row)
        {
            REPORTDC reportDc = new REPORTDC();
            if (row.Table.Columns.Contains("COMPANY_NAME"))
                reportDc.COMPANY_NAME = row["COMPANY_NAME"] == DBNull.Value ? "" : (String)row["COMPANY_NAME"];
            if (row.Table.Columns.Contains("RMAG_NAME"))
                reportDc.RMAG_NAME = row["RMAG_NAME"] == DBNull.Value ? "" : (String)row["RMAG_NAME"];

            if (row.Table.Columns.Contains("IS_COMPANY"))
                reportDc.IS_COMPANY = row["IS_COMPANY"] == DBNull.Value ? "" : (String)row["IS_COMPANY"];
            if (row.Table.Columns.Contains("COMPANY_CITY"))
                reportDc.COMPANY_CITY = row["COMPANY_CITY"] == DBNull.Value ? "" : (String)row["COMPANY_CITY"];
            if (row.Table.Columns.Contains("COMPANY_STATE"))
                reportDc.COMPANY_STATE = row["COMPANY_STATE"] == DBNull.Value ? "" : (String)row["COMPANY_STATE"];

            if (row.Table.Columns.Contains("RELEASE_ROLE"))
                reportDc.RELEASE_ROLE = row["RELEASE_ROLE"] == DBNull.Value ? "" : Convert.ToDateTime(row["RELEASE_ROLE"]).ToString("yyyy-MM-dd HH:mm:ss.fff");
            
            if (row.Table.Columns.Contains("MODIFIED_ON"))
                reportDc.MODIFIED_ON = row["MODIFIED_ON"] == DBNull.Value ? "" : Convert.ToDateTime(row["MODIFIED_ON"]).ToString("yyyy-MM-dd HH:mm:ss.fff");

            if (row.Table.Columns.Contains("TIME_ZONE_NAME"))
            {
                reportDc.TIME_ZONE_NAME = row["TIME_ZONE_NAME"] == DBNull.Value ? null : (String)row["TIME_ZONE_NAME"];

                if (!String.IsNullOrEmpty(reportDc.TIME_ZONE_NAME))
                {
                    DateTime dateTime = Convert.ToDateTime(reportDc.MODIFIED_ON);
                    reportDc.APPLY_DL_SAVING = Utility.IsDayTimeSavingEffective(dateTime, reportDc.TIME_ZONE_NAME);
                }
            }
            
            #region Offers
            if (row.Table.Columns.Contains("DISTRIBUTION"))
            {
                reportDc.DISTRIBUTION = row["DISTRIBUTION"] == DBNull.Value ? 0 : Convert.ToDouble(row["DISTRIBUTION"]);
            }
            if (row.Table.Columns.Contains("TRANSMISSION"))
            {
                reportDc.TRANSMISSION = row["TRANSMISSION"] == DBNull.Value ? 0 : Convert.ToDouble(row["TRANSMISSION"]);
            }
            if (row.Table.Columns.Contains("DAMAGE_ASSESSMENT"))
            {
                reportDc.DAMAGE_ASSESSMENT = row["DAMAGE_ASSESSMENT"] == DBNull.Value ? 0 : Convert.ToDouble(row["DAMAGE_ASSESSMENT"]);
            }
            if (row.Table.Columns.Contains("TREE"))
            {
                reportDc.TREE = row["TREE"] == DBNull.Value ? 0 : Convert.ToDouble(row["TREE"]);
            }
            if (row.Table.Columns.Contains("SUBSTATION"))
            {
                reportDc.SUBSTATION = row["SUBSTATION"] == DBNull.Value ? 0 : Convert.ToDouble(row["SUBSTATION"]);
            }
            if (row.Table.Columns.Contains("NET_UG"))
            {
                reportDc.NET_UG = row["NET_UG"] == DBNull.Value ? 0 : Convert.ToDouble(row["NET_UG"]);
            }
            #endregion

            #region Acquired
            if (row.Table.Columns.Contains("NON_NATIVE_DISTRIBUTION"))
            {
                reportDc.NON_NATIVE_DISTRIBUTION = row["NON_NATIVE_DISTRIBUTION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_DISTRIBUTION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_TRANSMISSION"))
            {
                reportDc.NON_NATIVE_TRANSMISSION = row["NON_NATIVE_TRANSMISSION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_TRANSMISSION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_DAMAGE_ASSESSMENT"))
            {
                reportDc.NON_NATIVE_DAMAGE_ASSESSMENT = row["NON_NATIVE_DAMAGE_ASSESSMENT"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_DAMAGE_ASSESSMENT"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_TREE"))
            {
                reportDc.NON_NATIVE_TREE = row["NON_NATIVE_TREE"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_TREE"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_SUBSTATION"))
            {
                reportDc.NON_NATIVE_SUBSTATION = row["NON_NATIVE_SUBSTATION"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_SUBSTATION"]);
            }
            if (row.Table.Columns.Contains("NON_NATIVE_NET_UG"))
            {
                reportDc.NON_NATIVE_NET_UG = row["NON_NATIVE_NET_UG"] == DBNull.Value ? 0 : Convert.ToDouble(row["NON_NATIVE_NET_UG"]);
            }
            #endregion

            return reportDc;
        }
        public int GenerateSnapshot(int EVENT_ID, int CREATED_BY,DateTime dtDateTime, String snapshotType, DBConnection Connection)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_SS_SYSTEM_SNAPSHOTInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_EVENT_ID", DbType.Int32, EVENT_ID);
            dbCommandWrapper.AddInParameter("P_ST_SNAPSHOT_TYPE", DbType.String, snapshotType);
            dbCommandWrapper.AddInParameter("CURRENT_DATETIME", DbType.DateTime, dtDateTime);
            try
            {
                if (Connection.Transaction != null)
                    insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
                else
                    insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);
            }
            catch (Exception exp)
            {
                //Utilities.InsertIntoErrorLog("Error: GENERATE SNAPSHORT(" + snapshotType + ")", exp.Message + "\r\n" + exp.StackTrace, CREATED_BY);
                throw exp;
            }
            return insertCount;
        }
    }
}
