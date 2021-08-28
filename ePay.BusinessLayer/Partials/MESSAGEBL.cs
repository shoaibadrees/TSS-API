using EPay.DataAccess;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net.Mime;
using System.Net;

namespace EPay.BusinessLayer
{
    public partial class MESSAGEBL
    {
        private string GetSMTPAddress()
        {
            string SMTPAddress = ConfigurationManager.AppSettings["SMTPAddress"];


            if (SMTPAddress != null)
                return SMTPAddress;
            else
                return "";

        }

        private string GetSMTPAdminEmail()
        {
            string SMTPEmail = ConfigurationManager.AppSettings["AdminEmail"];


            if (SMTPEmail != null)
                return SMTPEmail.Trim().ToLower();
            else
                return "";

        }
        private string GetSMTPAdminPassword()
        {
            string smtpPswd = ConfigurationManager.AppSettings["AdminPassword"];


            if (smtpPswd != null)
                return smtpPswd.Trim().ToLower();
            else
                return "";

        }
        public int ScheduleMeeting(MESSAGEDC objMessage)
        {
            int returnStatus = 1;
            string orginalContents = objMessage.CONTENTS;
            string msgBody = "<!DOCTYPE HTML><html><body><table>";
            msgBody += "<tr><td>" + objMessage.CONTENTS + "</td></tr>";
            msgBody += "<tr><td><b>Event:</b> " + ((!String.IsNullOrEmpty(objMessage.EVENT_NAME)) ? objMessage.EVENT_NAME : "") + "</td></tr>";
            msgBody += "<tr><td><b>RMAG:</b> " + ((!String.IsNullOrEmpty(objMessage.RMAG_NAMES))?objMessage.RMAG_NAMES.TrimEnd(',').Replace(",",", "):"") + "</td></tr>";
            msgBody += "<tr><td><b>Conference Call/Access Code:</b> " + objMessage.ACCESS_CODE + "</td></tr>";
            msgBody += "<tr><td><b>Purpose of Call:</b> " + objMessage.CALL_PURPOSE_TEXT + "</td></tr>";
            msgBody += "<tr><td><b>Date/Time of Call:</b> " + objMessage.TIME_ZONE_CALL_ON + "</td></tr>";
            if (!String.IsNullOrEmpty(objMessage.USER_INFO))
            {
                msgBody += objMessage.USER_INFO;
            }
            msgBody += "</table></body></html>";
            objMessage.CONTENTS = msgBody;
            returnStatus = SendSMTPEmail(objMessage);
            objMessage.CONTENTS = orginalContents;
            //returnStatus = UpdateDatabase(objMessage);
            return 1;
        }

