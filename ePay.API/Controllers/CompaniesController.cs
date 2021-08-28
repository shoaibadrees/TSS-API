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
    public class CompaniesController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIEDC>))]

        public IHttpActionResult GetAllActiveCompanies()
        {
            COMPANIEBL objCompanies = new COMPANIEBL();
            List<COMPANIEDC> objResultList = new List<COMPANIEDC>();
            try
            {
                objResultList = objCompanies.LoadAllActiveCompanies();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request,ex.StackTrace);
            }
        }
       
       
        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIEDC>))]

        public IHttpActionResult GetAll()
        {
            COMPANIEBL objCompanies = new COMPANIEBL();
            List<COMPANIEDC> objResultList = new List<COMPANIEDC>();
            try
            {
                objResultList = objCompanies.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }



        // GET api/values
        [HttpGet]
        public IHttpActionResult  Get(int id)
        {
            COMPANIEBL objCompanies = new COMPANIEBL();
            COMPANIEDC objResult = new COMPANIEDC();
            try
            {
                objResult = objCompanies.LoadByPrimaryKey(id);
                return Ok(new { objResult });
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request, ex.StackTrace);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<COMPANIEDC> objCompanieslist)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            COMPANIEBL objCompanie = new COMPANIEBL();
            try
            {
                int IsUpdated = objCompanie.Update(objCompanieslist, ref lstException);
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {                
                return new TextResult(lstException, Request);
            }
        }

       //  PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<COMPANIEDC> objCompanieslist)
        {
            COMPANIEBL objCompanie = new COMPANIEBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            foreach (COMPANIEDC objCompany in objCompanieslist) {

                objCompany.MODIFIED_BY = objCompany.CREATED_BY;
                objCompany.MODIFIED_ON = System.DateTime.Now;
                objCompany.CREATED_ON = System.DateTime.Now;
            }

            //try
            //{
                int IsInserted = objCompanie.Insert(objCompanieslist);
                return Ok(IsInserted);
            //}
            //catch (Exception ex)
            //{
            //   return new TextResult(ex.Message, Request,ex.StackTrace);
            //}
        }

      

      //   DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<COMPANIEDC> objCompanieslist)
        {
            COMPANIEBL objCompanie = new COMPANIEBL();
            try
            {
                int IsDeleted = objCompanie.Delete(objCompanieslist);
                return Ok(new { IsDeleted });
            }
            catch (Exception ex)
            {
               return new TextResult(ex.Message, Request,ex.StackTrace);
            }

        }

           // DELETE api/values/5
        //[HttpDelete]
        //public HttpResponseMessage Delete(COMPANIEDC objCompanies)
        //{
        //    COMPANIEBL objCompanie = new COMPANIEBL();
        //    List<COMPANIEDC> objCompanieslist = new List<COMPANIEDC>();
        //    try
        //    {
        //        objCompanieslist.Add(objCompanies);
        //        int IsDeleted = objCompanie.Delete(objCompanieslist);
        //        return Request.CreateResponse(HttpStatusCode.OK, IsDeleted);
        //    }
        //    catch
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }

        //}
    }
}
