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
using EPay.DAL.DataClasses;

namespace EPay.API.Controllers
{
    public class ReportController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<REPORTDC>))]
        public IHttpActionResult GenerateOutageNumbersReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID, String snapshotDateTime = null,
            String reportType = "NUMBERS", int snapshotType = -1)
        {
            REPORTBL objREPORTBL = new REPORTBL();
            List<REPORTDC> objResultList = new List<REPORTDC>();
            try
            {
                objResultList = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, snapshotDateTime, reportType, snapshotType);
                return Ok(new { objResultList });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
        [HttpGet]
        [ResponseType(typeof(List<REPORTDC>))]
        public IHttpActionResult GenerateResourceReport(int EVENT_ID, int RMAG_ID, int COMPANY_ID, String snapshotDateTime = null,
            String reportType = "NUMBERS", int snapshotType = -1)
        {
            REPORTBL objREPORTBL = new REPORTBL();
            List<REPORTDC> objResultList = new List<REPORTDC>();
            try
            {
                objResultList = objREPORTBL.GenerateResourceReport(EVENT_ID, RMAG_ID, COMPANY_ID, snapshotDateTime, reportType, snapshotType);
                return Ok(new { objResultList });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
       
    }
}