using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
  public partial  class NOTEBL
    {
        public List<NOTEDC> LoadByPrimaryKey(int SCREEN_ID, int SCREEN_RECORD_ID)
        {
            DBConnection objConnection = new DBConnection();
            NOTEDA objNOTEDA = new NOTEDA();
            List<NOTEDC> objNOTEDC = null;
            try
            {
                objConnection.Open(false);
                objNOTEDC = objNOTEDA.LoadByPrimaryKey(objConnection, SCREEN_ID, SCREEN_RECORD_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objNOTEDC;
        }
    }
}
