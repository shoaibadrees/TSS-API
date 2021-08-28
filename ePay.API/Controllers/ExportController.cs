using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Drawing;
using MigraDoc.DocumentObjectModel;
using PdfSharp;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using EPay.BusinessLayer;
using MigraDoc.DocumentObjectModel.Shapes.Charts;
using System.Collections.Specialized;

namespace EPay.API.Controllers
{
    public class ExportController : ApiController
    {
        [System.Web.Http.HttpPost]
        public HttpResponseMessage ExportGrid([FromBody]StandardExportData data)
        {
            if (data.ExportType == "Excel")
            {
                return ExportToExcel(data);
            }
            else if (data.ExportType == "Pdf")
            {
                return ExportToPdf(data);
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }
        }

       // [System.Web.Http.HttpPost]
        //public HttpResponseMessage ExportGridAllocation([FromBody]AllocationExportData data)
        //{
        //    if (data.ExportType == "Excel")
        //    {
        //        return ExportToExcel(data);
        //    }
        //    else if (data.ExportType == "Pdf")
        //    {
        //        return ExportToPdf(data);
        //    }
        //    else
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.NotImplemented);
        //    }
        //}

        //[System.Web.Http.HttpPost]
        //public HttpResponseMessage ExportGridMatching([FromBody]MatchingExportData data)
        //{
        //    if (data.ExportType == "Excel")
        //    {
        //        return ExportToExcel(data);
        //    }
        //    else if (data.ExportType == "Pdf")
        //    {
        //        return ExportToPdf(data);
        //    }
        //    else
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.NotImplemented);
        //    }
        //}

        [System.Web.Http.HttpPost]
        public HttpResponseMessage ExportAdhocReport([FromBody]AdhocReportData data)
        {
            if (data.ExportType == "Excel")
            {
                return ExportToExcel(data);
            }
            else if (data.ExportType == "Pdf")
            {
                return ExportToPdf(data);
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.NotImplemented);
            }
        }

       //[System.Web.Http.HttpPost]
       // public HttpResponseMessage ExportOutageNumberReport([FromBody]PreFormatedExportData data)
       // {
       //     if (data.ExportType == "Excel")
       //     {
       //         return ExportToExcel(data);
       //     }
       //     else if (data.ExportType == "Pdf")
       //     {
       //         return ExportToPdf(data);
       //     }
       //     else
       //     {
       //         return new HttpResponseMessage(HttpStatusCode.NotImplemented);
       //     }
       // }

       //[System.Web.Http.HttpPost]
       //public HttpResponseMessage ExportOutageCasesReport([FromBody]PreFormatedExportData data)
       //{
       //    if (data.ExportType == "Excel")
       //    {
       //        return ExportToExcel(data);
       //    }
       //    else if (data.ExportType == "Pdf")
       //    {
       //        return ExportToPdf(data);
       //    }
       //    else
       //    {
       //        return new HttpResponseMessage(HttpStatusCode.NotImplemented);
       //    }
       //}

       //[System.Web.Http.HttpPost]
       //public HttpResponseMessage ExportResourceReport([FromBody]PreFormatedExportData data)
       //{
       //    if (data.ExportType == "Excel")
       //    {
       //        return ExportToExcel(data);
       //    }
       //    else if (data.ExportType == "Pdf")
       //    {
       //        return ExportToPdf(data);
       //    }
       //    else
       //    {
       //        return new HttpResponseMessage(HttpStatusCode.NotImplemented);
       //    }
       //}

        private HttpResponseMessage ExportToExcel(ExportData data)
        {
            XSSFWorkbook xssfworkbook = new XSSFWorkbook();
            XSSFSheet sheet = (XSSFSheet)xssfworkbook.CreateSheet(data.ApiResource);

            try
            {
                switch (data.ApiResource)
                {
                    case "Users":
                        EXPORTBL.ExportUsers(sheet, data as StandardExportData);
                        break;
                    case "Events":
                        EXPORTBL.ExportEvents(sheet, data as StandardExportData);
                        break;
                    //case "Requests":
                    //    EXPORTBL.ExportRequests(sheet, data as StandardExportData);
                    //    break;
                    //case "Responses":
                    //    EXPORTBL.ExportResponses(sheet, data as StandardExportData);
                    //    break;
                    //case "Allocation":
                    //    EXPORTBL.ExportAllocation(sheet, data as AllocationExportData);
                    //    break;
                    //case "Matching":
                    //    EXPORTBL.ExportMatching(sheet, data as MatchingExportData);
                    //    break;
                    //case "MatchLog":
                    //    EXPORTBL.ExportMatchLog(sheet, data as StandardExportData);
                    //    break;
                    case "Companies":
                        EXPORTBL.ExportCompanies(sheet, data as StandardExportData);
                        break;
                    case "AdhocReport":
                        EXPORTBL.AdhocReport(sheet, data as AdhocReportData);
                        break;
                    //case "OutageNumberReport":
                    //    EXPORTBL.ExportOutageNumberReport(sheet, data as PreFormatedExportData);
                    //    break;
                    //case "OutageCasesReport":
                    //    EXPORTBL.ExportOutageCasesReport(sheet, data as PreFormatedExportData);
                    //    break;
                    //case "ResourceReport":
                    //    EXPORTBL.ExportResourceReport(sheet, data as PreFormatedExportData);
                    //    break;
                    //case "NonIOURequests":
                    //    EXPORTBL.ExportNonIOURequests(sheet, data as StandardExportData);
                    //    break;
                    default:
                        return new HttpResponseMessage(HttpStatusCode.NoContent);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message == "INVALID_API_PARAMS")
                {
                    return new HttpResponseMessage(HttpStatusCode.NoContent);
                }
                else
                {
                    return new HttpResponseMessage()
                    {
                        Content = new StringContent(ex.Message),
                        RequestMessage = Request
                    };
                }
            }
           
            MemoryStream stream = new MemoryStream();
            xssfworkbook.Write(stream);
            HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(stream.ToArray());
            string saveAsFileName = data.ApiResource + ".xlsx";
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
            result.Content.Headers.Add("x-filename", saveAsFileName);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = saveAsFileName;

            return result;
        }

        private HttpResponseMessage ExportToPdf(ExportData data)
        {
            Document document = new Document();
            document.Info.Title = data.ApiResource;

            Section section = document.AddSection();
            section.PageSetup.TopMargin = section.PageSetup.RightMargin = section.PageSetup.BottomMargin = section.PageSetup.LeftMargin = Unit.FromInch(0.5);
            Table table = section.AddTable();
            table.Borders.Color = new MigraDoc.DocumentObjectModel.Color(0, 0, 0);
            table.Borders.Top.Width = table.Borders.Right.Width = table.Borders.Bottom.Width = table.Borders.Left.Width = Unit.FromPoint(0.5);

            try
            {
                switch (data.ApiResource)
                {
                    case "Users":
                        EXPORTBL.ExportUsers(ref table, data as StandardExportData);
                        break;
                    //case "Events":
                    //    EXPORTBL.ExportEvents(ref table, data as StandardExportData);
                    //    break;
                    //case "Requests":
                    //    EXPORTBL.ExportRequests(ref table, data as StandardExportData);
                    //    break;
                    //case "Responses":
                    //    EXPORTBL.ExportResponses(ref table, data as StandardExportData);
                    //    break;
                    //case "Allocation":
                    //    EXPORTBL.ExportAllocation(ref table, data as AllocationExportData);
                    //    break;
                    //case "Matching":
                    //    EXPORTBL.ExportMatching(ref table, data as MatchingExportData);
                    //    break;
                    //case "MatchLog":
                    //    EXPORTBL.ExportMatchLog(ref table, data as StandardExportData);
                    //    break;
                    case "Companies":
                        EXPORTBL.ExportCompanies(ref table, data as StandardExportData);
                        break;
                    case "AdhocReport":
                        EXPORTBL.AdhocReport(ref table, data as AdhocReportData);
                        break;
                    //case "OutageNumberReport":
                    //    EXPORTBL.ExportOutageNumberReport(ref document, ref table, data as PreFormatedExportData);
                    //    break;
                    //case "OutageCasesReport":
                    //    EXPORTBL.ExportOutageCasesReport(ref document,ref table, data as PreFormatedExportData);
                    //    break;
                    //case "ResourceReport":
                    //    EXPORTBL.ExportResourceReport(ref table, data as PreFormatedExportData);
                    //    break;
                    //case "NonIOURequests":
                    //    EXPORTBL.ExportNonIOURequests(ref table, data as StandardExportData);
                    //    break;
                    default:
                        return new HttpResponseMessage(HttpStatusCode.NoContent);
                }
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage()
                {
                    Content = new StringContent(ex.Message),
                    RequestMessage = Request
                };
            }

            document.UseCmykColor = true;
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(true);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            MemoryStream stream = new MemoryStream();
            pdfRenderer.Save(stream, false);

            HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(stream.ToArray());
            string saveAsFileName = data.ApiResource + ".pdf";
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            result.Content.Headers.Add("x-filename", saveAsFileName);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = saveAsFileName;
            return result;
        }
        
        [System.Web.Http.HttpPost]
        public HttpResponseMessage Proxy() {
            var httpContext = (HttpContextWrapper)Request.Properties["MS_HttpContext"];

            string contentType = httpContext.Request.Form["contentType"];
            string base64 = httpContext.Request.Form["base64"];
            string fileName = httpContext.Request.Form["fileName"];
            byte[] fileContents = Convert.FromBase64String(base64);

            MemoryStream stream = new MemoryStream();
            stream.Write(fileContents, 0, fileContents.Length);
            HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(stream.ToArray());

            result.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            result.Content.Headers.Add("x-filename", fileName);
            result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = fileName;
            
            return result;
        }
    }
}