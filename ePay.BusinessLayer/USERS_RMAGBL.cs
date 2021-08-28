
// Auto Generated by Tool Version # (1.3.0.3)
// Macrosoft Inc on: 3/20/2015 7:25:12 PM
// Last Updated on: 

using System;
using System.Collections.Generic;
using NMART.DataClasses;
using NMART.DataAccess;

namespace NMART.BusinessLayer
{		
	public class USERS_RMAGBL
	{
		public bool IsDirty { get; set; }
		
		public List<USERS_RMAGDC>  LoadAll()
		{
			DBConnection objConnection = new DBConnection();
			USERS_RMAGDA objUSERS_RMAGDA = new USERS_RMAGDA();
			List<USERS_RMAGDC>  objUSERS_RMAGDC = null;
            try
            {
				objConnection.Open(false);
				objUSERS_RMAGDC = objUSERS_RMAGDA.LoadAll(objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }   
			finally 
            {
                objConnection.Close();
            }
            return objUSERS_RMAGDC;
		}
		
		
		public USERS_RMAGDC LoadByPrimaryKey(int USER_RMAG_ID)
		{
			DBConnection objConnection = new DBConnection();
			USERS_RMAGDA objUSERS_RMAGDA = new USERS_RMAGDA();
			USERS_RMAGDC objUSERS_RMAGDC = null;
            try
            {
				objConnection.Open(false);
				objUSERS_RMAGDC = objUSERS_RMAGDA.LoadByPrimaryKey(objConnection, USER_RMAG_ID);                
            }
            catch (Exception ex)
            {
                throw ex;
            }   
			finally 
            {
                objConnection.Close();
            }
            return objUSERS_RMAGDC;
		}
		public int Update(List<USERS_RMAGDC> objUSERS_RMAGs)        
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERS_RMAGDA objUSERS_RMAGDA = new USERS_RMAGDA();
            try
            {
                objConnection.Open(true);
                updatedCount = objUSERS_RMAGDA.Update(objConnection, objUSERS_RMAGs);
                IsDirty = objUSERS_RMAGDA.IsDirty;
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
		public int Insert(List<USERS_RMAGDC> objUSERS_RMAGs)        
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERS_RMAGDA objUSERS_RMAGDA = new USERS_RMAGDA();
            try
            {
                objConnection.Open(true);
                insertedCount = objUSERS_RMAGDA.Insert(objConnection, objUSERS_RMAGs);
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
		public int Delete(List<USERS_RMAGDC> objUSERS_RMAGs)        
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERS_RMAGDA objUSERS_RMAGDA = new USERS_RMAGDA();
            try
            {
                objConnection.Open(true);
                deletedCount = objUSERS_RMAGDA.Delete(objConnection, objUSERS_RMAGs);
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
