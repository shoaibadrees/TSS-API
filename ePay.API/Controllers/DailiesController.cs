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
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;
using OfficeOpenXml;
using System.Data;

namespace EPay.API.Controllers
{
    public class DailiesController : ApiController
    {

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<DAILYDC>))]

        public IHttpActionResult GetAll(string projectIDs = "All", string dailyTypeIDs = "All", string statusIDs = "All", string shiftIDs = "All", string dailyDate = "All", string dailyEndDate = "All")
        {
            DAILYBL dailyBL = new DAILYBL();
            List<DAILYDC> objResultList = new List<DAILYDC>();
            objResultList = dailyBL.LoadAll(projectIDs, dailyTypeIDs, statusIDs, shiftIDs , dailyDate, dailyEndDate);
            return Ok(new { objResultList });
        }

        // GET api/values
        [HttpGet]
        [ResponseType(typeof(List<DailyHoursReportDC>))]

        public IHttpActionResult GetHoursReport(string projectIDs = "All", string dailyTypeIDs = "All", string statusIDs = "All", string shiftIDs = "All", string dailyDate = "All", string dailyEndDate = "All")
        {
            DAILYBL dailyBL = new DAILYBL();
            List<DailyHoursReportDC> objResultList = new List<DailyHoursReportDC>();
            objResultList = dailyBL.GetHoursReport(projectIDs, dailyTypeIDs, statusIDs, shiftIDs, dailyDate, dailyEndDate);
            return Ok(new { objResultList });
        }

        // GET api/values
        [HttpGet]
        public IHttpActionResult GetByID(int dailyid)
        {
            DAILYBL dailyBL = new DAILYBL();
            DAILYDC objResult = new DAILYDC();
            if (dailyid > 0)
            {
                objResult = dailyBL.LoadByPrimaryKey(dailyid);
            }
            return Ok(new { objResult });
        }


        [HttpGet]
        public IHttpActionResult GetWholeDailyByID(int dailyid)
        {
            DailyDTO dailyDTO = new DailyDTO();
            //try
            //{
                DAILYBL dailyBL = new DAILYBL();
               
               
                    
                dailyDTO.DAILYDC = dailyBL.LoadByPrimaryKey(dailyid);
                   
                int dailyId = dailyDTO.DAILYDC.DAILY_ID;
                int dailyType = dailyDTO.DAILYDC.DAILY_TYPE;

                List<LOOK_UPDC> lookupList = new LOOK_UPBL().LoadAll();

                var materialSubCateObjs = lookupList.Where(obj => obj.LU_TYPE == "MATERIAL_SUB_CATEGORY");
                dailyDTO.LU_ID_LABOR = materialSubCateObjs.Where(obj => obj.LU_NAME == "Labor").First().LOOK_UP_ID;
                dailyDTO.LU_ID_AERIAL = materialSubCateObjs.Where(obj => obj.LU_NAME == "Aerial").First().LOOK_UP_ID;
                dailyDTO.LU_ID_MDU = materialSubCateObjs.Where(obj => obj.LU_NAME == "MDU").First().LOOK_UP_ID;

                dailyDTO.listMAN_POWERDC = (new MAN_POWERBL()).LoadByDailyID(dailyId);
                if (dailyDTO.listMAN_POWERDC.Count > 0)
                {
                    dailyDTO.listMAN_POWERDC = (from obj in dailyDTO.listMAN_POWERDC where obj.MODIFIED_BY > 0 select obj).ToList<MAN_POWERDC>();
                }

                dailyDTO.listLABORDC = (new LABORBL()).GetLaborFromManPower(dailyid, dailyType);
                //if (dailyDTO.listLABORDC.Count > 0)
                //{
                //    dailyDTO.listLABORDC = (from obj in dailyDTO.listLABORDC where obj.MODIFIED_BY > 0 select obj).ToList<LABORDC>();
                //}
                dailyDTO.listVEHICLEDC = (new VEHICLEBL()).LoadByDailyIDAndType(dailyId, dailyType);
                if (dailyDTO.listVEHICLEDC.Count > 0)
                {
                    dailyDTO.listVEHICLEDC = (from obj in dailyDTO.listVEHICLEDC where obj.MODIFIED_BY > 0 select obj).ToList<VEHICLEDC>();
                }

                dailyDTO.listMATERIALDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, -1);
                if (dailyDTO.listMATERIALDC.Count > 0)
                {
                    dailyDTO.listMATERIALDC = (from obj in dailyDTO.listMATERIALDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                }

                if (dailyDTO.LU_ID_LABOR != 0)
                {
                    dailyDTO.listLaborItemDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_LABOR);
                    if (dailyDTO.listLaborItemDC.Count > 0)
                    {
                        dailyDTO.listLaborItemDC = (from obj in dailyDTO.listLaborItemDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                    }
                }

                if (dailyDTO.LU_ID_AERIAL != 0)
                {
                    dailyDTO.listAerialDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_AERIAL);
                    if (dailyDTO.listAerialDC.Count > 0)
                    {
                        dailyDTO.listAerialDC = (from obj in dailyDTO.listAerialDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                    }
                }
                if (dailyDTO.LU_ID_MDU != 0)
                {
                    dailyDTO.listMDUDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_MDU);
                    if (dailyDTO.listMDUDC.Count > 0)
                    {
                        dailyDTO.listMDUDC = (from obj in dailyDTO.listMDUDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                    }
                }

                dailyDTO.listWORK_DETAILDC = (new WORK_DETAILBL()).LoadByDailyIDAndType(dailyId, dailyType);
                if (dailyDTO.listWORK_DETAILDC.Count > 0)
                {
                    dailyDTO.listWORK_DETAILDC = (from obj in dailyDTO.listWORK_DETAILDC where obj.MODIFIED_BY > 0 select obj).ToList<WORK_DETAILDC>();
                }
                var objResult = dailyDTO;


                return Ok(new { objResult });
            //}
            //catch (Exception ex)
            //{
            //    if (ex.Message.Contains("UNIQUE KEY constraint"))
            //    {
            //        throw new System.InvalidOperationException("JobNumber");
            //    }
            //    else
            //        throw ex;
            //}
        }



        [HttpGet]
        [ResponseType(typeof(List<MAN_POWERDC>))]
        public IHttpActionResult GetManPower(int dailyid)
        {
            MAN_POWERBL mpBL = new MAN_POWERBL();
            List<MAN_POWERDC> objResult = new List<MAN_POWERDC>();
            objResult = mpBL.LoadByDailyID(dailyid);
            return Ok(new { objResult });
        }

        [HttpPost]
        [ResponseType(typeof(int))]
        public IHttpActionResult DeleteManPower([FromBody]List<MAN_POWERDC> manPowerList)
        {
            MAN_POWERBL mpBL = new MAN_POWERBL();
            int updatedLockCounter = 0;
            updatedLockCounter = mpBL.Delete(manPowerList);
            return Ok(new { updatedLockCounter });
        }


        [HttpGet]
        [ResponseType(typeof(List<string>))]
        public IHttpActionResult LoadNames(string Column_Name, string Column_Value)
        {
            MAN_POWERBL mpBL = new MAN_POWERBL();
            List<string> objResult = new List<string>();
            if (!String.IsNullOrEmpty(Column_Value))
            {
                Column_Value = Util.Utility.PrepareStringForDB(Column_Value);
                objResult = mpBL.LoadNames(Column_Name, Column_Value);
            }
            return Ok(new { objResult });
        }
        [HttpGet]
        [ResponseType(typeof(List<VEHICLEDC>))]
        public IHttpActionResult GetVehicles(int dailyid, int dailytype)
        {
            VEHICLEBL vehicleBL = new VEHICLEBL();
            List<VEHICLEDC> objResult = new List<VEHICLEDC>();
            objResult = vehicleBL.LoadByDailyIDAndType(dailyid, dailytype);
            return Ok(new { objResult });
        }
        [HttpGet]
        [ResponseType(typeof(List<MAN_POWERDC>))]
        public IHttpActionResult GetMaterials(int dailyid, int dailytype, int subcategory)
        {
            MATERIALBL materialBL = new MATERIALBL();
            List<MATERIALDC> objResult = new List<MATERIALDC>();
            objResult = materialBL.LoadByDailyIDAndType(dailyid, dailytype, subcategory);
            return Ok(new { objResult });
        }
        [HttpGet]
        [ResponseType(typeof(List<LABORDC>))]
        public IHttpActionResult GetLabors(int dailyid, int dailytype)
        {
            LABORBL laborBL = new LABORBL();
            List<LABORDC> objResult = new List<LABORDC>();
            objResult = laborBL.LoadByDailyIDAndType(dailyid, dailytype);
            return Ok(new { objResult });
        }
        [HttpGet]
        [ResponseType(typeof(List<WORK_DETAILDC>))]
        public IHttpActionResult GetWorkDetails(int dailyid, int dailytype)
        {
            WORK_DETAILBL laborBL = new WORK_DETAILBL();
            List<WORK_DETAILDC> objResult = new List<WORK_DETAILDC>();
            objResult = laborBL.LoadByDailyIDAndType(dailyid, dailytype);
            return Ok(new { objResult });
        }
        // PUT api/values/5
        [HttpPost]
        public IHttpActionResult Insert([FromBody]DailyDTO dailyDTO)
        {
            try
            {
                DAILYBL dailyBL = new DAILYBL();
                #region REPEAT DAILY
                if (dailyDTO.Repeat == true) {
                    int createdBy = dailyDTO.DAILYDC.CREATED_BY;
                    dailyDTO.DAILYDC = dailyBL.LoadByPrimaryKey(dailyDTO.DAILYDC.DAILY_ID);
                    dailyDTO.DAILYDC.CREATED_BY = dailyDTO.DAILYDC.MODIFIED_BY = createdBy;
                    int dailyId = dailyDTO.DAILYDC.DAILY_ID;
                    int dailyType = dailyDTO.DAILYDC.DAILY_TYPE;

                    dailyDTO.listMAN_POWERDC = (new MAN_POWERBL()).LoadByDailyID(dailyId);
                    if (dailyDTO.listMAN_POWERDC.Count > 0) {
                        dailyDTO.listMAN_POWERDC = (from obj in dailyDTO.listMAN_POWERDC where obj.MODIFIED_BY > 0 select obj).ToList<MAN_POWERDC>();
                    }

                    dailyDTO.listVEHICLEDC = (new VEHICLEBL()).LoadByDailyIDAndType(dailyId, dailyType);
                    if (dailyDTO.listVEHICLEDC.Count > 0)
                    {
                        dailyDTO.listVEHICLEDC = (from obj in dailyDTO.listVEHICLEDC where obj.MODIFIED_BY > 0 select obj).ToList<VEHICLEDC>();
                    }

                    dailyDTO.listMATERIALDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, -1);
                    if (dailyDTO.listMATERIALDC.Count > 0)
                    {
                        dailyDTO.listMATERIALDC = (from obj in dailyDTO.listMATERIALDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                    }

                    if (dailyDTO.LU_ID_LABOR != 0)
                    {
                        dailyDTO.listLaborItemDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_LABOR);
                        if (dailyDTO.listLaborItemDC.Count > 0)
                        {
                            dailyDTO.listLaborItemDC = (from obj in dailyDTO.listLaborItemDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                        }
                    }
                    if (dailyDTO.LU_ID_AERIAL != 0)
                    {
                        dailyDTO.listAerialDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_AERIAL);
                        if (dailyDTO.listAerialDC.Count > 0)
                        {
                            dailyDTO.listAerialDC = (from obj in dailyDTO.listAerialDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                        }
                    }
                    if (dailyDTO.LU_ID_MDU != 0)
                    {
                        dailyDTO.listMDUDC = (new MATERIALBL()).LoadByDailyIDAndType(dailyId, dailyType, dailyDTO.LU_ID_MDU);
                        if (dailyDTO.listMDUDC.Count > 0)
                        {
                            dailyDTO.listMDUDC = (from obj in dailyDTO.listMDUDC where obj.MODIFIED_BY > 0 select obj).ToList<MATERIALDC>();
                        }
                    }

                    dailyDTO.listWORK_DETAILDC = (new WORK_DETAILBL()).LoadByDailyIDAndType(dailyId, dailyType);
                    if (dailyDTO.listWORK_DETAILDC.Count > 0)
                    {
                        dailyDTO.listWORK_DETAILDC = (from obj in dailyDTO.listWORK_DETAILDC where obj.MODIFIED_BY > 0 select obj).ToList<WORK_DETAILDC>();
                    }
                }
                #endregion
                dailyDTO = dailyBL.Insert(dailyDTO);
                if (dailyDTO.DAILYDC.DAILY_ID != 0)
                {
                    dailyDTO.DAILYDC = dailyBL.LoadByPrimaryKey(dailyDTO.DAILYDC.DAILY_ID);
                    dailyDTO.DAILYDC.TRANSACTION_SUCCESS = true;

                    //Task.Run(() => dailyBL.SendDailyEmail(Request, dailyDTO.DAILYDC));
                }
                return Ok(new { dailyDTO.DAILYDC.DAILY_ID, dailyDTO });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("UNIQUE KEY constraint"))
                {
                    throw new System.InvalidOperationException("JobNumber");
                }
                else
                    throw ex;
            }
        }

        [HttpGet]
        public IHttpActionResult SendDailyEmail(int dailyID,bool isNewDaily)
        {
            try
            {
                if (dailyID < 0)
                {
                    throw new Exception("Wrong Daily ID i.e."+ dailyID);
                }
                DAILYDC daily = null;
                DAILYBL dailyBL = new DAILYBL();
               
                
                daily = dailyBL.LoadByPrimaryKey(dailyID);
                dailyBL.SendDailyEmail(Request, daily, isNewDaily);                

                return Ok(1);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost]
        [ResponseType(typeof(DailyDTO))]
        public IHttpActionResult Update([FromBody]DailyDTO dailyDTO)
        {
            DAILYBL dailyBL = new DAILYBL();
            int IsUpdated = 0;
            dailyDTO = dailyBL.Update(dailyDTO);
            bool TRANSACTION_SUCCESS = dailyDTO.DAILYDC.TRANSACTION_SUCCESS;
            if (TRANSACTION_SUCCESS)
            {
                dailyDTO.DAILYDC = dailyBL.LoadByPrimaryKey(dailyDTO.DAILYDC.DAILY_ID);
                dailyDTO.DAILYDC.TRANSACTION_SUCCESS = TRANSACTION_SUCCESS;
                //Task.Run(() => dailyBL.SendDailyEmail(Request, dailyDTO.DAILYDC));
            }
            return Ok(new { IsUpdated, dailyDTO });
        }


        // DELETE api/values/5
        [HttpPost]
        public IHttpActionResult Delete([FromBody]List<DAILYDC> objUsers)
        {
            DAILYBL dailyBL = new DAILYBL();
            List<EXCEPTIONDC> lstException = new List<EXCEPTIONDC>();
            try
            {
                int IsDeleted = dailyBL.Delete(objUsers,ref lstException);
                if (lstException.Count > 0)
                    throw new Exception("Excption Occure");
                return Ok(IsDeleted);
            }
            catch (Exception ex)
            {
                return new TextResult(lstException, Request, "Following daily(ies) cannot be deleted as: ", "All the other records deleted successfully.", true);
            }
        }

        [System.Web.Http.HttpPost]
        public HttpResponseMessage ExportAdditionalReport([FromBody]AdditionalReportCriteria data)
        {
            //ExcelPackage pckg = new ExcelPackage();
            //try
            //{
            //    ReportWriter writer = new ExcelWriter();
            //    writer.SetWriter = pckg;
            //    NMART.BusinessLayer.ExportAdditionalReport.ExportReport(writer, data);
            //}
            //catch (Exception ex)
            //{
            //    if (ex.Message == "INVALID_API_PARAMS")
            //        return new HttpResponseMessage(HttpStatusCode.NoContent);
            //    else
            //        return new HttpResponseMessage() { Content = new StringContent(ex.Message), RequestMessage = Request };
            //}
            //MemoryStream stream = new MemoryStream();
            //pckg.SaveAs(stream);
            //return CreateExcelResponse(stream, string.Format("{0}_{1}_{2}.xlsx", data.ApiResource, data.REPORT_TYPE.ToString(), DateTime.Now.ToString("MM_dd_yyyy_HH_mm_ss")));

            DAILYBL dailyBL = new DAILYBL();
            DataSet ds = null;
            ds = dailyBL.DailyHoursReport("All", data.DailyTypeIDs, "All", "All", data.StartDate, "All");
            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return new HttpResponseMessage() { Content = new StringContent("No Data"), RequestMessage = Request };

            }

            MemoryStream stream = dailyBL.GetStreamForHoursReport(ds);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
            return ExportUtility.CreateExcelResponse(Request, response, stream, "abc.xlsx");
             
        }

       

    }
}
