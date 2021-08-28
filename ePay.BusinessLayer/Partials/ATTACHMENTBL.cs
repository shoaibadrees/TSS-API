using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using EPay.DataAccess;
using EPay.DataClasses;
using NMART.BusinessLayer;
using NMART.DataClasses;

namespace EPay.BusinessLayer
{
    public partial class ATTACHMENTBL
    {

        public List<ATTACHMENTDC> LoadByProjectId(int PROJECT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadByProjectId(objConnection, PROJECT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public ATTACHMENTDC LoadSingleByProjectId(int PROJECT_ID, int ATTACHMENT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            ATTACHMENTDC objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadSingleByProjectId(objConnection, PROJECT_ID, ATTACHMENT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadByJobId(int JOB_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadByJobId(objConnection, JOB_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public ATTACHMENTDC LoadSingleByJobId(int JOB_ID, int ATTACHMENT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            ATTACHMENTDC objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadSingleByJobId(objConnection, JOB_ID, ATTACHMENT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadByPermitId(int PERMIT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadByPermitId(objConnection, PERMIT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadByDailyId(int DAILY_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadByDailyId(objConnection, DAILY_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public ATTACHMENTDC LoadSingleByPermitId(int PERMIT_ID, int ATTACHMENT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            ATTACHMENTDC objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadSingleByPermitId(objConnection, PERMIT_ID, ATTACHMENT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public ATTACHMENTDC LoadSingleByDailyId(int DAILY_ID, int ATTACHMENT_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            ATTACHMENTDC objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadSingleByDailyId(objConnection, DAILY_ID, ATTACHMENT_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }
        public List<DOCUMENTCATEGORYDC> LoaddocumentCategories(int CATEGORY_ID)
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<DOCUMENTCATEGORYDC> objDOCUMENTCATEGORYDC = null;
            try
            {
                objConnection.Open(false);
                objDOCUMENTCATEGORYDC = objATTACHMENTDA.LoaddocumentCategories(objConnection, CATEGORY_ID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objDOCUMENTCATEGORYDC;
        }
        public List<ATTACHMENTDC> LoadAllProjectAttachments(string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadAllProjectAttachments(objConnection, projectIDs, attachmentTypeIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadAllJobAttachments(string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadAllJobAttachments(objConnection, projectIDs, attachmentTypeIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadAllPermitAttachments(string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadAllPermitAttachments(objConnection, projectIDs, attachmentTypeIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public List<ATTACHMENTDC> LoadAllDailyAttachments(string projectIDs = "All", string attachmentTypeIDs = "All")
        {
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            List<ATTACHMENTDC> objATTACHMENTDC = null;
            try
            {
                objConnection.Open(false);
                objATTACHMENTDC = objATTACHMENTDA.LoadAllDailyAttachments(objConnection, projectIDs, attachmentTypeIDs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objATTACHMENTDC;
        }

        public bool CreateDirectory(string path)
        {
            if (Directory.Exists(path))
                return false;

            Directory.CreateDirectory(path);
            return true;
        }

        public List<ATTACHMENTDC> GetAttachmentListBasedOnType(string entityType, int recordId)
        {
            ATTACHMENTBL objAttachment = new ATTACHMENTBL();
            List<ATTACHMENTDC> objResultList = new List<ATTACHMENTDC>();
            if (entityType != "" && recordId > 0)
            {
                if (entityType == "JOB")
                    objResultList = objAttachment.LoadByJobId(recordId);
                else if (entityType == "PROJECT")
                    objResultList = objAttachment.LoadByProjectId(recordId);
                else if(entityType == "PERMIT")
                    objResultList = objAttachment.LoadByPermitId(recordId);
                else if(entityType =="DAILY")
                    objResultList = objAttachment.LoadByDailyId(recordId);
            }
            return objResultList;
        }

        public ATTACHMENTDC GetLastInsertedAttachment(string entityType, int parentId, int recordId)
        {
            ATTACHMENTBL objAttachment = new ATTACHMENTBL();
            ATTACHMENTDC objResult = new ATTACHMENTDC();
            if (entityType != "" && recordId > 0)
            {
                if (entityType == "JOB")
                    objResult = objAttachment.LoadSingleByJobId(parentId, recordId);
                else if (entityType == "PROJECT")
                    objResult = objAttachment.LoadSingleByProjectId(parentId, recordId);
                else if (entityType == "PERMIT")
                    objResult = objAttachment.LoadSingleByPermitId(parentId, recordId);
                else if (entityType == "Daily")
                    objResult = objAttachment.LoadSingleByDailyId(parentId, recordId);
            }
            return objResult;
        }

        private string TransformFileSize(string sizeInBytesString)
        {
            float sizeInBytes = Convert.ToInt64(sizeInBytesString);
            return sizeInBytes == 0 ? "0 KB" : Math.Round(sizeInBytes / 1024) > 1024 ? Math.Round(Math.Round(sizeInBytes / 1024) / 1024).ToString(CultureInfo.InvariantCulture) + " MB" : (Math.Round(sizeInBytes / 1024)).ToString(CultureInfo.InvariantCulture) + " KB";
        }

        public List<ATTACHMENTDC> Insert(List<ATTACHMENTDC> objATTACHMENTs)
        {
            List<ATTACHMENTDC> attachmentsList = new List<ATTACHMENTDC>();
            DBConnection objConnection = new DBConnection();
            ATTACHMENTDA objATTACHMENTDA = new ATTACHMENTDA();
            try
            {
                var attachments = SetNecessaryFields(objATTACHMENTs);
                objConnection.Open(true);
                attachmentsList = objATTACHMENTDA.Insert(objConnection, attachments);
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
            return attachmentsList;
        }
        public List<ATTACHMENTDC> SetNecessaryFields(List<ATTACHMENTDC> objATTACHMENTs)
        {
            foreach (var objAttachment in objATTACHMENTs)
            {
                objAttachment.CREATED_ON = DateTime.Now;
                objAttachment.MODIFIED_ON = DateTime.Now; 
                objAttachment.UPDATED_FILE_NAME = objAttachment.FILE_NAME.Replace("'", "");
                objAttachment.FILE_SIZE = TransformFileSize(objAttachment.FILE_SIZE);
            }
            return objATTACHMENTs;
        }

        public void CopyFileToAttachmentDirectory(List<ATTACHMENTDC> attachmentsDC, string baseFolder)
        {
            try
            {
                foreach (var attachment in attachmentsDC)
                {
                    if (attachment.ATTACHMENT_ID != -111)
                    {
                        string targetPath = "";
                        if (attachment.ENTITY_TYPE == "DAILY")
                        {
                            //targetPath = baseFolder + @"\Project\" + attachment.PROJECT_ID + @"\Jobs\" +
                            //             attachment.JOB_ID + @"\DAILY\" +
                            //             attachment.PARENT_ID;
                            targetPath = baseFolder +  @"\DAILY\" + attachment.PARENT_ID;
                        }
                        if (attachment.ENTITY_TYPE == "PERMIT")
                        {
                            //targetPath = baseFolder + @"\Project\" + attachment.PROJECT_ID + @"\Jobs\" +
                            //             attachment.JOB_ID + @"\Permits\" +
                            //             attachment.PARENT_ID;
                            targetPath = baseFolder + @"\Permits\" + attachment.PARENT_ID;
                        }
                        if (attachment.ENTITY_TYPE == "JOB")
                        {
                            targetPath = baseFolder + @"\Project\" + attachment.PROJECT_ID + @"\Jobs\" +
                                         attachment.PARENT_ID;
                        }
                        else if (attachment.ENTITY_TYPE == "PROJECT")
                        {
                            targetPath = baseFolder + @"\Project\" + attachment.PARENT_ID;
                        }
                        if (!File.Exists(targetPath))
                        {
                            Directory.CreateDirectory(targetPath);
                        }

                        File.Copy(Path.Combine(baseFolder, attachment.FILE_NAME),
                            Path.Combine(targetPath, attachment.UPDATED_FILE_NAME), true);
                        File.Delete(Path.Combine(baseFolder, attachment.FILE_NAME));
                    }
                }
            }
            catch (Exception ex)
            {
                //Logging.LogExceptionInFile(ex.Message, ex.Source, "", ex.StackTrace);
                throw ex;
            }
        }
    }
}
