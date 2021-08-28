using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.DataAccess;
using System.Configuration;
using EPay.Common;

namespace EPay.BusinessLayer
{
    public partial class HYLAN_TASKBL
    {
        public List<HYLAN_TASKDC> LoadAll(int TASK_TITLE_ID)
        {
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = HylanTaskDAFactory.Create(TASK_TITLE_ID);
            List<HYLAN_TASKDC> HYLAN_TASKDC = null;
            try
            {
                objConnection.Open(false);
                HYLAN_TASKDC = HYLAN_TASKDA.LoadAll(objConnection, TASK_TITLE_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return HYLAN_TASKDC;
        }
        public HYLAN_TASKDC LoadByPrimaryKey(int TASK_TITLE_ID, int JOB_ID)
        {
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = HylanTaskDAFactory.Create(TASK_TITLE_ID);
            HYLAN_TASKDC HYLAN_TASKDC = null;
            try
            {
                objConnection.Open(false);
                HYLAN_TASKDC = HYLAN_TASKDA.LoadByPrimaryKey(objConnection, TASK_TITLE_ID, JOB_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return HYLAN_TASKDC;
        }
        public List<HYLAN_TASKDC> Update(List<HYLAN_TASKDC> hylanTaskDCList)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = null;
            try
            {
                objConnection.Open(true);
                foreach (HYLAN_TASKDC hylanTaskDC in hylanTaskDCList)
                {
                    HYLAN_TASKDA = HylanTaskDAFactory.Create(hylanTaskDC.TASK_TITLE_ID);
                    if (String.IsNullOrEmpty(hylanTaskDC.REQUIRED))
                        hylanTaskDC.REQUIRED = "N";
                    List<HYLAN_TASKDC> tempList = new List<HYLAN_TASKDC>();
                    tempList.Add(hylanTaskDC);
                    try
                    {
                        if (HYLAN_TASKDA.Update(objConnection, tempList) > 0)
                            updatedCount++;
                        else {
                            hylanTaskDC.POST_MESSAGEDC.Type = "ERROR";
                            hylanTaskDC.POST_MESSAGEDC.Message = "NOT_UPDATED";
                        }
                    }
                    catch (Exception exception) {
                        hylanTaskDC.POST_MESSAGEDC.Type = "CONCURRENCY_ERROR";
                        if (exception.Message.Contains("CONCURRENCY_ERROR"))
                        {
                            hylanTaskDC.POST_MESSAGEDC.Message = "CONCURRENCY_ERROR";
                        }
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "EXCEPTION";
                            hylanTaskDC.POST_MESSAGEDC.Message = exception.Message;
                            hylanTaskDC.POST_MESSAGEDC.StackTrace = exception.StackTrace;
                        }
                    }
                    
                }
                if(updatedCount == hylanTaskDCList.Count)
                    objConnection.Commit();
                else
                    objConnection.Rollback();
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
            return hylanTaskDCList;
        }
        public List<HYLAN_TASKDC> Insert(List<HYLAN_TASKDC> hylanTaskDCList)
        {
            int insertedCount = 0;
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = null;
            try
            {
                objConnection.Open(true);
                foreach (HYLAN_TASKDC hylanTaskDC in hylanTaskDCList)
                {
                    HYLAN_TASKDA = HylanTaskDAFactory.Create(hylanTaskDC.TASK_TITLE_ID);
                    if (String.IsNullOrEmpty(hylanTaskDC.REQUIRED))
                        hylanTaskDC.REQUIRED = "N";
                    List<HYLAN_TASKDC> tempList = new List<HYLAN_TASKDC>();
                    tempList.Add(hylanTaskDC);
                    try
                    {
                        if (HYLAN_TASKDA.Insert(objConnection, tempList) > 0)
                            insertedCount++;
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "ERROR";
                            hylanTaskDC.POST_MESSAGEDC.Message = "NOT_ADDED";
                        }
                    }
                    catch (Exception exception)
                    {
                        hylanTaskDC.POST_MESSAGEDC.Type = "EXCEPTION";
                        hylanTaskDC.POST_MESSAGEDC.Message = exception.Message;
                        hylanTaskDC.POST_MESSAGEDC.StackTrace = exception.StackTrace;
                    }
                }
                if (insertedCount == hylanTaskDCList.Count)
                    objConnection.Commit();
                else
                    objConnection.Rollback();
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
            return hylanTaskDCList;
        }

        public List<List<HYLAN_TASKDC>> InsertUpdateTasks(List<List<HYLAN_TASKDC>> postData)
        {
            int insertedCount = 0;
            int updatedCount = 0;
            List<HYLAN_TASKDC> insertList = new List<HYLAN_TASKDC>();
            List<HYLAN_TASKDC> updateList = new List<HYLAN_TASKDC>();
            if (postData != null && postData.Count == 2)
            {
                insertList = postData[0];
                updateList = postData[1];
            }
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = null;
            try
            {
                objConnection.Open(true);

                #region Insert
                foreach (HYLAN_TASKDC hylanTaskDC in insertList)
                {
                    HYLAN_TASKDA = HylanTaskDAFactory.Create(hylanTaskDC.TASK_TITLE_ID);
                    if (String.IsNullOrEmpty(hylanTaskDC.REQUIRED))
                        hylanTaskDC.REQUIRED = "N";
                    List<HYLAN_TASKDC> tempList = new List<HYLAN_TASKDC>();
                    tempList.Add(hylanTaskDC);
                    try
                    {
                        if (HYLAN_TASKDA.Insert(objConnection, tempList) > 0)
                            insertedCount++;
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "ERROR";
                            hylanTaskDC.POST_MESSAGEDC.Message = "NOT_ADDED";
                        }
                    }
                    catch (Exception exception)
                    {
                        if (exception.Message.Contains("UNIQUE KEY"))
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "CONCURRENCY_ERROR";
                            hylanTaskDC.POST_MESSAGEDC.Message = "CONCURRENCY_ERROR";
                        }
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "EXCEPTION";
                            hylanTaskDC.POST_MESSAGEDC.Message = exception.Message;
                            hylanTaskDC.POST_MESSAGEDC.StackTrace = exception.StackTrace;
                        }
                    }
                }
                #endregion

                #region Update
                foreach (HYLAN_TASKDC hylanTaskDC in updateList)
                {
                    HYLAN_TASKDA = HylanTaskDAFactory.Create(hylanTaskDC.TASK_TITLE_ID);
                    if (String.IsNullOrEmpty(hylanTaskDC.REQUIRED))
                        hylanTaskDC.REQUIRED = "N";
                    List<HYLAN_TASKDC> tempList = new List<HYLAN_TASKDC>();
                    tempList.Add(hylanTaskDC);
                    try
                    {
                        if (HYLAN_TASKDA.Update(objConnection, tempList) > 0)
                            updatedCount++;
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "ERROR";
                            hylanTaskDC.POST_MESSAGEDC.Message = "NOT_UPDATED";
                        }
                    }
                    catch (Exception exception)
                    {
                        hylanTaskDC.POST_MESSAGEDC.Type = "CONCURRENCY_ERROR";
                        if (exception.Message.Contains("CONCURRENCY_ERROR"))
                        {
                            hylanTaskDC.POST_MESSAGEDC.Message = "CONCURRENCY_ERROR";
                        }
                        else
                        {
                            hylanTaskDC.POST_MESSAGEDC.Type = "EXCEPTION";
                            hylanTaskDC.POST_MESSAGEDC.Message = exception.Message;
                            hylanTaskDC.POST_MESSAGEDC.StackTrace = exception.StackTrace;
                        }
                    }

                }
                #endregion

                if (insertedCount == insertList.Count && updatedCount == updateList.Count)
                    objConnection.Commit();
                else
                    objConnection.Rollback();
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
            return postData;
        }


        public int Delete(int TASK_TITLE_ID, List<HYLAN_TASKDC> hylanTaskDCList)
        {
            int deletedCount = 0;
            DBConnection objConnection = new DBConnection();
            HYLAN_TASKDA HYLAN_TASKDA = HylanTaskDAFactory.Create(TASK_TITLE_ID);
            try
            {
                objConnection.Open(true);
                deletedCount = HYLAN_TASKDA.Delete(objConnection, hylanTaskDCList);
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
