using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Hylan.Web.Models;
using System.Web.Security;
using EPay.Common;
using System.Net.Http;
using EPay.DataClasses;
using EPay.BusinessLayer;
using System.Collections;
using Microsoft.AspNet.SignalR;

namespace Hylan.Web.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Login()
        {
            return View();
        }
        /****** **************************************/
        [HttpGet]
        [AllowAnonymous]
        public int SetAuthenticationTicket(string username, string companies, string email, DateTime? logindate = null)
        {
            int authStatus = 0;
            try
            {

                string CompanyNames = "No Company Associated";
                string separator = "_-_-_";
                System.Web.HttpContext context = System.Web.HttpContext.Current;
                FormsAuthentication.SetAuthCookie(username, false);

                if (!string.IsNullOrEmpty(username))
                {
                    if (!string.IsNullOrEmpty(companies))
                    {
                        COMPANIEBL CompanyHandler = new COMPANIEBL();
                        CompanyNames = CompanyHandler.CompanyNameString(companies);
                    }

                    context.Session.Add("CurrentUserSessions", username);

                    string useragent = " - Windows";
                    if (context.Request.UserAgent.Contains("Android"))
                        useragent = " - Android";
                    else if (context.Request.UserAgent.Contains("iPad"))
                        useragent = " - iPad";
                    else if (context.Request.UserAgent.Contains("iPhone"))
                        useragent = " - iPhone";
                    KeyValuePair<string, string> user = new KeyValuePair<string, string>(username, CompanyNames + separator + email + separator + DateTime.Now + separator + context.Request.Browser.Browser + useragent);
                    List<KeyValuePair<string, string>> users = (List<KeyValuePair<string, string>>)context.Application["LoggedInUsers"];

                    ////string logItem = "\r\nList count::" + users.Count.ToString();
                    ////logItem += "\r\nUser Name:: " + (user.Key);
                    ////logItem += "\r\nUser Key:: " + (user.Value);
                    var list = new List<KeyValuePair<string, string>>();
                    list = users;

                    string checkKey = username;
                    if (list.Contains(new KeyValuePair<string, string>(checkKey, string.Empty), new KeyComparer()))
                    {
                        KeyValuePair<string, string> item = list.Find((lItem) => lItem.Key.Equals(checkKey));
                        string exstBrows = item.Value.Split(new string[] { separator }, StringSplitOptions.RemoveEmptyEntries)[3];
                        ////logItem += "\r\nExisting brow::" + exstBrows;
                        ////logItem += "\r\nComparing::" + (context.Request.Browser.Browser + useragent);
                        ////if ((context.Request.Browser.Browser + useragent) == exstBrows)
                        ////    authStatus = 1;
                        ////else
                        authStatus = 1;
                    }
                    else
                    {
                        users.Add(user);
                        context.Application.Set("LoggedInUsers", users);
                        authStatus = 1;
                    }
                    ////LogToFile(logItem);
                }
            }
            catch (Exception ex)
            {
                authStatus = 0;
            }
            return authStatus;
        }

        private void LogToFile(string text)
        {
            String logFile = System.Web.HttpContext.Current.Server.MapPath("~/ErrorLog-Authentication.txt");
            System.IO.FileStream file = new System.IO.FileStream(logFile, System.IO.FileMode.Append);
            System.IO.StreamWriter sw = new System.IO.StreamWriter(file);
            sw.WriteLine("DateTime: " + DateTime.Now.ToString());
            sw.WriteLine(text);
            sw.WriteLine("--------------------------------------------------");
            sw.Close();
            file.Close();
        }

        [HttpGet]
        [AllowAnonymous]
        public string LoggedUsers()
        {
            try
            {
                List<KeyValuePair<string, string>> users = (List<KeyValuePair<string, string>>)System.Web.HttpContext.Current.Application["LoggedInUsers"];
                var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                return serializer.Serialize(users);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public bool Logout(string username)
        {
            try
            {
                //System.Web.HttpContext.Current.Session.Add("CurrentUserSessions", username);
                //string user = FormsAuthentication.GetAuthCookie(userName, false);
                //string user = System.Web.HttpContext.Current.Session["CurrentUserSessions"].ToString();
                List<KeyValuePair<string, string>> users = (List<KeyValuePair<string, string>>)System.Web.HttpContext.Current.Application["LoggedInUsers"];
                var list = new List<KeyValuePair<string, string>>();
                list = users;
                string checkKey = username;
                if (list.Contains(new KeyValuePair<string, string>(checkKey, string.Empty), new KeyComparer()))
                {
                    KeyValuePair<string, string> item = list.Find((lItem) => lItem.Key.Equals(checkKey));
                    list.Remove(item);
                    users = list;
                }

                System.Web.HttpContext.Current.Application.Set("LoggedInUsers", users);
                System.Web.HttpContext.Current.Request.Cookies.Clear();
                
                IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<LoggedUserHub>();
                hubContext.Clients.All.broadcastMessage();

                FormsAuthentication.SignOut();
                return true;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}