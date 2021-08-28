using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EPay.BusinessLayer;
using EPay.DataClasses;
using EPay.DataAccess;
using EPay.Common;
using System.Web.Http.Results;
using System.Web.Http.Description;
using System.Web.Security;
using System.Configuration;

namespace EPay.API.Controllers
{
    public class UserController : ApiController
    {


        // POST api/values
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult UpdateUserLoginStatus(string username, string loginstatus)
        {
            USERBL objUser = new USERBL();
            try
            {
                int IsUpdated = objUser.UpdateUserLoginStatus(username, loginstatus);
            return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<USERDC>))]

        public IHttpActionResult LoggedUsers()
        {
            USERBL objUser = new USERBL();
            List<USERDC> objResultList = new List<USERDC>();
            try
            {
                objResultList = objUser.LoggedUsers();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }


        // GET api/values
        [Route("User/GetAll")]
        [Route("User/GetAll/{ROLE_NAME}")]
        [HttpGet]
        [ResponseType(typeof(List<USERDC>))]

        public IHttpActionResult GetAll(string ROLE_NAME = null)
        {
            USERBL objUser = new USERBL();
            List<USERDC> objResultList = new List<USERDC>();
            try
            {
                objResultList = objUser.LoadAll(ROLE_NAME);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }


        // GET api/values
        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            USERBL objUser = new USERBL();
            USERDC objResult = new USERDC();
            try
            {
                objResult = objUser.LoadByPrimaryKey(id);
                return Ok(new { objResult });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        [HttpGet]
        [ResponseType(typeof(USERDC))]
        public IHttpActionResult AuthenticateUser(string username, string password)
        {
            USERBL objUser = new USERBL();
            USERDC objResult = new USERDC();
            //try
            //{
                objResult = objUser.AuthenticateUser(username, password);
                CheckLoginAttempts(username, objResult);
                return Ok(new { objResult });
            //}
            //catch (Exception ex)
            //{
            //   return new TextResult(ex.Message, Request,ex.StackTrace);
            //}
        }

        private void CheckLoginAttempts(string username, USERDC objResult)
        {
            USERBL objUserHandler = new USERBL();
            Int32 allowedLoginAttempt = ConfigurationManager.AppSettings.Get("FailedLoginAttempts") == "" ? 6 : Convert.ToInt32(ConfigurationManager.AppSettings.Get("FailedLoginAttempts"));
            Int32 currentLoginAttempt = 0;

            List<KeyValuePair<string, Int32>> users = (List<KeyValuePair<string, Int32>>)System.Web.HttpContext.Current.Application["LoginAttempts"];
            KeyValuePair<string, Int32> currentUser = users.Find(item => item.Key == username);
            if (currentUser.Key == null || currentUser.Key == "")
                users.Add(new KeyValuePair<string, int>(username, currentLoginAttempt));
            else
                currentLoginAttempt = currentUser.Value;

            if (objResult != null && objResult.USER_ID > 0)
                currentLoginAttempt = 0;
            else
                currentLoginAttempt += 1;

            objResult.ALLOWED_LOGIN_ATTEMPTS = allowedLoginAttempt;
            objResult.FAILED_LOGIN_ATTEMPTS = currentLoginAttempt;
            if (currentLoginAttempt >= allowedLoginAttempt)
            {
                Int32 updatedRows = objUserHandler.UpdateUserLoginStatus(username, "N");
                if (updatedRows > 0)
                {
                    currentLoginAttempt = 0;
                    objResult.FAILED_LOGIN_ATTEMPT_MESSAGE = "Login credentials temporarily disabled due to " + objResult.ALLOWED_LOGIN_ATTEMPTS + " failed attempts. Contact your administrator for login.";
                }
            }

            users.Remove(users.Find(item => item.Key == username));
            users.Add(new KeyValuePair<string, int>(username, currentLoginAttempt));
        }

        // POST api/values
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult Update(List<USERDC> objUsers)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            USERBL objUser = new USERBL();
            try
            {
                int IsUpdated = objUser.Update(objUsers, ref lstException);
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);
            }
        }
        

        // POST api/values
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult UpdateUser([FromBody]USERDC objUser)
        {
            USERBL objUserBL = new USERBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                #region User Profile Checks
                if (!String.IsNullOrEmpty(objUser.NEW_PSWD))
                {
                    String errorMessage = String.Empty;
                    if (Encryptor.Encrypt(objUser.OLD_PSWD) != objUser.PASSWORD)
                    {
                        errorMessage += "Incorrect old password.</br>";
                    }
                    if (Encryptor.Encrypt(objUser.NEW_PSWD) == objUser.PASSWORD)
                    {
                        errorMessage += "New password should be different than the last password.</br>";
                    }
                    int minPswdLength = -1;
                    Int32.TryParse(ConfigurationManager.AppSettings["MinPasswordLength"], out minPswdLength);
                    if (minPswdLength != -1 && objUser.NEW_PSWD.Length < minPswdLength)
                    {
                        errorMessage += "Password should be minimun of " + minPswdLength + " chracters.</br>";
                    }
                    if (!String.IsNullOrEmpty(errorMessage))
                        return new TextResult(errorMessage, Request,"User Profile Custom Error");

                    objUser.PASSWORD = Encryptor.Encrypt(objUser.NEW_PSWD);
                }
                #endregion
                List<USERDC> objUsers = new List<USERDC>();
                objUsers.Add(objUser);
                int IsUpdated = objUserBL.Update(objUsers, ref lstException);
                return Ok(new { IsUpdated });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<USERDC> objUsers)
        {
            USERBL objUser = new USERBL();
            try
            {
                int IsInserted = objUser.Insert(objUsers);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
                throw ex;
                // return InternalServerError(ex);
                //HttpResponseMessage message = new HttpResponseMessage(HttpStatusCode.NotImplemented);
                // message.Content = new StringContent(ex.Message);
                //return new TextResult(ex.Message, Request);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<USERDC> objUsers)
        {
            USERBL objUser = new USERBL();
            try
            {
                int IsDeleted = objUser.Delete(objUsers);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }

        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult ResetPassword(string selectedUserIds, int currentUserId)
        {
            USERBL objUserBL = new USERBL();
            try
            {
                int IsUpdated = objUserBL.ResetPassword(selectedUserIds, currentUserId);
                return Ok(new { IsUpdated });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

        [HttpGet]
        [ResponseType(typeof(List<string>))]
        public IHttpActionResult GetUsersEmailAddressByCompanyId(string companyIds)
        {
            USERBL objUser = new USERBL();
            List<string> objResult = new List<string>();
            try
            {
                objResult = objUser.GetUsersEmailAddressByCompanyId(companyIds);
                return Ok(new { objResult });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        [HttpGet]
        [ResponseType(typeof(List<USERDC>))]
        public IHttpActionResult GetUsersByUsername(string username)
        {
            USERBL objUser = new USERBL();
            List<USERDC> objResultList = new List<USERDC>();
            try
            {
                objResultList = objUser.GetUsersByUsername(username);
                return Ok(new { objResultList });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult EmailResetPassword(string selectedUserIds, int currentUserId, string username, string emailId, bool isFromManageUsers = false)
        {
            USERBL objUserBL = new USERBL();
            try
            {
                int IsUpdated = objUserBL.EmailResetPassword(selectedUserIds, currentUserId, username, emailId, isFromManageUsers);
                return Ok(new { IsUpdated });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
    }
}
