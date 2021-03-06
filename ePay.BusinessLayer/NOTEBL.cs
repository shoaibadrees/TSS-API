
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 1/19/2017 4:38:45 PM
// Last Updated on: 

using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public partial class NOTEBL
    {
        public bool IsDirty { get; set; }

        public List<NOTEDC> LoadAll()
        {
            DBConnection objConnection = new DBConnection();
            NOTEDA objNOTEDA = new NOTEDA();
            List<NOTEDC> objNOTEDC = null;
            try
            {
                objConnection.Open(false);
                objNOTEDC = objNOTEDA.LoadAll(objConnection);
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


       
        public int Update(List<NOTEDC> objNOTEs)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            NOTEDA objNOTEDA = new NOTEDA();
            try
            {
                objConnection.Open(true);
                updatedCount = objNOTEDA.Update(objConnection, objNOTEs);
                IsDirty = objNOTEDA.IsDirty;
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
        public int Insert(List<NOTEDC> objNOTEs)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            NOTEDA objNOTEDA = new NOTEDA();
            try
            {
                
                objConnection.Open(true);
                insertedCount = objNOTEDA.Insert(objConnection, objNOTEs);
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
        public int Delete(List<NOTEDC> objNOTEs)
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            NOTEDA objNOTEDA = new NOTEDA();
            try
            {
                objConnection.Open(true);
                deletedCount = objNOTEDA.Delete(objConnection, objNOTEs);
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
