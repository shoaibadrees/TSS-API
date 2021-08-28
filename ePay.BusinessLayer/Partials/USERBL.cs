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
    public partial class USERBL
    {
        private string GetSMTPAdminEmail()
        {
            string SMTPEmail = ConfigurationManager.AppSettings["AdminEmail"];


            if (SMTPEmail != null)
                return SMTPEmail.Trim().ToLower();
            else
                return "";

        }

        public List<USERDC> GetUsersForExport(string USER_IDs)
        {
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            List<USERDC> objUSERDC = null;
            try
            {
                objConnection.Open(false);
                if (!string.IsNullOrEmpty(USER_IDs) && USER_IDs.Length > 0)
                {
                    objUSERDC = objUSERDA.GetUsersForExport(USER_IDs, objConnection);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objUSERDC;
        }

        public List<USERDC> LoadAll(string roleName = null)
        {
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            List<USERDC> objUSERDC = null;
            try
            {
                objConnection.Open(false);
                objUSERDC = objUSERDA.LoadAll(roleName, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objUSERDC;
        }

        public int UpdateUser(USERDC objUser)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            try
            {
                objConnection.Open(true);
                updatedCount = objUSERDA.UpdateUser(objConnection, objUser);
                IsDirty = objUSERDA.IsDirty;
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

        public int Update(List<USERDC> objUSERs, ref List<EXCEPTIONDC> lstExceptions)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();

            try
            {

                foreach (USERDC objUSER in objUSERs)
                {
                    objConnection.Open(true);
                    try
                    {
                        objUSER.MODIFIED_ON = DateTime.Now;
                        updatedCount = objUSERDA.Update(objConnection, objUSER);
                        if (objUSERDA.IsDirty)
                            break;

                        ///  Email sent an Match Complete
                        int EmailSent = 0;
                        MESSAGEDC objMsgDC = new MESSAGEDC();
                        MESSAGEBL objMsgBL = new MESSAGEBL();
                        List<string> lstUserEmails = new List<string>();
                        USERDA objUser = new USERDA();
                        USERDC objUserDC = new USERDC();

                        objUserDC = objUser.LoadByPrimaryKey(objConnection, objUSER.USER_ID);

                       // lstUserEmails = objUser.GetUsersEmailAddressByEventId(objUSER.USER_ID, "", 62, objConnection);

                        //if (lstUserEmails.Count > 0)
                        //{
                            Task.Run(() =>
                        {
                            //if (!lstUserEmails.Contains(objUSER.EMAIL_ADDRESS))
                            //    lstUserEmails.Add(objUSER.EMAIL_ADDRESS);
                            StringBuilder strContents = new StringBuilder();
                            strContents.Append("<!DOCTYPE HTML><html><body><table>");
                            strContents.Append("<tr><td>Profile for user  <b>" + objUSER.USER_NAME + "</b>. has been updated.");
                            strContents.Append("<tr><td>Please log into the system to verify changes.");
                            strContents.Append("</table></body></html>");
                            try
                            {
                                objMsgDC.FROM = GetSMTPAdminEmail();
                                objMsgDC.SUBJECT = "Your profile is changed.";
                                objMsgDC.CONTENTS = strContents.ToString();
                                objMsgDC.RECIPIENTS = String.Join(";", objUserDC.EMAIL_ADDRESS);
                                EmailSent = objMsgBL.SendSMTPEmail(objMsgDC, true);
                            }
                            catch (Exception exp)
                            {
                                EPay.DataAccess.Utilities.InsertIntoErrorLog("Error: USER PROFILE CHANGED NOTIFICATION EMAIL ", exp.Message + "\r\n" + exp.StackTrace, objUSER.MODIFIED_BY);
                            }
                        });
                       // }
                        objConnection.Commit();
                    }
                    catch (Exception exp)
                    {
                        EXCEPTIONDC objExcption = new EXCEPTIONDC();
                        objExcption.FIELD_ID = objUSER.USER_ID;
                        objExcption.EXCEPTION_MESSAGE = exp.Message;
                        objExcption.STACK_TRACK = exp.StackTrace;
                        lstExceptions.Add(objExcption);
                        objConnection.Rollback();
                       // throw exp;
                    }
                   
                }
                if (lstExceptions.Count > 0)
                    throw new Exception(lstExceptions[0].EXCEPTION_MESSAGE);

            }
            catch(Exception exp)
            {
                throw exp;
            }
            finally
            {
                objConnection.Close();
            }

            return updatedCount;
        }

        public int Insert(List<USERDC> objUSERs)
        {
            int insertedCount = 0;
            bool IsDirty = false;
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            try
            {
                objConnection.Open(true);
                foreach (USERDC objUSER in objUSERs)
                {
                    objUSER.CREATED_ON = objUSER.MODIFIED_ON = DateTime.Now;
                    objUSER.PASSWORD = Utility.GenerateRandomPassword(8);
                    insertedCount = objUSERDA.Insert(objConnection, objUSER);
                    if (objUSER.USER_ID == -111)
                    {
                        throw new Exception("User Name '" + objUSER.USER_NAME + "' already exists. All other changes saved successfully.");

                    }

                    //IsDirty = objUSERDA.IsDirty;
                    //if (IsDirty == false)
                    //{
                    //    objUSERDA.UpdateUserCompanies(objConnection, objUSER);
                    //}
                    //else
                    //{
                    //    break;
                    //}

                    int EmailSent = 0;
                    MESSAGEDC objMsgDC = new MESSAGEDC();
                    MESSAGEBL objMsgBL = new MESSAGEBL();
                    USERDA objUser = new USERDA();
                    USERDC objUserDC = new USERDC();

                    objUserDC = objUser.LoadByPrimaryKey(objConnection, objUSER.USER_ID);
                    Task.Run(() =>
                   {
                    StringBuilder strContents = new StringBuilder();
                    strContents.Append("<!DOCTYPE HTML><html><body><table>");
                    strContents.Append("<tr><td>Your profile for Hylan has been created.</td></tr><tr><td></td></tr>");
                    strContents.Append("<tr><td>Following are your account credentials:</td></tr><tr><td></td></tr>");
                    strContents.Append("<tr><td><b>Username:</b> " + objUSER.USER_NAME + "</td></tr>");
                    strContents.Append("<tr><td><b>Password:</b> " + objUSER.PASSWORD + "</td></tr>");
                    strContents.Append("</table></body></html>");
                    try
                    {
                        objMsgDC.FROM = objUserDC.EMAIL_ADDRESS;
                        objMsgDC.SUBJECT = "Your profile is created.";
                        objMsgDC.CONTENTS = strContents.ToString();
                        objMsgDC.RECIPIENTS = objUSER.EMAIL_ADDRESS;
                        EmailSent = objMsgBL.SendSMTPEmail(objMsgDC,true);
                    }
                    catch (Exception exp)
                    {
                        EPay.DataAccess.Utilities.InsertIntoErrorLog("Error: USER PROFILE CREATED NOTIFICATION EMAIL ", exp.Message + "\r\n" + exp.StackTrace, objUSER.MODIFIED_BY);
                    }
                   });
                }
                if (IsDirty)
                {
                    objConnection.Rollback();
                }
                else
                {
                    objConnection.Commit();
                }
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

        public List<USERDC> LoggedUsers()
        {
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            List<USERDC> objUSERDC = null;
            try
            {
                objConnection.Open(false);
                objUSERDC = objUSERDA.LoggedUsers(objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objUSERDC;
        }

        public int UpdateUserLoginStatus(string UserName, string LoginStatus)
        {
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            int isUpdated = 0;
            try
            {
                objConnection.Open(false);
                isUpdated = objUSERDA.UpdateUserLoginStatus(UserName, LoginStatus, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return isUpdated;
        }



        public USERDC AuthenticateUser(string username, string password)
        {
            
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            USERDC objUSERDC = null;
            try
            {
                objConnection.Open(false);
                objUSERDC = objUSERDA.AuthenticateUser(objConnection, username, password);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return objUSERDC;
        }

        public int ResetPassword(string selectedUserIds, int currentUserId)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            string NewPassword = Utility.GenerateRandomPassword(8);
            try
            {
                objConnection.Open(true);
                updatedCount = objUSERDA.ResetPassword(objConnection, selectedUserIds, currentUserId, NewPassword);


                IsDirty = objUSERDA.IsDirty;
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

        public List<string> GetUsersEmailAddressByCompanyId(string companyIds)
        {
            DBConnection objConnection = new DBConnection();
            List<string> emailAddresses = new List<string>();
            try
            {
                objConnection.Open(false);
                USERDA objUserDA = new USERDA();
                emailAddresses = objUserDA.GetUsersEmailAddressByCompanyId(companyIds, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return emailAddresses;
        }

        public List<string> GetUsersEmailAddressByEventId(int eventid, String eventtype, int notificationtype)
        {
            DBConnection objConnection = new DBConnection();
            List<string> emailAddresses = new List<string>();
            try
            {
                objConnection.Open(false);
                USERDA objUserDA = new USERDA();
                emailAddresses = objUserDA.GetUsersEmailAddressByEventId(eventid,eventtype,notificationtype, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return emailAddresses;
        }

        public List<USERDC> GetUsersByUsername(string userName)
        {
            DBConnection objConnection = new DBConnection();
            List<USERDC> usersList = new List<USERDC>();
            try
            {
                objConnection.Open(false);
                USERDA objUserDA = new USERDA();
                usersList = objUserDA.GetUsersByUsername(userName, objConnection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                objConnection.Close();
            }
            return usersList;
        }
        public int EmailResetPassword(string selectedUserIds, int currentUserId, string username, string emailId, bool isFromManageUsers)
        {
            int updatedCount = 0;
            DBConnection objConnection = new DBConnection();
            USERDA objUSERDA = new USERDA();
            MESSAGEBL objMessageBL = new MESSAGEBL();
            string NewPassword = Utility.GenerateRandomPassword(8);
            try
            {
                string[] UserID = selectedUserIds.Split(',');
                string[] UserName = username.Split(',');
                string[] UserEmail = emailId.Split(',');
                objConnection.Open(true);
                updatedCount = objUSERDA.ResetPassword(objConnection, selectedUserIds, currentUserId, NewPassword);
                IsDirty = objUSERDA.IsDirty;
                if (!IsDirty)
                {
                    MESSAGEDC objMessage = new MESSAGEDC();
                    objMessage.FROM = ConfigurationManager.AppSettings["AdminEmail"];
                    if (String.IsNullOrEmpty(objMessage.FROM))
                    {
                        throw new Exception("Your password cannot be reset.</br>Administrator's email address is not configured. Please contact your administrator.");
                    }
                    if (String.IsNullOrEmpty(ConfigurationManager.AppSettings["SMTPAddress"]))
                    {
                        throw new Exception("Your password cannot be reset.</br>SMTP address is not configured.");
                    }
                    for (int i = 0; i < UserID.Length; i++)
                    {
                       
                       objMessage.SUBJECT = "Password Reset";
                        objMessage.RECIPIENTS = UserEmail[i];
                        string orginalContents = objMessage.CONTENTS;
                        string msgBody = "<!DOCTYPE HTML><html><body><table>";
                        if (!isFromManageUsers)
                        {
                            msgBody += "<tr><td>Your password has been reset upon your request.</td></tr><tr><td></td></tr><tr><td></td></tr>";
                        }
                        else
                        {
                            msgBody += "<tr><td>Your password has been changed as below</td></tr><tr><td></td></tr><tr><td></td></tr>";
                        }
                        msgBody += "<tr><td><b>Username:</b> " + UserName[i] + "</td></tr>";
                        msgBody += "<tr><td><b>New Password:</b> " + NewPassword + "</td></tr>";
                        msgBody += "</table></body></html>";
                        objMessage.CONTENTS = msgBody;
                        objMessage.CREATED_BY = currentUserId;

                        updatedCount = objMessageBL.SendSMTPEmail(objMessage);
                  
                        objMessage.CONTENTS = "Password has been reset for the user " + username;
                        //if (!isFromManageUsers)
                        //{
                        //    updatedCount = objMessageBL.UpdateDatabase(objMessage, objConnection, false);
                        //}
                    }
                }
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
    }
}