        public int SendSMTPEmail(MESSAGEDC objMessage,Boolean isSystemGenerated = false)
        {
            int returnStatus = 1;
            MailMessage msg = new MailMessage();
            msg.Priority = System.Net.Mail.MailPriority.High;
            if (!String.IsNullOrEmpty(objMessage.FROM))
                msg.From = new MailAddress(objMessage.FROM);
            else
            {
                throw new Exception("Your message could not be sent.</br>Sender's email address is not provided. Please update your profile.");
            }
            msg.Subject = objMessage.SUBJECT;

            string[] strTempAddress = objMessage.RECIPIENTS.Split(new string[] { ",", ";" }, StringSplitOptions.RemoveEmptyEntries);
            for (int intAddressCounter = 0; intAddressCounter < strTempAddress.Length; intAddressCounter++)
            {
                //if(isSystemGenerated)
                //    msg.Bcc.Add(strTempAddress[intAddressCounter]);
                //else
                    msg.To.Add(strTempAddress[intAddressCounter]);
            }
               

            //msg.CC.Add(msg.From);

            AlternateView plainView = AlternateView.CreateAlternateViewFromString(objMessage.CONTENTS.Replace("null", ""), null, MediaTypeNames.Text.Html);
            msg.AlternateViews.Add(plainView);
            string smtpAddress = GetSMTPAddress();
            if (smtpAddress.Trim() != string.Empty)
            {
                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient(smtpAddress.Split(':')[0]);
                if (smtpAddress.Split(':').Length > 1 && smtpAddress.Split(':')[1].Trim() != string.Empty)
                    smtp.Port = Convert.ToInt32(smtpAddress.Split(':')[1]);
                else
                    smtp.Port = 25;
                smtp.UseDefaultCredentials = true;
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                //if (GetSMTPAdminEmail() != string.Empty && GetSMTPAdminPassword() != string.Empty)
                //    smtp.Credentials = new NetworkCredential(GetSMTPAdminEmail(), GetSMTPAdminPassword());
                try
                {
                   // smtp.EnableSsl = true;
                    smtp.Send(msg);
                   
                }
                catch (SmtpFailedRecipientsException smtpFailRecipientsExp)
                {
                    String errorMessage = String.Empty;
                    String failedRecipient = String.Empty;
                    for (int i = 0; i < smtpFailRecipientsExp.InnerExceptions.Length; i++)
                    {
                        if (smtpFailRecipientsExp.InnerExceptions[i].StatusCode != SmtpStatusCode.Ok)
                        {
                            //switch (smtpFailRecipientsExp.InnerExceptions[i].StatusCode)
                            //{
                            //    case SmtpStatusCode.TransactionFailed: errorMessage += ""; break;

                            //}
                            failedRecipient += smtpFailRecipientsExp.InnerExceptions[0].FailedRecipient + ",";
                        }
                    }
                    throw new Exception("Your message could not be sent to '" + failedRecipient.TrimEnd(','));
                }
                catch (System.Net.Mail.SmtpException smtpExp)
                {
                    if (smtpExp.StatusCode == SmtpStatusCode.TransactionFailed)
                    {
                        throw new Exception("Your message could not be sent.</br>Sender’s email address '" + objMessage.FROM + "' could not be verified. Please update your profile.");
                    }
                    else
                        throw new Exception("Your message could not be sent.</br>" + smtpExp.Message);
                }
                finally
                {
                    msg.Dispose();
                }
            }
            else
            {
                throw new Exception("Your message could not be sent.</br>SMTP address is not configured.");
            }
            return returnStatus;
        }
        //public int UpdateDatabase(MESSAGEDC objMessage)
        //{
        //    DBConnection objConnection = new DBConnection();
        //    return UpdateDatabase(objMessage, objConnection, true);
        //}
        //public int UpdateDatabase(MESSAGEDC objMessage, DBConnection objConnection, bool updateConnection = true)
        //{
        //    int returnStatus = 1;
        //    MESSAGEDA objMsgDA = new MESSAGEDA();
        //    try
        //    {
        //        if (updateConnection)
        //        objConnection.Open(true);

        //        #region MESSAGE
        //        List<MESSAGEDC> messages = new List<MESSAGEDC>();
        //        objMessage.CREATED_ON = DateTime.Now;
        //        messages.Add(objMessage);
        //        returnStatus = objMsgDA.Insert(objConnection, messages);
        //        #endregion

        //        #region MESSAGE_RMAGS
        //        if (objMessage.MESSAGE_RMAGS != null)
        //        {
        //            List<MESSAGES_RMAGDC> msgRmags = new List<MESSAGES_RMAGDC>();
        //            foreach (int rmagId in objMessage.MESSAGE_RMAGS)
        //            {
        //                MESSAGES_RMAGDC msgRmagObj = new MESSAGES_RMAGDC();
        //                msgRmagObj.MESSAGE_ID = objMessage.MESSAGE_ID;
        //                msgRmagObj.RMAG_ID = rmagId;
        //                msgRmags.Add(msgRmagObj);
        //            }
        //            if (msgRmags.Count > 0)
        //            {
        //                MESSAGES_RMAGDA msgRmagDA = new MESSAGES_RMAGDA();
        //                returnStatus = msgRmagDA.Insert(objConnection, msgRmags);
        //            }  
        //        }
        //        #endregion

        //        #region MESSAGE_COMPANIES
        //        if (objMessage.MESSAGE_COMPANIES != null)
        //        {
        //            List<MESSAGES_COMPANIEDC> msgCompanies = new List<MESSAGES_COMPANIEDC>();
        //            foreach (int companyId in objMessage.MESSAGE_COMPANIES)
        //            {
        //                MESSAGES_COMPANIEDC msgCompany = new MESSAGES_COMPANIEDC();
        //                msgCompany.MESSAGE_ID = objMessage.MESSAGE_ID;
        //                msgCompany.COMPANY_ID = companyId;

        //                msgCompanies.Add(msgCompany);
        //            }
        //            if (msgCompanies.Count > 0)
        //            {
        //                MESSAGES_COMPANIEDA msgCompanyDA = new MESSAGES_COMPANIEDA();
        //                returnStatus = msgCompanyDA.Insert(objConnection, msgCompanies);
        //            } 
        //        }
        //        #endregion
                
        //        if (updateConnection)
        //        objConnection.Commit();
        //    }
        //    catch (Exception ex)
        //    {
        //        if (updateConnection)
        //        objConnection.Rollback();
        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (updateConnection)
        //        objConnection.Close();
        //    }
        //    return returnStatus;
        //}
    }
}
