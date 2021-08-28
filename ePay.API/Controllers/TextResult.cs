using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using EPay.Util;

namespace EPay.API.Controllers
{
    public class TextResult : IHttpActionResult
    {
        string _value;
        HttpRequestMessage _request;

        public TextResult(string value, HttpRequestMessage request,string StackTrack)
        {
            if (value.Contains("Role Name"))
            {
                _value = value + " $ " + "0";
            }
            else
            {
                _value = value;
            }
            _request = request;
            int UserID=Common.Utility.GetUserID(request);
            Utility.InsertIntoErrorLog(_value, StackTrack, UserID);
        }

        public TextResult(List<EXCEPTIONDC> lstException, HttpRequestMessage request, string messagePrefix = "",string messagePostFix = "", bool showErrorInBullets = false )
        {
            int Counter = 1;
            messagePrefix = messagePrefix != null ? messagePrefix : "";
            messagePostFix = messagePostFix != null ? " "+messagePostFix : "";

            string strExceptionMsgs = messagePrefix;
            string strFieldids = "";
            int UserID = 0;
            if (request != null)
            {
                UserID = Common.Utility.GetUserID(request);
            }
            else
            {
                UserID = EPay.Common.Constants.AdminUserID;
            }
            if (showErrorInBullets)
            {
                strExceptionMsgs = strExceptionMsgs + "<br/><ul style='margin-bottom:0px;'>";
            }
            foreach (EXCEPTIONDC objExc in lstException)
            {
                Boolean IsExceptionExist = strExceptionMsgs.Contains(objExc.EXCEPTION_MESSAGE);
                if (Counter < lstException.Count)
                {
                    strFieldids += objExc.FIELD_ID.ToString() + ",";
                    if (!IsExceptionExist)
                    {
                        if (!showErrorInBullets)
                        {
                            strExceptionMsgs += objExc.EXCEPTION_MESSAGE + "<br>";
                        }
                        else
                        {
                            strExceptionMsgs +="<li>" +objExc.EXCEPTION_MESSAGE + "</li>";
                        }
                    }
                }
                else
                {
                    if (!IsExceptionExist)
                    {
                        if (!showErrorInBullets)
                        {
                            strExceptionMsgs += objExc.EXCEPTION_MESSAGE + "<br>";
                        }
                        else
                        {
                            strExceptionMsgs += "<li>" + objExc.EXCEPTION_MESSAGE + "</li>";
                        }
                    }
                    strFieldids += objExc.FIELD_ID.ToString();
                }
                Utility.InsertIntoErrorLog(objExc.EXCEPTION_MESSAGE, objExc.STACK_TRACK, UserID);
                Counter++;
            }
            if (showErrorInBullets)
            {
                strExceptionMsgs = strExceptionMsgs + "</ul>";
            }
            _value = strExceptionMsgs + messagePostFix + " $ " + strFieldids;
            _request = request;
        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage()
            {
                Content = new StringContent(_value),
                RequestMessage = _request
            };
            return Task.FromResult(response);
        }
        public string Value { 
            get{
                return _value;
            }
        }
    }
}