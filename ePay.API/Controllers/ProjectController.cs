using EPay.BusinessLayer;
using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace EPay.API.Controllers
{
    public class ProjectController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<PROJECTDC>))]
        public IHttpActionResult GetAll( string clientIDs = "All", string projectStatusIDs = "All")
        {
            
            PROJECTBL objPROJECTs = new PROJECTBL();
            List<PROJECTDC> objResultList = new List<PROJECTDC>();
            objResultList = objPROJECTs.LoadAll(clientIDs, projectStatusIDs);
            return Ok(new { objResultList });
        }
        [HttpGet]
        [ResponseType(typeof(List<PROJECTDC>))]
        public IHttpActionResult GetAllByStatus(String projectStatus)
        {
            PROJECTBL objPROJECTs = new PROJECTBL();
            List<PROJECTDC> objResultList = new List<PROJECTDC>();
            objResultList = objPROJECTs.LoadAllByStatus(projectStatus);
            return Ok(new { objResultList });
        }

        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            var objProjects = new PROJECTBL();
            var objResults = new PROJECTDC();
            if (id > 0)
            {
                objResults = objProjects.LoadByPrimaryKey(id);
            }
            return Ok(new { objResults });

        }

        [HttpPost]
        public IHttpActionResult Update([FromBody]PROJECTDC projectDC)
        {
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                var objProject = new PROJECTBL();

                int IsUpdated = 0;
                projectDC.CREATED_ON = Convert.ToDateTime(projectDC.CREATED_ON);
                projectDC.MODIFIED_ON = Convert.ToDateTime(projectDC.MODIFIED_ON);
                List<PROJECTDC> projectList = new List<PROJECTDC>();
                projectList.Add(projectDC);
                int UpdatedCount = objProject.Update(projectList,ref lstException);
                if (UpdatedCount > 0)
                    IsUpdated = 1;
                return Ok(IsUpdated);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request);
            }

        }

        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult Insert([FromBody]PROJECTDC projectDC)
        {
            try
            {
                var projectBL = new PROJECTBL();
                projectDC.CREATED_ON = Convert.ToDateTime(projectDC.CREATED_ON);
                projectDC.MODIFIED_ON = Convert.ToDateTime(projectDC.MODIFIED_ON);

                List<PROJECTDC> projectList = new List<PROJECTDC>();
                projectList.Add(projectDC);
                int ID = projectBL.Insert(projectList);
                return Ok(ID);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("unique_Projects_Project_Bid_Name"))
                {
                    throw new System.InvalidOperationException("ProjectName");
                }
                else
                    throw ex;
            }
        }
    }
}
