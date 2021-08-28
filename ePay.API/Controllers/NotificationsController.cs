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

namespace EPay.API.Controllers
{
    public class NotificationsController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<NOTIFICATIONDC>))]

        public IHttpActionResult GetAll()
        {
            NOTIFICATIONBL objNotifications = new NOTIFICATIONBL();
            List<NOTIFICATIONDC> objResultList = new List<NOTIFICATIONDC>();
            try
            {
                objResultList = objNotifications.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }



        // GET api/values
        //[HttpGet]
        //public IHttpActionResult LoadAllByEventAndType(int EventId, int TypeId, int UserId, int NoOfPages)
        //{
        //    NOTIFICATIONBL objNotifications = new NOTIFICATIONBL();
        //    List<NOTIFICATIONDC> objResultList = new List<NOTIFICATIONDC>();
        //    try{
        //        objResultList = objNotifications.LoadAllByEventAndType(EventId, TypeId, UserId,NoOfPages);
        //        return Ok(new { objResultList });
        //     }
        //    catch (Exception ex)
        //    {
        //       return new TextResult(ex.Message, Request,ex.StackTrace);
        //    }
        //}

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<NOTIFICATIONDC> objNotificationslist)
        {
            NOTIFICATIONBL objCompanie = new NOTIFICATIONBL();
            try
            {
                int IsUpdated = objCompanie.Update(objNotificationslist);
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }



       //  PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<NOTIFICATIONDC> objNotificationslist)
        {
            NOTIFICATIONBL objCompanie = new NOTIFICATIONBL();

            try
            {
                int IsInserted = objCompanie.Insert(objNotificationslist);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }

      

      //   DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<NOTIFICATIONDC> objNotificationslist)
        {
            NOTIFICATIONBL objCompanie = new NOTIFICATIONBL();
            try
            {
                int IsDeleted = objCompanie.Delete(objNotificationslist);
                return Ok(new { IsDeleted });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }

    }
}
