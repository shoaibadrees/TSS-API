
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/11/2017 6:16:13 PM
// Last Updated on: 

using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public partial class PROJECTBL
    {
        public bool ISDIRTY { get; set; }

        public List<PROJECTDC> LoadAll(string clientIDs = "All", string projectStatusIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            PROJECTDA objPROJECTDA = new PROJECTDA();
            List<PROJECTDC> objPROJECTDC = null;
            try
            {
                objConnection.Open(false);
                objPROJECTDC = objPROJECTDA.LoadAll(objConnection, clientIDs, projectStatusIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPROJECTDC;
        }
        public List<PROJECTDC> LoadAllByStatus(String projectStatus)
        {
            DBConnection objConnection = new DBConnection();
            PROJECTDA objPROJECTDA = new PROJECTDA();
            List<PROJECTDC> objPROJECTDC = null;
            try
            {
                objConnection.Open(false);
                objPROJECTDC = objPROJECTDA.LoadAllByStatus(objConnection, projectStatus);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPROJECTDC;
        }

        public PROJECTDC LoadByPrimaryKey(int ID)
        {
            DBConnection objConnection = new DBConnection();
            PROJECTDA objPROJECTDA = new PROJECTDA();
            PROJECTDC objPROJECTDC = null;
            try
            {
                objConnection.Open(false);
                objPROJECTDC = objPROJECTDA.LoadByPrimaryKey(objConnection, ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPROJECTDC;
        }
       
        public int Update(List<PROJECTDC> objProjects, ref List<EXCEPTIONDC> lstExceptions)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            PROJECTDA projectsDA = new PROJECTDA();
            try
            {
                foreach (PROJECTDC obj in objProjects)
                {
                    objConnection.Open(true);
                    try
                    {
                        updatedCount = projectsDA.Update(objConnection, obj);
                        if (obj.ISDIRTY)
                            break;
                        objConnection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = obj.PROJECT_ID;
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
        public int Insert(List<PROJECTDC> objPROJECTs)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            PROJECTDA objPROJECTDA = new PROJECTDA();
            try
            {
                objConnection.Open(true);
                insertedCount = objPROJECTDA.Insert(objConnection, objPROJECTs);
                objConnection.Commit();
            }
            catch (Exception ex)
            {
                objConnection.Rollback();
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return insertedCount;
        }
        public int Delete(List<PROJECTDC> objPROJECTs)
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            PROJECTDA objPROJECTDA = new PROJECTDA();
            try
            {
                objConnection.Open(true);
                deletedCount = objPROJECTDA.Delete(objConnection, objPROJECTs);
                objConnection.Commit();
            }
            catch (Exception ex)
            {
                objConnection.Rollback();
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return deletedCount;
        }


    }
}
