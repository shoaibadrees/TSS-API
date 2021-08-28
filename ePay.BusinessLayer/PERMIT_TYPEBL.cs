using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;

namespace EPay.BusinessLayer
{
    public class PERMIT_TYPEBL
    {
        public bool IsDirty { get; set; }

        public List<PERMIT_TYPEDC> LoadAll(bool getDescWithCode = false)
        {
            DBConnection objConnection = new DBConnection();
            PERMITSTYPEDA objPERMITS_LOOK_UPDA = new PERMITSTYPEDA();
            List<PERMIT_TYPEDC> objPERMITS_LOOK_UPDC = null;
            try
            {
                objConnection.Open(false);
                objPERMITS_LOOK_UPDC = objPERMITS_LOOK_UPDA.LoadAll(objConnection, getDescWithCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPERMITS_LOOK_UPDC;
        }


        public PERMIT_TYPEDC LoadByPrimaryKey(string PERMIT_NUMBER)
        {
            DBConnection objConnection = new DBConnection();
            PERMITSTYPEDA objPERMITS_LOOK_UPDA = new PERMITSTYPEDA();
            PERMIT_TYPEDC objPERMITS_LOOK_UPDC = null;
            try
            {
                objConnection.Open(false);
                objPERMITS_LOOK_UPDC = objPERMITS_LOOK_UPDA.LoadByPrimaryKey(objConnection, PERMIT_NUMBER);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objPERMITS_LOOK_UPDC;
        }
        public int Update(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            PERMITSTYPEDA objPERMITS_LOOK_UPDA = new PERMITSTYPEDA();
            try
            {
                objConnection.Open(true);
                updatedCount = objPERMITS_LOOK_UPDA.Update(objConnection, objPERMITS_LOOK_UPs);
                IsDirty = objPERMITS_LOOK_UPDA.IsDirty;
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
        public int Insert(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            PERMITSTYPEDA objPERMITS_LOOK_UPDA = new PERMITSTYPEDA();
            try
            {
                objConnection.Open(true);
                insertedCount = objPERMITS_LOOK_UPDA.Insert(objConnection, objPERMITS_LOOK_UPs);
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
        public int Delete(List<PERMIT_TYPEDC> objPERMITS_LOOK_UPs)
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            PERMITSTYPEDA objPERMITS_LOOK_UPDA = new PERMITSTYPEDA();
            try
            {
                objConnection.Open(true);
                deletedCount = objPERMITS_LOOK_UPDA.Delete(objConnection, objPERMITS_LOOK_UPs);
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
