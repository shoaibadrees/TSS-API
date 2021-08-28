using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;


namespace EPay.BusinessLayer
{
    public partial class TASK_MATRIXBL
    {

        public List<TASK_MATRIXDC> TaskMatrixLoadAll(string projectIDs, string jfnIDs, string jobStatusIDS, string taskStatusIDs, string tmDate)
        {
            DBConnection objConnection = new DBConnection();
            TASK_MATRIXDA objTaskMatrixDA = new TASK_MATRIXDA();
            List<TASK_MATRIXDC> objTaskMatrixDC = null;
            try
            {
                objConnection.Open(false);
                objTaskMatrixDC = objTaskMatrixDA.TaskMatrixLoadAll(projectIDs, jfnIDs, jobStatusIDS, taskStatusIDs, tmDate, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objTaskMatrixDC;
        }
        public List<TASK_MATRIXDC> TaskOnHoldLoadAll(string projectIDs, string jfnIDs, string jobStatusIDS, string taskNames, string tmDate)
        {
            DBConnection objConnection = new DBConnection();
            TASK_MATRIXDA objTaskMatrixDA = new TASK_MATRIXDA();
            List<TASK_MATRIXDC> objTaskMatrixDC = null;
            try
            {
                objConnection.Open(false);
                objTaskMatrixDC = objTaskMatrixDA.TaskOnHoldLoadAll(projectIDs, jfnIDs, jobStatusIDS, taskNames, tmDate, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objTaskMatrixDC;
        }

    }
}
