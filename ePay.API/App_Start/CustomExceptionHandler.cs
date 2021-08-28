using System.Net;
using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;
using EPay.Util;

namespace EPay.API
{
    public class CustomExceptionHandler : ExceptionHandler
    {
        private class ErrorInformation
        {
            public string Type { get; set; }
            public string Message { get; set; }
            public string StackTrace { get; set; }
        }

        public override void Handle(ExceptionHandlerContext context)
        {
            ErrorInformation errorInformation = new ErrorInformation
            {
                Type = "API_EXCEPTION",
                Message = context.Exception.Message,
                StackTrace = context.Exception.StackTrace
            };
            int UserID = Common.Utility.GetUserID(context.Request);
            Utility.InsertIntoErrorLog(context.Exception.Message, context.Exception.StackTrace, UserID);
            HttpResponseMessage httpResponseMsg = context.Request.CreateResponse(HttpStatusCode.InternalServerError, errorInformation);
            context.Result = new ResponseMessageResult(httpResponseMsg);
        }

    }
}