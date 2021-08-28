using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NMART.BusinessLayer;
using NMART.DataClasses;
using NMART.DataAccess;
using nMart.Common;
using System.Web.Http.Results;
using System.Web.Http.Description;

namespace nMart.API.Controllers
{
    public class CompaniesRmagController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIES_RMAGDC>))]

        public IHttpActionResult GetCompaniesByRmags(String Rmags)
        {
            COMPANIES_RMAGBL objCOMPANIES_RMAG = new COMPANIES_RMAGBL();
            List<COMPANIEDC> objResultList = new List<COMPANIEDC>();
            try
            {
                objResultList = objCOMPANIES_RMAG.GetCompaniesByRmags(Rmags);
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIES_RMAGDC>))]

        public IHttpActionResult GetCompaniesByRmagsAndInvitedCompanies(String Rmags,String EventId)
        {
            COMPANIES_RMAGBL objCOMPANIES_RMAG = new COMPANIES_RMAGBL();
            List<COMPANIEDC> objResultList = new List<COMPANIEDC>();
            try
            {
                objResultList = objCOMPANIES_RMAG.GetCompaniesByRmagsAndInvitedCompanies(Rmags, Convert.ToInt16(EventId));
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIES_RMAGDC>))]

        public IHttpActionResult GetAll()
        {
            COMPANIES_RMAGBL objCompaniesRmags = new COMPANIES_RMAGBL();
            List<COMPANIES_RMAGDC> objResultList = new List<COMPANIES_RMAGDC>();
            try
            {
                objResultList = objCompaniesRmags.LoadAll();
                return Ok(new { objResultList });

            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }


        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<COMPANIES_RMAGDC>))]

        public IHttpActionResult  Get(int id)
        {
            COMPANIES_RMAGBL objCompanies_Rmags = new COMPANIES_RMAGBL();
            COMPANIES_RMAGDC objResult = new COMPANIES_RMAGDC();
            try{
                objResult = objCompanies_Rmags.LoadByPrimaryKey(id);
                return Ok(new { objResult });

             }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // POST api/values
        [HttpPost]
        public IHttpActionResult Update(List<COMPANIES_RMAGDC> objCompanies_Rmags)
        {
            COMPANIES_RMAGBL objCompanies_Rmag = new COMPANIES_RMAGBL();
            try
            {
                int IsUpdated = objCompanies_Rmag.Update(objCompanies_Rmags);
                return Ok();
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert(List<COMPANIES_RMAGDC> objCompanies_Rmags)
        {
            COMPANIES_RMAGBL objCompanies_Rmag = new COMPANIES_RMAGBL();
            try
            {
                int IsInserted = objCompanies_Rmag.Insert(objCompanies_Rmags);
                return Ok(IsInserted);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }
        }

        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete(List<COMPANIES_RMAGDC> objCompanies_Rmags)
        {
            COMPANIES_RMAGBL objCompanies_Rmag = new COMPANIES_RMAGBL();
            try
            {
                int IsDeleted = objCompanies_Rmag.Delete(objCompanies_Rmags);
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(ex.Message, Request);
            }

        }
    }
}
