using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public partial class ROLEBL
    {
        public ROLEDC LoadRoleDetails(int ROLE_ID)
        {
            DBConnection objConnection = new DBConnection();
            ROLEDA objROLEDA = new ROLEDA();
            ROLEDC objROLEDC = null;
            try
            {
                objConnection.Open(false);
                objROLEDC = objROLEDA.LoadRoleDetails(objConnection, ROLE_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objROLEDC;
        }
    }
}