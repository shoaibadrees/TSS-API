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
    public class NotesController : ApiController
    {
        [HttpGet]
        [ResponseType(typeof(List<NOTEDC>))]
        public IHttpActionResult Get(int SCREEN_ID, int SCREEN_RECORD_ID)
        {
            var objNotes = new NOTEBL();
            List<NOTEDC> objResultsList = new List<NOTEDC>();
            if (SCREEN_ID > 0 && SCREEN_RECORD_ID>0 )
            {
                objResultsList = objNotes.LoadByPrimaryKey(SCREEN_ID, SCREEN_RECORD_ID);
            }
            return Ok(new { objResultsList });
        }

        [HttpPost]
       [ResponseType(typeof(int))]
        public IHttpActionResult Insert([FromBody]NOTEDC NoteDC)
        {
            var noteBL = new NOTEBL();
            NoteDC.CREATED_ON = DateTime.Now;
            NoteDC.MODIFIED_ON = DateTime.Now;

            List<NOTEDC> noteList = new List<NOTEDC>();
            noteList.Add(NoteDC);
            int ID = noteBL.Insert(noteList);
            return Ok(ID);

        }
    }
}