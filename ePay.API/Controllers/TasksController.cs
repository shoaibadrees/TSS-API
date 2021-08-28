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
    public class TasksController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<HYLAN_TASKDC>))]
        public IHttpActionResult GetAll(int TASK_TITLE_ID)
        {
            HYLAN_TASKBL HYLAN_TASKBL = new HYLAN_TASKBL();
            List<HYLAN_TASKDC> objResultList = new List<HYLAN_TASKDC>();
            objResultList = HYLAN_TASKBL.LoadAll(TASK_TITLE_ID);
            return Ok(new { objResultList });
        }

        [HttpGet]
        [ResponseType(typeof(HYLAN_TASKDC))]
        public IHttpActionResult Get(int TASK_TITLE_ID, int JOB_ID)
        {
            HYLAN_TASKBL HYLAN_TASKBL = new HYLAN_TASKBL();
            HYLAN_TASKDC objResult = new HYLAN_TASKDC();
            objResult = HYLAN_TASKBL.LoadByPrimaryKey(TASK_TITLE_ID, JOB_ID);
            return Ok(new { objResult });
        }

        private List<HYLAN_TASKDC> Insert([FromBody]List<HYLAN_TASKDC> hylanTaskList)
        {
            HYLAN_TASKBL HYLAN_TASKBL = new HYLAN_TASKBL();
            HYLAN_TASKBL.Insert(hylanTaskList);
            return hylanTaskList;
        }

        
        private List<HYLAN_TASKDC> Update([FromBody]List<HYLAN_TASKDC> hylanTaskList)
        {
            HYLAN_TASKBL HYLAN_TASKBL = new HYLAN_TASKBL();
            HYLAN_TASKBL.Update(hylanTaskList);
            return hylanTaskList;
        }

        [HttpPost]
        public IHttpActionResult InsertUpdateTasks(List<List<HYLAN_TASKDC>> postData)
        {
            HYLAN_TASKBL HYLAN_TASKBL = new HYLAN_TASKBL();
            postData = HYLAN_TASKBL.InsertUpdateTasks(postData);
            List<HYLAN_TASKDC> insertList = new List<HYLAN_TASKDC>();
            List<HYLAN_TASKDC> updatedList = new List<HYLAN_TASKDC>();
            if (postData != null && postData.Count == 2)
            {
                insertList = postData[0];
                updatedList = postData[1];
            }
            return Ok(new { insertList, updatedList });
        }


        [HttpGet]
        [ResponseType(typeof(List<TASK_ROSTERDC>))]
        public IHttpActionResult GetRoster(string projectIDs = "All")
        {
            TASK_ROSTERBL TASK_ROSTERBL = new TASK_ROSTERBL();
            List<TASK_ROSTERDC> objResultList = new List<TASK_ROSTERDC>();
            objResultList = TASK_ROSTERBL.LoadAll(projectIDs);
            return Ok(new { objResultList });
        }

        [HttpGet]
        [ResponseType(typeof(List<TASK_MATRIXDC>))]
        public IHttpActionResult GetMatrix(string projectIDs = "All", string jfnIDs = "All", string jobStatusIDS = "All", string taskStatusIDs = "All", string tmDate = "All")
        {
            TASK_MATRIXBL TASK_MATRIXBL = new TASK_MATRIXBL();
            List<TASK_MATRIXDC> objResultList = new List<TASK_MATRIXDC>();
            objResultList = TASK_MATRIXBL.TaskMatrixLoadAll(projectIDs, jfnIDs, jobStatusIDS, taskStatusIDs, tmDate);
            return Ok(new { objResultList });
        }
        [HttpGet]
        [ResponseType(typeof(List<TASK_MATRIXDC>))]
        public IHttpActionResult GetOnHold(string projectIDs = "All", string jfnIDs = "All", string jobStatusIDS = "All", string taskNames = "All", string tmDate = "All")
        {
            TASK_MATRIXBL TASK_MATRIXBL = new TASK_MATRIXBL();
            List<TASK_MATRIXDC> objResultList = new List<TASK_MATRIXDC>();
            objResultList = TASK_MATRIXBL.TaskOnHoldLoadAll(projectIDs, jfnIDs, jobStatusIDS, taskNames, tmDate);
            return Ok(new { objResultList });
        }

    }
}