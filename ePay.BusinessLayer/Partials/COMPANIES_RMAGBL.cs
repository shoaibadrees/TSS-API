using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NMART.DataClasses;
using NMART.DataAccess;

namespace NMART.BusinessLayer
{
    public partial class COMPANIES_RMAGBL
    {

        public List<COMPANIEDC> GetCompaniesByRmags(String Rmags)
        {
            DBConnection objConnection = new DBConnection();
            COMPANIES_RMAGDA objCOMPANIES_RMAGDA = new COMPANIES_RMAGDA();
            List<COMPANIEDC> objCOMPANIEDC = null;
            try
            {
                objConnection.Open(false);
                objCOMPANIEDC = objCOMPANIES_RMAGDA.GetCompaniesByRmags(Rmags, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objCOMPANIEDC;
        }

        public List<COMPANIEDC> GetCompaniesByRmagsAndInvitedCompanies(String Rmags,int EventId)
        {
            DBConnection objConnection = new DBConnection();
            COMPANIES_RMAGDA objCOMPANIES_RMAGDA = new COMPANIES_RMAGDA();
            List<COMPANIEDC> objCOMPANIEDC = null;
            try
            {
                objConnection.Open(false);
                objCOMPANIEDC = objCOMPANIES_RMAGDA.GetCompaniesByRmagsAndInvitedCompanies(Rmags,EventId, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objCOMPANIEDC;
        }
       
    }
}
