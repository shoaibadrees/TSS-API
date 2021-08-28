using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.DataAccess;
using System.Configuration;
namespace EPay.BusinessLayer
{
   public class AdhocReportBL
    {
       public AdhocReportBL()
        {
            //constructor
        }

        public System.Data.DataTable GetAdhocTable(string SqlQuery)
        {
            DBConnection connection = null;
            var strCon = ConfigurationManager.ConnectionStrings["HylandbAdhoc"];
            connection = new DBConnection(strCon.ToString(), EPay.Common.Constants.ServerType.SQLServer);
            
            System.Data.DataTable dtbAdocReport = new System.Data.DataTable();
            AdhocReportDA daAdhocReport = new AdhocReportDA();
            try
            {
                connection.Open(false);
                dtbAdocReport = daAdhocReport.GetAdhocReportTable(SqlQuery, connection);

            }
            catch (Exception exception)
            {
                throw exception;
            }
            finally
            {
                connection.Close();
            }

            return dtbAdocReport;
        }

       
    }
}
