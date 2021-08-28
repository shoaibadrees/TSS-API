
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 2/23/2017 2:54:14 PM
// Last Updated on: 

using System;
using System.Collections.Generic;
using EPay.DataAccess;
using EPay.DataClasses;
using EPay.DataAccess;
using NMART.DataAccess;


namespace EPay.BusinessLayer
{
    public class PayDepartmentBL
    {
        public bool IsDirty { get; set; }

        public List<PayDepartmentDC> LoadAll()
        {
            DBConnection objConnection = new DBConnection();

            PayDepartmentDA objPayDepartmentDA = new PayDepartmentDA();
            List<PayDepartmentDC> objPayDepartmentDC = null;
            try
            {
                objConnection.Open(false);
                objPayDepartmentDC = objPayDepartmentDA.LoadAll(objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPayDepartmentDC;
        }


        public PayDepartmentDC LoadByPrimaryKey(string Code)
        {
            DBConnection objConnection = new DBConnection();
            PayDepartmentDA objPayDepartmentDA = new PayDepartmentDA();
            PayDepartmentDC objPayDepartmentDC = null;
            try
            {
                objConnection.Open(false);
                objPayDepartmentDC = objPayDepartmentDA.LoadByPrimaryKey(objConnection, Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPayDepartmentDC;
        }
        public int Update(List<PayDepartmentDC> objPayDesignations)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            PayDepartmentDA objPayDepartmentDA = new PayDepartmentDA();
            try
            {
                objConnection.Open(true);
                updatedCount = objPayDepartmentDA.Update(objConnection, objPayDesignations);
                IsDirty = objPayDepartmentDA.IsDirty;
                if (IsDirty)
                    objConnection.Rollback();
                else
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
            return updatedCount;
        }
        public int Insert(List<PayDepartmentDC> objPayDesignations)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            PayDepartmentDA objPayDepartmentDA = new PayDepartmentDA();
            try
            {
                objConnection.Open(true);
                insertedCount = objPayDepartmentDA.Insert(objConnection, objPayDesignations);
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
        public int Delete(List<PayDepartmentDC> objPayDesignations)
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            PayDepartmentDA objPayDepartmentDA = new PayDepartmentDA();
            try
            {
                objConnection.Open(true);
                deletedCount = objPayDepartmentDA.Delete(objConnection, objPayDesignations);
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
