using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public partial class COMPANIEBL
    {
        public List<COMPANIEDC> GetCompaniesForExport(string COMPANIES_IDs)
        {
            DBConnection objConnection = new DBConnection();
            COMPANIEDA objCOMPANIEDA = new COMPANIEDA();
            List<COMPANIEDC> objCOMPANIEDC = null;
            try
            {
                objConnection.Open(false);
                if (!string.IsNullOrEmpty(COMPANIES_IDs) && COMPANIES_IDs.Length > 0)
                {
                    objCOMPANIEDC = objCOMPANIEDA.GetCompaniesForExport(COMPANIES_IDs, objConnection);
                }
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

        public int Updates(List<COMPANIEDC> objCOMPANIEs,ref List<EXCEPTIONDC> lstExceptions)
        {
            COMPANIEDA objCompany = new COMPANIEDA();
            int updatedCount = 0;
            //List<COMPANIES_RMAGDC> objCompRmagsList;
            DBConnection objConnection = new DBConnection();
            try {
                foreach (COMPANIEDC objCOMPANIE in objCOMPANIEs)
                {
                    try
                    {
                        objConnection.Open(true);
                        USERS_COMPANIEBL Usercompany = new USERS_COMPANIEBL();
                        if (objCOMPANIE.STATUS == "N")
                        {
                            int associatedRowscount = Usercompany.CheckCompanyAssociation(objCOMPANIE.COMPANY_ID);
                            if (associatedRowscount > 0)
                            {
                                throw new Exception("Associated record(s) cannot be inactive. All other changes saved successfully.");
                            }
                        }
                        updatedCount = objCompany.Update(objConnection, objCOMPANIE);
                        objConnection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = objCOMPANIE.COMPANY_ID;
                        objExcption.EXCEPTION_MESSAGE = exp.Message;
                        objExcption.STACK_TRACK = exp.StackTrace;
                        lstExceptions.Add(objExcption);
                        objConnection.Rollback();
                    }

                }
                if (lstExceptions.Count > 0)
                    throw new Exception(lstExceptions[0].EXCEPTION_MESSAGE);

                }
            catch (Exception exp)
            {
               
                throw exp;
            }
            finally
            {
                objConnection.Close();
            }
              
            return updatedCount;
        }

        public int Inserts(DBConnection Connection, List<COMPANIEDC> objCOMPANIEs)
        {
            int isInserted = 0;
            COMPANIEDA objCompany = new COMPANIEDA();
            foreach (COMPANIEDC objCOMPANIE in objCOMPANIEs)
            {
                isInserted = objCompany.Insert(Connection, objCOMPANIE);

                if (objCOMPANIE.COMPANY_ID == -111)
                {
                    throw new Exception("Client Name '" + objCOMPANIE.COMPANY_NAME + "' already exists. All other changes saved successfully.");
                }
                if (objCompany.IsDirty)
                {
                    break;
                }
            }
            if (IsDirty)
            {
                isInserted = -1;
            }
            return isInserted;
        }

        public List<COMPANIEDC> LoadAllActiveCompanies()
        {
            DBConnection objConnection = new DBConnection();
            COMPANIEDA objCOMPANIEDA = new COMPANIEDA();
            List<COMPANIEDC> objCOMPANIEDC = null;
            try
            {
                objConnection.Open(false);
                objCOMPANIEDC = objCOMPANIEDA.LoadAllActiveCompanies(objConnection);
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

        public string CompanyNameString(string companyids)
        {
            DBConnection objConnection = new DBConnection();
            COMPANIEDA objCOMPANIEDA = new COMPANIEDA();
            string companyNames = string.Empty;
            try
            {
                objConnection.Open(false);
                companyNames = objCOMPANIEDA.CompanyNameString(objConnection,companyids);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return companyNames;
        }
    }
}
