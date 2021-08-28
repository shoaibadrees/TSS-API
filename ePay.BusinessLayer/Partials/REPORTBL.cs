using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;
using EPay.Common;
using EPay.DAL.DataClasses; 

namespace EPay.BusinessLayer
{
    public partial class REPORTBL
    {
        
        public List<REPORTDC> GenerateOutageNumbersReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID, String snapshotDateTime = null,
            String reportType = "NUMBERS", int snapshotType = -1)
        {
            DBConnection objConnection = new DBConnection();
            REPORTDA objREPORTDA = new REPORTDA();
            List<REPORTDC> listREPORTDC = null;
            try
            {
                objConnection.Open(false);
                listREPORTDC = objREPORTDA.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, snapshotDateTime, reportType, snapshotType, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return listREPORTDC;
        }
        public List<REPORTDC> GenerateResourceReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID, String snapshotDateTime = null,
            String reportType = "NUMBERS", int snapshotType = -1)
        {
            DBConnection objConnection = new DBConnection();
            REPORTDA objREPORTDA = new REPORTDA();
            List<REPORTDC> listREPORTDC = null;
            try
            {
                objConnection.Open(false);
                listREPORTDC = objREPORTDA.GenerateResourceReport(EVENT_ID, RMAG_ID, COMPANY_ID, snapshotDateTime, snapshotType, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return listREPORTDC;
        }
        public int GenerateSnapshot(int EVENT_ID, int CREATED_BY,DateTime dtDateTime, String snapshotType, DBConnection objConnection)
        {
            REPORTDA rptDA = new REPORTDA();
            return rptDA.GenerateSnapshot(EVENT_ID, CREATED_BY,dtDateTime, snapshotType, objConnection);
        }
    }
}
