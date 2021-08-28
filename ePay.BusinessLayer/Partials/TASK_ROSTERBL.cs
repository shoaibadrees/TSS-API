using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;


namespace EPay.BusinessLayer
{		
	public partial class TASK_ROSTERBL
    {

        public List<TASK_ROSTERDC> LoadAll(string projectIDs)
		{
			DBConnection objConnection = new DBConnection();
			TASK_ROSTERDA objTaskRosterDA = new TASK_ROSTERDA();
			List<TASK_ROSTERDC>  objTaskRosterDC = null;
            try
            {
				objConnection.Open(false);
                objTaskRosterDC = objTaskRosterDA.LoadAll(projectIDs, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }   
			finally 
            {
                objConnection.Close();
            }
            return objTaskRosterDC;
		}   
										
	}
}
