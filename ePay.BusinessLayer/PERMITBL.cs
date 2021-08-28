using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public partial class PERMITBL
    {
        public bool IsDirty { get; set; }

        public List<PERMITDC> LoadAll(string projectIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            PERMITDA objPERMITDA = new PERMITDA();
            List<PERMITDC> objPERMITDC = null;
            try
            {
                objConnection.Open(false);
                objPERMITDC = objPERMITDA.LoadAll(objConnection, projectIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPERMITDC;
        }


        public List<PERMITDC> LoadDashboard(string projectIDs = "All", string permitStatus = "All", string clientIDs = "All", string jobFileNo = "All", string submitedStartDt = "All", string submitedEndDt = "All")
        {
            DBConnection objConnection = new DBConnection();
            PERMITDA objPERMITDA = new PERMITDA();
            List<PERMITDC> objPERMITDC = null;
            try
            {
                objConnection.Open(false);
                objPERMITDC = objPERMITDA.LoadDashboard(objConnection, projectIDs, permitStatus, clientIDs, jobFileNo, submitedStartDt, submitedEndDt);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPERMITDC;
        }

        public PERMITDC LoadByPrimaryKey(int PERMIT_ID)
        {
            DBConnection objConnection = new DBConnection();
            PERMITDA objPERMITDA = new PERMITDA();
            PERMITDC objPERMITDC = null;
            try
            {
                objConnection.Open(false);
                objPERMITDC = objPERMITDA.LoadByPrimaryKey(objConnection, PERMIT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPERMITDC;
        }
        //public int Update(List<PERMITDC> objPERMITs)
        //{
        //    int updatedCount = 0;
        //    DBConnection objConnection = new DBConnection();
        //    PERMITDA objPERMITDA = new PERMITDA();
        //    try
        //    {
        //        objConnection.Open(true);
        //        updatedCount = objPERMITDA.Update(objConnection, objPERMITs);
        //        IsDirty = objPERMITDA.IsDirty;
        //        if (IsDirty)
        //            objConnection.Rollback();
        //        else
        //            objConnection.Commit();
        //    }
        //    catch (Exception ex)
        //    {
        //        objConnection.Rollback();
        //        throw ex;
        //    }
        //    finally
        //    {
        //        objConnection.Close();
        //    }
        //    return updatedCount;
        //}

        public int Update(List<PERMITDC> objs, ref List<EXCEPTIONDC> lstExceptions)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            PERMITDA objDA = new PERMITDA();
            try
            {
                foreach (PERMITDC obj in objs)
                {
                    objConnection.Open(true);
                    try
                    {
                        updatedCount = objDA.Update(objConnection, obj);
                        if (obj.IsDirty)
                            break;
                        objConnection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = obj.PERMIT_ID;
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

        public List<DD_DTO> GetJobFileNumbers(string projectIDs)
        {
            DBConnection objConnection = new DBConnection();
            PERMITDA obJDA = new PERMITDA();
            List<DD_DTO> objDD_DTO = new List<DD_DTO>();
            try
            {
                objConnection.Open(false);
                objDD_DTO = obJDA.GetJobFileNumbers(objConnection, projectIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objDD_DTO;
        }

        public int Insert(List<PERMITDC> objPERMITs, ref List<EXCEPTIONDC> lstExceptions)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            PERMITDA objPERMITDA = new PERMITDA();
            try
            {
                foreach (PERMITDC obj in objPERMITs)
                {
                    try
                    {
                        objConnection.Open(true);
                        insertedCount = objPERMITDA.Insert(objConnection, obj);
                        objConnection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = obj.PERMIT_ID;
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

            return insertedCount;
        }
        
        public int Delete(List<PERMITDC> objs, ref List<EXCEPTIONDC> lstExceptions)
        {
            int deleteCount = 0;
            DBConnection Connection = new DBConnection();
            try
            {
                PERMITDA objDA = new PERMITDA();
                foreach (PERMITDC obj in objs)
                {
                    try
                    {
                        Connection.Open(true);
                        deleteCount = objDA.Delete(Connection, obj);
                        Connection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = obj.PERMIT_ID;
                        objExcption.EXCEPTION_MESSAGE = exp.Message;
                        objExcption.STACK_TRACK = exp.StackTrace;
                        lstExceptions.Add(objExcption);
                        Connection.Rollback();
                    }
                }
                if (lstExceptions.Count > 0)
                    throw new Exception("Excption Occure");

            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                Connection.Close();
            }
            return deleteCount;
        }

    }
}
