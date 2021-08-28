using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using EPay.DataAccess;
using EPay.DataClasses;
using NMART.BusinessLayer;
using NMART.DataClasses;

namespace EPay.BusinessLayer
{
    class EMAIL_GROUPSBL
    {
        public string GetEmailsAgainstClient(string clientName)
        {
            DBConnection objConnection = new DBConnection();
            EMAIL_GROUPSDA objDAILDA = new EMAIL_GROUPSDA();
            string emails = null;
            try
            {
                objConnection.Open(false);
                emails = objDAILDA.GetEmailsAgainstClient(objConnection, clientName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return emails;
        }
    }
}
