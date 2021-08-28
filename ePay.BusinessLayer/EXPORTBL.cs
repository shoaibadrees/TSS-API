using System;
using System.Collections.Generic;
using EPay.DataClasses;
using EPay.DataAccess;
using NPOI.XSSF.UserModel;
using MigraDoc.DocumentObjectModel;
using PdfSharp;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using EPay.Common;
using System.Linq;
using MigraDoc.DocumentObjectModel.Shapes.Charts;
using PdfSharp.Drawing;
using PdfSharp.Drawing.Layout;

namespace EPay.BusinessLayer
{
    public class ExportData
    {
        public string ApiResource { get; set; }
        public string ExportType { get; set; }
    }

    public class StandardExportData : ExportData
    {
        public string IDs { get; set; }
    }

    //public class AllocationExportData : ExportData
    //{
    //    public string EVENT_ID { get; set; }
    //    public string RMAG_NAME { get; set; }
    //    public string COMPANY_NAME { get; set; }
    //    public string CALC_RUN { get; set; }
    //    public string VIEW_TYPE { get; set; }
    //    public string CALC_TYPE { get; set; }
    //    public string ACOV { get; set; }
    //}

    //public class PreFormatedExportData : ExportData
    //{
    //    public string EVENT_ID { get; set; }
    //    public string SNAPSHOT_DATE { get; set; }
    //    public string RMAG_ID { get; set; }
    //    public string COMPANY_ID { get; set; }
    //}


    //public class MatchingExportData : ExportData
    //{
    //    public string EVENT_ID { get; set; }
    //    public string VIEW_TYPE { get; set; }
    //    public string CALC_RUN { get; set; }
    //    public string MATCHING_RMAG_ID { get; set; }
    //    public string MATCHING_REQUEST_ID { get; set; }
    //    public string REQ_RMAG_NAME { get; set; }
    //    public string REQ_COMPANY_NAME { get; set; }
    //    public string RESP_RMAG_NAME { get; set; }
    //    public string RESP_COMPANY_NAME { get; set; }

    //}
    public class AdhocReportData : ExportData
    {
        public string QUERY { get; set; }
    }

    public class EXPORTBL
    {
        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        public static void ExportUsers(XSSFSheet sheet, StandardExportData data)
        {
            #region Build Header

            XSSFRow headerRow = (XSSFRow)sheet.CreateRow(0);
            NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
            style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
            NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
            font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
           
            style.SetFont(font);

            XSSFCell cell0 = (XSSFCell)headerRow.CreateCell(0);
            sheet.SetColumnWidth(0, 5000);
            cell0.CellStyle = style;
            cell0.SetCellValue("*USER NAME");

            XSSFCell cell1 = (XSSFCell)headerRow.CreateCell(1);
            sheet.SetColumnWidth(1, 5000);
            cell1.CellStyle = style;
            cell1.SetCellValue("*FIRST NAME");

            XSSFCell cell2 = (XSSFCell)headerRow.CreateCell(2);
            sheet.SetColumnWidth(2, 5000);
            cell2.CellStyle = style;
            cell2.SetCellValue("*LAST NAME");

            XSSFCell cell3 = (XSSFCell)headerRow.CreateCell(3);
            sheet.SetColumnWidth(3, 5000);
            cell3.CellStyle = style;
            cell3.SetCellValue("*USER ROLE");

            XSSFCell cell4 = (XSSFCell)headerRow.CreateCell(4);
            sheet.SetColumnWidth(4, 5000);
            cell4.CellStyle = style;
            cell4.SetCellValue("*CLIENTS");

            XSSFCell cell5 = (XSSFCell)headerRow.CreateCell(5);
            sheet.SetColumnWidth(5, 5000);
            cell5.CellStyle = style;
            cell5.SetCellValue("*EMAIL ADDRESS");

            XSSFCell cell6 = (XSSFCell)headerRow.CreateCell(6);
            sheet.SetColumnWidth(6, 5000);
            cell6.CellStyle = style;
            cell6.SetCellValue("OFFICE PHONE #");

            XSSFCell cell7 = (XSSFCell)headerRow.CreateCell(7);
            sheet.SetColumnWidth(7, 5000);
            cell7.CellStyle = style;
            cell7.SetCellValue("*CELL #");

            XSSFCell cell8 = (XSSFCell)headerRow.CreateCell(8);
            sheet.SetColumnWidth(8, 5000);
            cell8.CellStyle = style;
            cell8.SetCellValue("STATUS");

            #endregion
            if (!string.IsNullOrEmpty(data.IDs))
            {
                //Get data from DB
                USERBL userHandler = new USERBL();
                List<USERDC> users = userHandler.GetUsersForExport(data.IDs);

                #region Populate Data

                int rowIndex = 1;
                foreach (USERDC user in users)
                {
                    NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
                    row.CreateCell(0).SetCellValue(user.USER_NAME);
                    row.CreateCell(1).SetCellValue(user.FIRST_NAME);
                    row.CreateCell(2).SetCellValue(user.LAST_NAME);
                    row.CreateCell(3).SetCellValue(user.ROLE.ROLE_NAME);
                    row.CreateCell(4).SetCellValue(user.USER_COMPANIES_NAMES);
                    row.CreateCell(5).SetCellValue(user.EMAIL_ADDRESS);
                    row.CreateCell(6).SetCellValue(user.OFFICE_PHONE);
                    row.CreateCell(7).SetCellValue(user.MOBILE_PHONE);
                    row.CreateCell(8).SetCellValue(user.STATUS == "Y" ? "Active" : "InActive");
                    rowIndex++;
                }

                #endregion
            }
        }

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        public static void ExportUsers(ref Table table, StandardExportData data)
        {
            Unit width, height;
            PageSetup.GetPageSize(PageFormat.A4, out width, out height);
            width = Unit.FromMillimeter(450);
            table.Section.PageSetup.PageWidth = width;
            table.Section.PageSetup.PageHeight = height;

            #region Build Header

            Column column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(1));

            Row headerRow = table.AddRow();
            Font mandateryfont = new Font();
            mandateryfont.Bold = true;
            mandateryfont.Color = new Color(139, 0, 0);

            Paragraph p = headerRow.Cells[0].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("USER NAME", TextFormat.Bold);
            p = headerRow.Cells[1].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("FIRST NAME", TextFormat.Bold);
            p = headerRow.Cells[2].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("LAST NAME", TextFormat.Bold);
            p = headerRow.Cells[3].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("USER ROLE", TextFormat.Bold);
            p = headerRow.Cells[4].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("CLIENTS", TextFormat.Bold);
            p = headerRow.Cells[5].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("EMAIL ADDRESS", TextFormat.Bold);
            p = headerRow.Cells[6].AddParagraph();
            p.AddFormattedText("OFFICE PHONE #", TextFormat.Bold);
            p = headerRow.Cells[7].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("CELL #", TextFormat.Bold);
            p = headerRow.Cells[8].AddParagraph();
            p.AddFormattedText("STATUS", TextFormat.Bold);

            #endregion
            if (!string.IsNullOrEmpty(data.IDs))
            {
                //Get data from DB
                USERBL userHandler = new USERBL();
                List<USERDC> users = userHandler.GetUsersForExport(data.IDs);

                #region Populate Data

                foreach (USERDC user in users)
                {
                    Row row = table.AddRow();
                    row.Cells[0].AddParagraph(user.USER_NAME);
                    row.Cells[1].AddParagraph(user.FIRST_NAME);
                    row.Cells[2].AddParagraph(user.LAST_NAME);
                    row.Cells[3].AddParagraph(user.ROLE.ROLE_NAME);
                    row.Cells[4].AddParagraph(user.USER_COMPANIES_NAMES);
                    row.Cells[5].AddParagraph(user.EMAIL_ADDRESS);
                    row.Cells[6].AddParagraph(user.OFFICE_PHONE);
                    row.Cells[7].AddParagraph(user.MOBILE_PHONE);
                    row.Cells[8].AddParagraph(user.STATUS == "Y" ? "Active" : "InActive");
                }

                #endregion
            }
        }

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        public static void ExportEvents(XSSFSheet sheet, StandardExportData data)
        {
            #region Build Header

            XSSFRow headerRow = (XSSFRow)sheet.CreateRow(0);
            NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
            style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
            NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
            font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
            style.SetFont(font);

            XSSFCell cell0 = (XSSFCell)headerRow.CreateCell(0);
            sheet.SetColumnWidth(0, 5000);
            cell0.CellStyle = style;
            cell0.SetCellValue("*EVENT NAME");

            XSSFCell cell1 = (XSSFCell)headerRow.CreateCell(1);
            sheet.SetColumnWidth(1, 5000);
            cell1.CellStyle = style;
            cell1.SetCellValue("*EVENT START DATE/TIME");

            XSSFCell cell2 = (XSSFCell)headerRow.CreateCell(2);
            sheet.SetColumnWidth(2, 5000);
            cell2.CellStyle = style;
            cell2.SetCellValue("*EVENT TYPE");

            XSSFCell cell3 = (XSSFCell)headerRow.CreateCell(3);
            sheet.SetColumnWidth(3, 5000);
            cell3.CellStyle = style;
            cell3.SetCellValue("*TIME ZONE");

            XSSFCell cell4 = (XSSFCell)headerRow.CreateCell(4);
            sheet.SetColumnWidth(4, 5000);
            cell4.CellStyle = style;
            cell4.SetCellValue("*STORM/EMERGENCY TYPE");

            XSSFCell cell5 = (XSSFCell)headerRow.CreateCell(5);
            sheet.SetColumnWidth(5, 5000);
            cell5.CellStyle = style;
            cell5.SetCellValue("EVENT DESCRIPTION");

            XSSFCell cell6 = (XSSFCell)headerRow.CreateCell(6);
            sheet.SetColumnWidth(6, 5000);
            cell6.CellStyle = style;
            cell6.SetCellValue("*STORM/EMERGENCY NAME");

            XSSFCell cell7 = (XSSFCell)headerRow.CreateCell(7);
            sheet.SetColumnWidth(7, 5000);
            cell7.CellStyle = style;
            cell7.SetCellValue("*REQUESTED BY RMAGs");

            XSSFCell cell8 = (XSSFCell)headerRow.CreateCell(8);
            sheet.SetColumnWidth(8, 5000);
            cell8.CellStyle = style;
            cell8.SetCellValue("*REQUESTED BY CLIENTS");

            XSSFCell cell9 = (XSSFCell)headerRow.CreateCell(9);
            sheet.SetColumnWidth(9, 5000);
            cell9.CellStyle = style;
            cell9.SetCellValue("*EVENT STATUS");

            XSSFCell cell10 = (XSSFCell)headerRow.CreateCell(10);
            sheet.SetColumnWidth(10, 5000);
            cell10.CellStyle = style;
            cell10.SetCellValue("EVENT CLOSE COMMENTS");

            XSSFCell cell11 = (XSSFCell)headerRow.CreateCell(11);
            sheet.SetColumnWidth(11, 5000);
            cell11.CellStyle = style;
            cell11.SetCellValue("EVENT CLOSE DATE/TIME");

            XSSFCell cell12 = (XSSFCell)headerRow.CreateCell(12);
            sheet.SetColumnWidth(12, 5000);
            cell12.CellStyle = style;
            cell12.SetCellValue("EVENT CLOSED BY");

            XSSFCell cell13 = (XSSFCell)headerRow.CreateCell(13);
            sheet.SetColumnWidth(13, 5000);
            cell13.CellStyle = style;
            cell13.SetCellValue("EVENT CREATED BY");

            XSSFCell cell14 = (XSSFCell)headerRow.CreateCell(14);
            sheet.SetColumnWidth(14, 5000);
            cell14.CellStyle = style;
            cell14.SetCellValue("EVENT CREATED DATE/TIME");

            #endregion
            if (!string.IsNullOrEmpty(data.IDs))
            {
                //Get data from DB
               // EVENTBL eventHandler = new EVENTBL();
            //    List<EVENTDC> events = eventHandler.GetEventsForExport(data.IDs);

                //#region Populate Data

                //int rowIndex = 1;
                //foreach (EVENTDC _event in events)
                //{
                //    NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
                //    TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_event.TIME_ZONE.LU_NAME + " Standard Time");
                //    string eventZoneSuffix = Utility.GetTimeZoneSuffix(_event.TIME_ZONE.LU_NAME);
                //    string eventName = TimeZoneInfo.ConvertTimeFromUtc(_event.START_DATE, eventZone).ToString("yyyy_MMMMdd") + "_";
                //    eventName += _event.EMERGENCY_TYPE.LU_NAME + "_";
                //    eventName += _event.EMERGENCY_NAME + "_";
                //    eventName += _event.EVENT_TYPE.LU_NAME;
                //    row.CreateCell(0).SetCellValue(eventName);

                //    row.CreateCell(1).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_event.START_DATE, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
                //    row.CreateCell(2).SetCellValue(_event.EVENT_TYPE.LU_NAME);
                //    row.CreateCell(3).SetCellValue(_event.TIME_ZONE.LU_NAME);
                //    row.CreateCell(4).SetCellValue(_event.EMERGENCY_TYPE.LU_NAME);
                //    row.CreateCell(5).SetCellValue((!String.IsNullOrEmpty(_event.OTHER_DESCRIPTION)) ? _event.OTHER_DESCRIPTION : "");
                //    row.CreateCell(6).SetCellValue(_event.EMERGENCY_NAME);
                //    row.CreateCell(7).SetCellValue(_event.EVENTS_REQ_BY_RMAGS_NAMES);
                //    row.CreateCell(8).SetCellValue(_event.EVENTS_REQ_BY_COMPANIES_NAMES);
                //    row.CreateCell(9).SetCellValue(_event.STATUS.LU_NAME);
                //    row.CreateCell(10).SetCellValue((!String.IsNullOrEmpty(_event.CLOSED_COMMENTS))?_event.CLOSED_COMMENTS:"");
                //    if (_event.STATUS.LOOK_UP_ID == 40 && _event.CLOSED_ON != null)
                //    {
                //        row.CreateCell(11).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_event.CLOSED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
                //    }
                //    else {
                //        row.CreateCell(11).SetCellValue("");
                //    }
                //    row.CreateCell(12).SetCellValue(_event.MODIFIED_NAME);
                //    row.CreateCell(13).SetCellValue(_event.CREATED_NAME);
                //    row.CreateCell(14).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_event.CREATED_ON, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
                //    rowIndex++;
                //}

                //#endregion
            }
        }

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportEvents(ref Table table, StandardExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(750);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));

        //    Row headerRow = table.AddRow();
        //    Paragraph p = headerRow.Cells[0].AddParagraph();
        //    Font mandateryfont = new Font();
        //    mandateryfont.Bold = true;
        //    mandateryfont.Color = new Color(139, 0, 0);
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("EVENT NAME", TextFormat.Bold);
        //    p = headerRow.Cells[1].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("EVENT START DATE/TIME", TextFormat.Bold);
        //    p = headerRow.Cells[2].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("EVENT TYPE", TextFormat.Bold);
        //    p = headerRow.Cells[3].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("TIME ZONE", TextFormat.Bold);
        //    p = headerRow.Cells[4].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("STORM/EMERGENCY TYPE", TextFormat.Bold);
        //    p = headerRow.Cells[5].AddParagraph();
        //    p.AddFormattedText("EVENT DESCRIPTION", TextFormat.Bold);
        //    p = headerRow.Cells[6].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("STORM/EMERGENCY NAME", TextFormat.Bold);
        //    p = headerRow.Cells[7].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("REQUESTED BY RMAGs", TextFormat.Bold);
        //    p = headerRow.Cells[8].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("REQUESTED BY CLIENTS", TextFormat.Bold);
        //    p = headerRow.Cells[9].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("EVENT STATUS", TextFormat.Bold);
        //    p = headerRow.Cells[10].AddParagraph();
        //    p.AddFormattedText("EVENT CLOSE COMMENTS", TextFormat.Bold);
        //    p = headerRow.Cells[11].AddParagraph();
        //    p.AddFormattedText("EVENT CLOSE DATE/TIME", TextFormat.Bold);
        //    p = headerRow.Cells[12].AddParagraph();
        //    p.AddFormattedText("EVENT CLOSED BY", TextFormat.Bold);
        //    p = headerRow.Cells[13].AddParagraph();
        //    p.AddFormattedText("EVENT CREATED BY", TextFormat.Bold);
        //    p = headerRow.Cells[14].AddParagraph();
        //    p.AddFormattedText("EVENT CREATED DATE/TIME", TextFormat.Bold);

        //    #endregion
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        //EVENTBL eventHandler = new EVENTBL();
        //        //List<EVENTDC> events = eventHandler.GetEventsForExport(data.IDs);

        //        #region Populate Data

        //        foreach (EVENTDC _event in events)
        //        {
        //            Row row = table.AddRow();
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_event.TIME_ZONE.LU_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_event.TIME_ZONE.LU_NAME);

        //            string eventName = TimeZoneInfo.ConvertTimeFromUtc(_event.START_DATE, eventZone).ToString("yyyy_MMMMdd") + "_";
        //            eventName += _event.EMERGENCY_TYPE.LU_NAME + "_";
        //            eventName += _event.EMERGENCY_NAME + "_";
        //            eventName += _event.EVENT_TYPE.LU_NAME;
        //            row.Cells[0].AddParagraph(eventName);

        //            row.Cells[1].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_event.START_DATE, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[2].AddParagraph(_event.EVENT_TYPE.LU_NAME);
        //            row.Cells[3].AddParagraph(_event.TIME_ZONE.LU_NAME);
        //            row.Cells[4].AddParagraph(_event.EMERGENCY_TYPE.LU_NAME);
        //            row.Cells[5].AddParagraph((!String.IsNullOrEmpty(_event.OTHER_DESCRIPTION))?_event.OTHER_DESCRIPTION:"");
        //            row.Cells[6].AddParagraph(_event.EMERGENCY_NAME);
        //            row.Cells[7].AddParagraph(_event.EVENTS_REQ_BY_RMAGS_NAMES);
        //            row.Cells[8].AddParagraph(_event.EVENTS_REQ_BY_COMPANIES_NAMES);
        //            row.Cells[9].AddParagraph(_event.STATUS.LU_NAME);
        //            row.Cells[10].AddParagraph((!String.IsNullOrEmpty(_event.CLOSED_COMMENTS)) ? _event.CLOSED_COMMENTS : "");
        //            if (_event.STATUS.LOOK_UP_ID == 40 && _event.CLOSED_ON != null)
        //            {
        //                row.Cells[11].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_event.CLOSED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            }
        //            else {
        //                row.Cells[11].AddParagraph("");
        //            }
        //            row.Cells[12].AddParagraph(_event.MODIFIED_NAME);
        //            row.Cells[13].AddParagraph(_event.CREATED_NAME);
        //            row.Cells[14].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_event.CREATED_ON, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //        }

        //        #endregion
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportRequests(XSSFSheet sheet, StandardExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell1_0 = (XSSFCell)headerRow1.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0_0.CellStyle = fontOnlyStyle;
        //    cell1_0.CellStyle = fontAndBorderStyle;
        //    cell0_0.SetCellValue("*COMPANY REQUESTING RESOURCES");
        //    var cra0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    sheet.AddMergedRegion(cra0);

        //    XSSFCell cell0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell1_1 = (XSSFCell)headerRow1.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell0_1.CellStyle = fontOnlyStyle;
        //    cell1_1.CellStyle = fontAndBorderStyle;
        //    cell0_1.SetCellValue("*RMAG");
        //    var cra1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    sheet.AddMergedRegion(cra1);

           

        //    XSSFCell cell0_7 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    cell0_7.CellStyle = fontOnlyStyle;
        //    cell0_7.SetCellValue("RESOURCE REQUESTS BY RESOURCE TYPE");
        //    var cra7 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 7);
        //    sheet.AddMergedRegion(cra7);

        //    XSSFCell cell1_7 = (XSSFCell)headerRow1.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell1_7.CellStyle = fontAndBorderStyle;
        //    cell1_7.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_8 = (XSSFCell)headerRow1.CreateCell(3);
        //    sheet.SetColumnWidth(3, 5000);
        //    cell1_8.CellStyle = fontAndBorderStyle;
        //    cell1_8.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_9 = (XSSFCell)headerRow1.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell1_9.CellStyle = fontAndBorderStyle;
        //    cell1_9.SetCellValue("DAMAGE");

        //    XSSFCell cell1_10 = (XSSFCell)headerRow1.CreateCell(5);
        //    sheet.SetColumnWidth(5, 5000);
        //    cell1_10.CellStyle = fontAndBorderStyle;
        //    cell1_10.SetCellValue("TREE");

        //    XSSFCell cell1_11 = (XSSFCell)headerRow1.CreateCell(6);
        //    sheet.SetColumnWidth(6, 5000);
        //    cell1_11.CellStyle = fontAndBorderStyle;
        //    cell1_11.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_12 = (XSSFCell)headerRow1.CreateCell(7);
        //    sheet.SetColumnWidth(7, 5000);
        //    cell1_12.CellStyle = fontAndBorderStyle;
        //    cell1_12.SetCellValue("NET UG");

        //    XSSFCell cell0_13 = (XSSFCell)headerRow0_0.CreateCell(8);
        //    XSSFCell cell1_13 = (XSSFCell)headerRow1.CreateCell(8);
        //    sheet.SetColumnWidth(8, 5000);
        //    cell0_13.CellStyle = fontOnlyStyle;
        //    cell1_13.CellStyle = fontAndBorderStyle;
        //    cell0_13.SetCellValue("CUSTOMER OUTAGES");
        //    var cra13 = new NPOI.SS.Util.CellRangeAddress(0, 1, 8, 8);
        //    sheet.AddMergedRegion(cra13);

        //    XSSFCell cell0_14 = (XSSFCell)headerRow0_0.CreateCell(9);
        //    XSSFCell cell1_14 = (XSSFCell)headerRow1.CreateCell(9);
        //    sheet.SetColumnWidth(9, 5000);
        //    cell0_14.CellStyle = fontOnlyStyle;
        //    cell1_14.CellStyle = fontAndBorderStyle;
        //    cell0_14.SetCellValue("CASES OF TROUBLE");
        //    var cra14 = new NPOI.SS.Util.CellRangeAddress(0, 1, 9, 9);
        //    sheet.AddMergedRegion(cra14);

        //    XSSFCell cell0_15 = (XSSFCell)headerRow0_0.CreateCell(10);
        //    XSSFCell cell1_15 = (XSSFCell)headerRow1.CreateCell(10);
        //    sheet.SetColumnWidth(10, 5000);
        //    cell0_15.CellStyle = fontOnlyStyle;
        //    cell1_15.CellStyle = fontAndBorderStyle;
        //    cell0_15.SetCellValue("LATEST TARGET ARRIVAL DATE/TIME");
        //    var cra15 = new NPOI.SS.Util.CellRangeAddress(0, 1, 10, 10);
        //    sheet.AddMergedRegion(cra15);

        //    XSSFCell cell0_16 = (XSSFCell)headerRow0_0.CreateCell(11);
        //    cell0_16.CellStyle = fontOnlyStyle;
        //    cell0_16.SetCellValue("NON-NATIVE FTE RESOURCES ACQUIRED");
        //    var cra16 = new NPOI.SS.Util.CellRangeAddress(0, 0, 11, 16);
        //    sheet.AddMergedRegion(cra16);

        //    XSSFCell cell1_16 = (XSSFCell)headerRow1.CreateCell(11);
        //    sheet.SetColumnWidth(11, 5000);
        //    cell1_16.CellStyle = fontAndBorderStyle;
        //    cell1_16.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_17 = (XSSFCell)headerRow1.CreateCell(12);
        //    sheet.SetColumnWidth(12, 5000);
        //    cell1_17.CellStyle = fontAndBorderStyle;
        //    cell1_17.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_18 = (XSSFCell)headerRow1.CreateCell(13);
        //    sheet.SetColumnWidth(13, 5000);
        //    cell1_18.CellStyle = fontAndBorderStyle;
        //    cell1_18.SetCellValue("DAMAGE");

        //    XSSFCell cell1_19 = (XSSFCell)headerRow1.CreateCell(14);
        //    sheet.SetColumnWidth(14, 5000);
        //    cell1_19.CellStyle = fontAndBorderStyle;
        //    cell1_19.SetCellValue("TREE");

        //    XSSFCell cell1_20 = (XSSFCell)headerRow1.CreateCell(15);
        //    sheet.SetColumnWidth(15, 5000);
        //    cell1_20.CellStyle = fontAndBorderStyle;
        //    cell1_20.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_21 = (XSSFCell)headerRow1.CreateCell(16);
        //    sheet.SetColumnWidth(16, 5000);
        //    cell1_21.CellStyle = fontAndBorderStyle;
        //    cell1_21.SetCellValue("NET UG");

        //   ///////////////////

        //    XSSFCell cell0_2 = (XSSFCell)headerRow0_0.CreateCell(17);
        //    cell0_2.CellStyle = fontOnlyStyle;
        //    cell0_2.SetCellValue("CLIENT INFORMATION");
        //    var cra2 = new NPOI.SS.Util.CellRangeAddress(0, 0,17, 21);
        //    sheet.AddMergedRegion(cra2);

        //    XSSFCell cell1_2 = (XSSFCell)headerRow1.CreateCell(17);
        //    sheet.SetColumnWidth(17, 5000);
        //    cell1_2.CellStyle = fontAndBorderStyle;
        //    cell1_2.SetCellValue("CONTACT NAME");

        //    XSSFCell cell1_3 = (XSSFCell)headerRow1.CreateCell(18);
        //    sheet.SetColumnWidth(18, 10000);
        //    cell1_3.CellStyle = fontAndBorderStyle;
        //    cell1_3.SetCellValue("CONTACT EMAIL");

        //    XSSFCell cell1_4 = (XSSFCell)headerRow1.CreateCell(19);
        //    sheet.SetColumnWidth(19, 5000);
        //    cell1_4.CellStyle = fontAndBorderStyle;
        //    cell1_4.SetCellValue("CITY");

        //    XSSFCell cell1_5 = (XSSFCell)headerRow1.CreateCell(20);
        //    sheet.SetColumnWidth(20, 5000);
        //    cell1_5.CellStyle = fontAndBorderStyle;
        //    cell1_5.SetCellValue("STATE");

        //    XSSFCell cell1_6 = (XSSFCell)headerRow1.CreateCell(21);
        //    sheet.SetColumnWidth(21, 5000);
        //    cell1_6.CellStyle = fontAndBorderStyle;
        //    cell1_6.SetCellValue("CLIENT PHONE #");

        //    ////////////////////////////

        //    XSSFCell cell0_22 = (XSSFCell)headerRow0_0.CreateCell(22);
        //    XSSFCell cell1_22 = (XSSFCell)headerRow1.CreateCell(22);
        //    sheet.SetColumnWidth(22, 5000);
        //    cell0_22.CellStyle = fontOnlyStyle;
        //    cell1_22.CellStyle = fontAndBorderStyle;
        //    cell0_22.SetCellValue("LAST UPDATED BY");
        //    var cra22 = new NPOI.SS.Util.CellRangeAddress(0, 1, 22, 22);
        //    sheet.AddMergedRegion(cra22);

        //    XSSFCell cell0_23 = (XSSFCell)headerRow0_0.CreateCell(23);
        //    XSSFCell cell1_23 = (XSSFCell)headerRow1.CreateCell(23);
        //    sheet.SetColumnWidth(23, 5000);
        //    cell0_23.CellStyle = fontOnlyStyle;
        //    cell1_23.CellStyle = fontAndBorderStyle;
        //    cell0_23.SetCellValue("LAST UPDATED DATE/TIME");
        //    var cra23 = new NPOI.SS.Util.CellRangeAddress(0, 1, 23, 23);
        //    sheet.AddMergedRegion(cra23);

        //    XSSFCell cell0_24 = (XSSFCell)headerRow0_0.CreateCell(24);
        //    XSSFCell cell1_24 = (XSSFCell)headerRow1.CreateCell(24);
        //    sheet.SetColumnWidth(24, 5000);
        //    cell0_24.CellStyle = fontOnlyStyle;
        //    cell1_24.CellStyle = fontAndBorderStyle;
        //    cell0_24.SetCellValue("*STATUS");
        //    var cra24 = new NPOI.SS.Util.CellRangeAddress(0, 1, 24, 24);
        //    sheet.AddMergedRegion(cra24);

        //    XSSFCell cell0_25 = (XSSFCell)headerRow0_0.CreateCell(25);
        //    XSSFCell cell1_25 = (XSSFCell)headerRow1.CreateCell(25);
        //    sheet.SetColumnWidth(25, 5000);
        //    cell0_25.CellStyle = fontOnlyStyle;
        //    cell1_25.CellStyle = fontAndBorderStyle;
        //    cell0_25.SetCellValue("CALCULATION RUN");
        //    var cra25 = new NPOI.SS.Util.CellRangeAddress(0, 1, 25, 25);
        //    sheet.AddMergedRegion(cra25);

        //    #endregion

        //    //Set freeze columns
        //    sheet.CreateFreezePane(2, 0);
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        REQUESTBL requestHandler = new REQUESTBL();
        //        List<REQUESTDC> requests = requestHandler.GetRequestsForExport(data.IDs);

        //        #region Populate Data
        //        NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //        NPOI.SS.UserModel.ICell cell;
        //        int rowIndex = 2;
        //        foreach (REQUESTDC _request in requests)
        //        {
        //            NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_request.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_request.EVENT_TIME_ZONE_NAME);
        //            row.CreateCell(0).SetCellValue(_request.COMPANY.COMPANY_NAME);
        //            //row.CreateCell(1).SetCellValue(_request.COMPANY.RMAG.RMAG_NAME);
        //            cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_request.DISTRIBUTION == null ? "" : _request.DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TRANSMISSION == null ? "" : _request.TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_request.DAMAGE_ASSESSMENT == null ? "" : _request.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TREE == null ? "" : _request.TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_request.SUBSTATION == null ? "" : _request.SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NET_UG == null ? "" : _request.NET_UG.Value.ToString("#,##0"));
        //            cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_request.CUSTOMER_OUTAGES == null ? "" : _request.CUSTOMER_OUTAGES.Value.ToString("#,##0"));
        //            cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TROUBLE_CASES == null ? "" : _request.TROUBLE_CASES.Value.ToString("#,##0"));
        //            row.CreateCell(10).SetCellValue(_request.LATEST_TARGET_ARRIVAL == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.LATEST_TARGET_ARRIVAL.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_DISTRIBUTION == null ? "" : _request.NON_NATIVE_DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_TRANSMISSION == null ? "" : _request.NON_NATIVE_TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "" : _request.NON_NATIVE_DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_TREE == null ? "" : _request.NON_NATIVE_TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_SUBSTATION == null ? "" : _request.NON_NATIVE_SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(16); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_NET_UG == null ? "" : _request.NON_NATIVE_NET_UG.Value.ToString("#,##0"));
        //            row.CreateCell(17).SetCellValue(_request.COMPANY_CONTACT);
        //            row.CreateCell(18).SetCellValue(_request.COMPANY_EMAIL);
        //            row.CreateCell(19).SetCellValue(_request.COMPANY_CITY);
        //            row.CreateCell(20).SetCellValue(_request.COMPANY_STATE);
        //            row.CreateCell(21).SetCellValue(_request.COMPANY_CELLPHONE);
        //            row.CreateCell(22).SetCellValue(_request.MODIFIED_BY);
        //            row.CreateCell(23).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_request.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.CreateCell(24).SetCellValue(_request.STATUS_LU.LU_NAME);
        //            row.CreateCell(25).SetCellValue(_request.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            rowIndex++;
        //        }

        //        #endregion
        //    }
        //}

        ///// <summary>
        ///// Export to PDF
        ///// </summary>
        ///// <param name="table"></param>
        ///// <param name="data"></param>
        //public static void ExportRequests(ref Table table, StandardExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(1170);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.0));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));

        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow1 = table.AddRow();

        //    headerRow0_0.Cells[0].MergeDown = 1;
        //    Paragraph p = headerRow0_0.Cells[0].AddParagraph();
        //    Font mandateryfont = new Font();
        //    mandateryfont.Bold = true;
        //    mandateryfont.Color = new Color(139, 0, 0);
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("CLIENT REQUESTING RESOURCES", TextFormat.Bold);

        //    headerRow0_0.Cells[1].MergeDown = 1;
        //    p = headerRow0_0.Cells[1].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("RMAG", TextFormat.Bold);


        //    headerRow0_0.Cells[2].MergeRight = 5;
        //    p = headerRow0_0.Cells[2].AddParagraph();
        //    p.AddFormattedText("RESOURCE REQUESTS BY RESOURCE TYPE", TextFormat.Bold);

        //    p = headerRow1.Cells[2].AddParagraph();
        //    p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //    p = headerRow1.Cells[3].AddParagraph();
        //    p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //    p = headerRow1.Cells[4].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[5].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[6].AddParagraph();
        //    p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //    p = headerRow1.Cells[7].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    headerRow0_0.Cells[8].MergeDown = 1;
        //    p = headerRow0_0.Cells[8].AddParagraph();
        //    p.AddFormattedText("CUSTOMER OUTAGES", TextFormat.Bold);

        //    headerRow0_0.Cells[9].MergeDown = 1;
        //    p = headerRow0_0.Cells[9].AddParagraph();
        //    p.AddFormattedText("CASES OF TROUBLE", TextFormat.Bold);

        //    headerRow0_0.Cells[10].MergeDown = 1;
        //    p = headerRow0_0.Cells[10].AddParagraph();
        //    p.AddFormattedText("LATEST TARGET ARRIVAL DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[11].MergeRight = 5;
        //    p = headerRow0_0.Cells[11].AddParagraph();
        //    p.AddFormattedText("NON-NATIVE FTE RESOURCES ACQUIRED", TextFormat.Bold);

        //    p = headerRow1.Cells[11].AddParagraph();
        //    p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //    p = headerRow1.Cells[12].AddParagraph();
        //    p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //    p = headerRow1.Cells[13].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[14].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[15].AddParagraph();
        //    p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //    p = headerRow1.Cells[16].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);


        //    ////////////////////////
        //    headerRow0_0.Cells[17].MergeRight = 4;
        //    p = headerRow0_0.Cells[17].AddParagraph();
        //    p.AddFormattedText("CLIENT INFORMATION", TextFormat.Bold);

        //    p = headerRow1.Cells[17].AddParagraph();
        //    p.AddFormattedText("CONTACT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[18].AddParagraph();
        //    p.AddFormattedText("CONTACT EMAIL", TextFormat.Bold);

        //    p = headerRow1.Cells[19].AddParagraph();
        //    p.AddFormattedText("CITY", TextFormat.Bold);

        //    p = headerRow1.Cells[20].AddParagraph();
        //    p.AddFormattedText("STATE", TextFormat.Bold);

        //    p = headerRow1.Cells[21].AddParagraph();
        //    p.AddFormattedText("CLIENT PHONE #", TextFormat.Bold);

        //    ////////////////////

        //    headerRow0_0.Cells[22].MergeDown = 1;
        //    p = headerRow0_0.Cells[22].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED BY", TextFormat.Bold);

        //    headerRow0_0.Cells[23].MergeDown = 1;
        //    p = headerRow0_0.Cells[23].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[24].MergeDown = 1;
        //    p = headerRow0_0.Cells[24].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("STATUS", TextFormat.Bold);

        //    headerRow0_0.Cells[25].MergeDown = 1;
        //    p = headerRow0_0.Cells[25].AddParagraph();
        //    p.AddFormattedText("CALCULATION RUN", TextFormat.Bold);

        //    #endregion
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        REQUESTBL requestHandler = new REQUESTBL();
        //        List<REQUESTDC> requests = requestHandler.GetRequestsForExport(data.IDs);

        //        #region Populate Data

        //        foreach (REQUESTDC _request in requests)
        //        {
        //            Row row = table.AddRow();
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_request.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_request.EVENT_TIME_ZONE_NAME);

        //            row.Cells[0].AddParagraph(_request.COMPANY.COMPANY_NAME);
        //            //row.Cells[1].AddParagraph(_request.COMPANY.RMAG.RMAG_NAME);
                   
        //            row.Cells[2].AddParagraph(_request.DISTRIBUTION == null ? "" : _request.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[3].AddParagraph(_request.TRANSMISSION == null ? "" : _request.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[4].AddParagraph(_request.DAMAGE_ASSESSMENT == null ? "" : _request.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[5].AddParagraph(_request.TREE == null ? "" : _request.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[6].AddParagraph(_request.SUBSTATION == null ? "" : _request.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[7].AddParagraph(_request.NET_UG == null ? "" : _request.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[8].AddParagraph(_request.CUSTOMER_OUTAGES == null ? "" : _request.CUSTOMER_OUTAGES.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[9].AddParagraph(_request.TROUBLE_CASES == null ? "" : _request.TROUBLE_CASES.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[10].AddParagraph(_request.LATEST_TARGET_ARRIVAL == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.LATEST_TARGET_ARRIVAL.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            row.Cells[11].AddParagraph(_request.NON_NATIVE_DISTRIBUTION == null ? "" : _request.NON_NATIVE_DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[12].AddParagraph(_request.NON_NATIVE_TRANSMISSION == null ? "" : _request.NON_NATIVE_TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[13].AddParagraph(_request.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "" : _request.NON_NATIVE_DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[14].AddParagraph(_request.NON_NATIVE_TREE == null ? "" : _request.NON_NATIVE_TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[15].AddParagraph(_request.NON_NATIVE_SUBSTATION == null ? "" : _request.NON_NATIVE_SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[16].AddParagraph(_request.NON_NATIVE_NET_UG == null ? "" : _request.NON_NATIVE_NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[17].AddParagraph(_request.COMPANY_CONTACT);
        //            row.Cells[18].AddParagraph(_request.COMPANY_EMAIL);
        //            row.Cells[19].AddParagraph(_request.COMPANY_CITY);
        //            row.Cells[20].AddParagraph(_request.COMPANY_STATE == null ? "" : _request.COMPANY_STATE);
        //            row.Cells[21].AddParagraph(_request.COMPANY_CELLPHONE);
        //            row.Cells[22].AddParagraph(_request.MODIFIED_BY);
        //            row.Cells[23].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_request.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[24].AddParagraph(_request.STATUS_LU.LU_NAME);
        //            row.Cells[25].AddParagraph(_request.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //        }

        //        #endregion
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportNonIOURequests(XSSFSheet sheet, StandardExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell1_0 = (XSSFCell)headerRow1.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0_0.CellStyle = fontOnlyStyle;
        //    cell1_0.CellStyle = fontAndBorderStyle;
        //    cell0_0.SetCellValue("*CLIENT NAME");
        //    var cra0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    sheet.AddMergedRegion(cra0);

        //    XSSFCell cell0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell1_1 = (XSSFCell)headerRow1.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell0_1.CellStyle = fontOnlyStyle;
        //    cell1_1.CellStyle = fontAndBorderStyle;
        //    cell0_1.SetCellValue("*RMAG");
        //    var cra1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    sheet.AddMergedRegion(cra1);

        //    XSSFCell cell0_2 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    cell0_2.CellStyle = fontOnlyStyle;
        //    cell0_2.SetCellValue("CLIENT INFORMATION");
        //    var cra2 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 6);
        //    sheet.AddMergedRegion(cra2);

        //    XSSFCell cell1_2 = (XSSFCell)headerRow1.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell1_2.CellStyle = fontAndBorderStyle;
        //    cell1_2.SetCellValue("CONTACT NAME");

        //    XSSFCell cell1_3 = (XSSFCell)headerRow1.CreateCell(3);
        //    sheet.SetColumnWidth(3, 10000);
        //    cell1_3.CellStyle = fontAndBorderStyle;
        //    cell1_3.SetCellValue("CONTACT EMAIL");

        //    XSSFCell cell1_4 = (XSSFCell)headerRow1.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell1_4.CellStyle = fontAndBorderStyle;
        //    cell1_4.SetCellValue("CITY");

        //    XSSFCell cell1_5 = (XSSFCell)headerRow1.CreateCell(5);
        //    sheet.SetColumnWidth(5, 5000);
        //    cell1_5.CellStyle = fontAndBorderStyle;
        //    cell1_5.SetCellValue("STATE");

        //    XSSFCell cell1_6 = (XSSFCell)headerRow1.CreateCell(6);
        //    sheet.SetColumnWidth(6, 5000);
        //    cell1_6.CellStyle = fontAndBorderStyle;
        //    cell1_6.SetCellValue("ZIP");

        //    XSSFCell cell1_7 = (XSSFCell)headerRow1.CreateCell(7);
        //    sheet.SetColumnWidth(7, 5000);
        //    cell1_7.CellStyle = fontAndBorderStyle;
        //    cell1_7.SetCellValue("CLIENT PHONE");

        //    XSSFCell cell0_8 = (XSSFCell)headerRow0_0.CreateCell(8);
        //    cell0_8.CellStyle = fontOnlyStyle;
        //    cell0_8.SetCellValue("RESOURCE REQUESTS BY RESOURCE TYPE");
        //    var cra8 = new NPOI.SS.Util.CellRangeAddress(0, 0, 8, 13);
        //    sheet.AddMergedRegion(cra8);

        //    XSSFCell cell1_8 = (XSSFCell)headerRow1.CreateCell(8);
        //    sheet.SetColumnWidth(8, 5000);
        //    cell1_8.CellStyle = fontAndBorderStyle;
        //    cell1_8.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_9 = (XSSFCell)headerRow1.CreateCell(9);
        //    sheet.SetColumnWidth(9, 5000);
        //    cell1_9.CellStyle = fontAndBorderStyle;
        //    cell1_9.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_10 = (XSSFCell)headerRow1.CreateCell(10);
        //    sheet.SetColumnWidth(10, 5000);
        //    cell1_10.CellStyle = fontAndBorderStyle;
        //    cell1_10.SetCellValue("DAMAGE");

        //    XSSFCell cell1_11 = (XSSFCell)headerRow1.CreateCell(11);
        //    sheet.SetColumnWidth(11, 5000);
        //    cell1_11.CellStyle = fontAndBorderStyle;
        //    cell1_11.SetCellValue("TREE");

        //    XSSFCell cell1_12 = (XSSFCell)headerRow1.CreateCell(12);
        //    sheet.SetColumnWidth(12, 5000);
        //    cell1_12.CellStyle = fontAndBorderStyle;
        //    cell1_12.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_13 = (XSSFCell)headerRow1.CreateCell(13);
        //    sheet.SetColumnWidth(13, 5000);
        //    cell1_13.CellStyle = fontAndBorderStyle;
        //    cell1_13.SetCellValue("NET UG");

        //    XSSFCell cell0_14 = (XSSFCell)headerRow0_0.CreateCell(14);
        //    XSSFCell cell1_14 = (XSSFCell)headerRow1.CreateCell(14);
        //    sheet.SetColumnWidth(14, 5000);
        //    cell0_14.CellStyle = fontOnlyStyle;
        //    cell1_14.CellStyle = fontAndBorderStyle;
        //    cell0_14.SetCellValue("CUSTOMER OUTAGES");
        //    var cra14 = new NPOI.SS.Util.CellRangeAddress(0, 1, 14, 14);
        //    sheet.AddMergedRegion(cra14);

        //    XSSFCell cell0_15 = (XSSFCell)headerRow0_0.CreateCell(15);
        //    XSSFCell cell1_15 = (XSSFCell)headerRow1.CreateCell(15);
        //    sheet.SetColumnWidth(15, 5000);
        //    cell0_15.CellStyle = fontOnlyStyle;
        //    cell1_15.CellStyle = fontAndBorderStyle;
        //    cell0_15.SetCellValue("CASES OF TROUBLE");
        //    var cra15 = new NPOI.SS.Util.CellRangeAddress(0, 1, 15, 15);
        //    sheet.AddMergedRegion(cra15);

        //    XSSFCell cell0_16 = (XSSFCell)headerRow0_0.CreateCell(16);
        //    XSSFCell cell1_16 = (XSSFCell)headerRow1.CreateCell(16);
        //    sheet.SetColumnWidth(16, 5000);
        //    cell0_16.CellStyle = fontOnlyStyle;
        //    cell1_16.CellStyle = fontAndBorderStyle;
        //    cell0_16.SetCellValue("LATEST TARGET ARRIVAL DATE/TIME");
        //    var cra16 = new NPOI.SS.Util.CellRangeAddress(0, 1, 16, 16);
        //    sheet.AddMergedRegion(cra16);

        //    XSSFCell cell0_17 = (XSSFCell)headerRow0_0.CreateCell(17);
        //    cell0_17.CellStyle = fontOnlyStyle;
        //    cell0_17.SetCellValue("NON-NATIVE FTE RESOURCES ACQUIRED");
        //    var cra17 = new NPOI.SS.Util.CellRangeAddress(0, 0, 17, 22);
        //    sheet.AddMergedRegion(cra17);

        //    XSSFCell cell1_17 = (XSSFCell)headerRow1.CreateCell(17);
        //    sheet.SetColumnWidth(17, 5000);
        //    cell1_17.CellStyle = fontAndBorderStyle;
        //    cell1_17.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_18 = (XSSFCell)headerRow1.CreateCell(18);
        //    sheet.SetColumnWidth(18, 5000);
        //    cell1_18.CellStyle = fontAndBorderStyle;
        //    cell1_18.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_19 = (XSSFCell)headerRow1.CreateCell(19);
        //    sheet.SetColumnWidth(19, 5000);
        //    cell1_19.CellStyle = fontAndBorderStyle;
        //    cell1_19.SetCellValue("DAMAGE");

        //    XSSFCell cell1_20 = (XSSFCell)headerRow1.CreateCell(20);
        //    sheet.SetColumnWidth(20, 5000);
        //    cell1_20.CellStyle = fontAndBorderStyle;
        //    cell1_20.SetCellValue("TREE");

        //    XSSFCell cell1_21 = (XSSFCell)headerRow1.CreateCell(21);
        //    sheet.SetColumnWidth(21, 5000);
        //    cell1_21.CellStyle = fontAndBorderStyle;
        //    cell1_21.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_22 = (XSSFCell)headerRow1.CreateCell(22);
        //    sheet.SetColumnWidth(22, 5000);
        //    cell1_22.CellStyle = fontAndBorderStyle;
        //    cell1_22.SetCellValue("NET UG");

        //    XSSFCell cell0_23 = (XSSFCell)headerRow0_0.CreateCell(23);
        //    XSSFCell cell1_23 = (XSSFCell)headerRow1.CreateCell(23);
        //    sheet.SetColumnWidth(23, 5000);
        //    cell0_23.CellStyle = fontOnlyStyle;
        //    cell1_23.CellStyle = fontAndBorderStyle;
        //    cell0_23.SetCellValue("LAST UPDATED BY");
        //    var cra23 = new NPOI.SS.Util.CellRangeAddress(0, 1, 23, 23);
        //    sheet.AddMergedRegion(cra23);

        //    XSSFCell cell0_24 = (XSSFCell)headerRow0_0.CreateCell(24);
        //    XSSFCell cell1_24 = (XSSFCell)headerRow1.CreateCell(24);
        //    sheet.SetColumnWidth(24, 5000);
        //    cell0_24.CellStyle = fontOnlyStyle;
        //    cell1_24.CellStyle = fontAndBorderStyle;
        //    cell0_24.SetCellValue("LAST UPDATED DATE/TIME");
        //    var cra24 = new NPOI.SS.Util.CellRangeAddress(0, 1, 24, 24);
        //    sheet.AddMergedRegion(cra24);

        //    #endregion

        //    //Set freeze columns
        //    sheet.CreateFreezePane(2, 0);
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        NONIOU_REQUESTBL noniourequestHandler = new NONIOU_REQUESTBL();
        //        List<NONIOU_REQUESTDC> requests = noniourequestHandler.GetNonIOURequestsForExport(data.IDs);

        //        #region Populate Data

        //        int rowIndex = 2;
        //        NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //        NPOI.SS.UserModel.ICell cell;
        //        foreach (NONIOU_REQUESTDC _request in requests)
        //        {
        //            NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);


        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_request.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_request.EVENT_TIME_ZONE_NAME);
        //            row.CreateCell(0).SetCellValue(_request.COMPANY_NAME);
        //            row.CreateCell(1).SetCellValue(_request.RMAG.RMAG_NAME);
        //            row.CreateCell(2).SetCellValue(_request.COMPANY_CONTACT);
        //            row.CreateCell(3).SetCellValue(_request.COMPANY_EMAIL);
        //            row.CreateCell(4).SetCellValue(_request.COMPANY_CITY);
        //            row.CreateCell(5).SetCellValue(_request.COMPANY_STATE);
        //            row.CreateCell(6).SetCellValue(_request.COMPANY_ZIP);
        //            row.CreateCell(7).SetCellValue(_request.COMPANY_CELLPHONE);
        //            cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_request.DISTRIBUTION == null ? "" : _request.DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TRANSMISSION == null ? "" : _request.TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_request.DAMAGE_ASSESSMENT == null ? "" : _request.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TREE == null ? "" : _request.TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_request.SUBSTATION == null ? "" : _request.SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NET_UG == null ? "" : _request.NET_UG.Value.ToString("#,##0"));
        //            cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_request.CUSTOMER_OUTAGES == null ? "" : _request.CUSTOMER_OUTAGES.Value.ToString("#,##0"));
        //            cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_request.TROUBLE_CASES == null ? "" : _request.TROUBLE_CASES.Value.ToString("#,##0"));
        //            row.CreateCell(16).SetCellValue(_request.LATEST_TARGET_ARRIVAL == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.LATEST_TARGET_ARRIVAL.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            cell = row.CreateCell(17); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_DISTRIBUTION == null ? "" : _request.NON_NATIVE_DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(18); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_TRANSMISSION == null ? "" : _request.NON_NATIVE_TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(19); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "" : _request.NON_NATIVE_DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(20); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_TREE == null ? "" : _request.NON_NATIVE_TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(21); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_SUBSTATION == null ? "" : _request.NON_NATIVE_SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(22); cell.CellStyle = numberStyle; cell.SetCellValue(_request.NON_NATIVE_NET_UG == null ? "" : _request.NON_NATIVE_NET_UG.Value.ToString("#,##0"));
        //            row.CreateCell(23).SetCellValue(_request.MODIFIED_BY);
        //            row.CreateCell(24).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_request.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            rowIndex++;
        //        }

        //        #endregion
        //    }
        //}

        ///// <summary>
        ///// Export to PDF
        ///// </summary>
        ///// <param name="table"></param>
        ///// <param name="data"></param>
        //public static void ExportNonIOURequests(ref Table table, StandardExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(1170);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.0));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));

        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow1 = table.AddRow();

        //    headerRow0_0.Cells[0].MergeDown = 1;
        //    Paragraph p = headerRow0_0.Cells[0].AddParagraph();
        //    Font mandateryfont = new Font();
        //    mandateryfont.Bold = true;
        //    mandateryfont.Color = new Color(139, 0, 0);
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("CLIENT NAME", TextFormat.Bold);

        //    headerRow0_0.Cells[1].MergeDown = 1;
        //    p = headerRow0_0.Cells[1].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("RMAG", TextFormat.Bold);

        //    headerRow0_0.Cells[2].MergeRight = 5;
        //    p = headerRow0_0.Cells[2].AddParagraph();
        //    p.AddFormattedText("CLIENT INFORMATION", TextFormat.Bold);

        //    p = headerRow1.Cells[2].AddParagraph();
        //    p.AddFormattedText("CONTACT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[3].AddParagraph();
        //    p.AddFormattedText("CONTACT EMAIL", TextFormat.Bold);

        //    p = headerRow1.Cells[4].AddParagraph();
        //    p.AddFormattedText("CITY", TextFormat.Bold);

        //    p = headerRow1.Cells[5].AddParagraph();
        //    p.AddFormattedText("STATE", TextFormat.Bold);

        //    p = headerRow1.Cells[6].AddParagraph();
        //    p.AddFormattedText("ZIP", TextFormat.Bold);

        //    p = headerRow1.Cells[7].AddParagraph();
        //    p.AddFormattedText("CLIENT PHONE", TextFormat.Bold);

        //    headerRow0_0.Cells[8].MergeRight = 5;
        //    p = headerRow0_0.Cells[8].AddParagraph();
        //    p.AddFormattedText("RESOURCE REQUESTS BY RESOURCE TYPE", TextFormat.Bold);

        //    p = headerRow1.Cells[8].AddParagraph();
        //    p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //    p = headerRow1.Cells[9].AddParagraph();
        //    p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //    p = headerRow1.Cells[10].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[11].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[12].AddParagraph();
        //    p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //    p = headerRow1.Cells[13].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    headerRow0_0.Cells[14].MergeDown = 1;
        //    p = headerRow0_0.Cells[14].AddParagraph();
        //    p.AddFormattedText("CUSTOMER OUTAGES", TextFormat.Bold);

        //    headerRow0_0.Cells[15].MergeDown = 1;
        //    p = headerRow0_0.Cells[15].AddParagraph();
        //    p.AddFormattedText("CASES OF TROUBLE", TextFormat.Bold);

        //    headerRow0_0.Cells[16].MergeDown = 1;
        //    p = headerRow0_0.Cells[16].AddParagraph();
        //    p.AddFormattedText("LATEST TARGET ARRIVAL DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[17].MergeRight = 5;
        //    p = headerRow0_0.Cells[17].AddParagraph();
        //    p.AddFormattedText("NON-NATIVE FTE RESOURCES ACQUIRED", TextFormat.Bold);

        //    p = headerRow1.Cells[17].AddParagraph();
        //    p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //    p = headerRow1.Cells[18].AddParagraph();
        //    p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //    p = headerRow1.Cells[19].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[20].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[21].AddParagraph();
        //    p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //    p = headerRow1.Cells[22].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    headerRow0_0.Cells[23].MergeDown = 1;
        //    p = headerRow0_0.Cells[23].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED BY", TextFormat.Bold);

        //    headerRow0_0.Cells[24].MergeDown = 1;
        //    p = headerRow0_0.Cells[24].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED DATE/TIME", TextFormat.Bold);

        //    #endregion
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        NONIOU_REQUESTBL noniourequestHandler = new NONIOU_REQUESTBL();
        //        List<NONIOU_REQUESTDC> requests = noniourequestHandler.GetNonIOURequestsForExport(data.IDs);

        //        #region Populate Data

        //        foreach (NONIOU_REQUESTDC _request in requests)
        //        {
        //            Row row = table.AddRow();
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_request.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_request.EVENT_TIME_ZONE_NAME);

        //            row.Cells[0].AddParagraph(_request.COMPANY_NAME);
        //            row.Cells[1].AddParagraph(_request.RMAG.RMAG_NAME);
        //            row.Cells[2].AddParagraph(_request.COMPANY_CONTACT);
        //            row.Cells[3].AddParagraph(_request.COMPANY_EMAIL);
        //            row.Cells[4].AddParagraph(_request.COMPANY_CITY);
        //            row.Cells[5].AddParagraph(_request.COMPANY_STATE == null ? "" : _request.COMPANY_STATE);
        //            row.Cells[6].AddParagraph(_request.COMPANY_ZIP);
        //            row.Cells[7].AddParagraph(_request.COMPANY_CELLPHONE);
        //            row.Cells[8].AddParagraph(_request.DISTRIBUTION == null ? "" : _request.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[9].AddParagraph(_request.TRANSMISSION == null ? "" : _request.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[10].AddParagraph(_request.DAMAGE_ASSESSMENT == null ? "" : _request.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[11].AddParagraph(_request.TREE == null ? "" : _request.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[12].AddParagraph(_request.SUBSTATION == null ? "" : _request.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[13].AddParagraph(_request.NET_UG == null ? "" : _request.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[14].AddParagraph(_request.CUSTOMER_OUTAGES == null ? "" : _request.CUSTOMER_OUTAGES.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[15].AddParagraph(_request.TROUBLE_CASES == null ? "" : _request.TROUBLE_CASES.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[16].AddParagraph(_request.LATEST_TARGET_ARRIVAL == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_request.LATEST_TARGET_ARRIVAL.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            row.Cells[17].AddParagraph(_request.NON_NATIVE_DISTRIBUTION == null ? "" : _request.NON_NATIVE_DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[18].AddParagraph(_request.NON_NATIVE_TRANSMISSION == null ? "" : _request.NON_NATIVE_TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[19].AddParagraph(_request.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "" : _request.NON_NATIVE_DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[20].AddParagraph(_request.NON_NATIVE_TREE == null ? "" : _request.NON_NATIVE_TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[21].AddParagraph(_request.NON_NATIVE_SUBSTATION == null ? "" : _request.NON_NATIVE_SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[22].AddParagraph(_request.NON_NATIVE_NET_UG == null ? "" : _request.NON_NATIVE_NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[23].AddParagraph(_request.MODIFIED_BY);
        //            row.Cells[24].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_request.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //        }

        //        #endregion
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportResponses(XSSFSheet sheet, StandardExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell1_0 = (XSSFCell)headerRow1.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0_0.CellStyle = fontOnlyStyle;
        //    cell1_0.CellStyle = fontAndBorderStyle;
        //    cell0_0.SetCellValue("*COMPANY RESPONDING RESOURCES");
        //    var cra0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    sheet.AddMergedRegion(cra0);

        //    XSSFCell cell0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell1_1 = (XSSFCell)headerRow1.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell0_1.CellStyle = fontOnlyStyle;
        //    cell1_1.CellStyle = fontAndBorderStyle;
        //    cell0_1.SetCellValue("*RMAG");
        //    var cra1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    sheet.AddMergedRegion(cra1);

        //    XSSFCell cell0_2 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    XSSFCell cell1_2 = (XSSFCell)headerRow1.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell0_2.CellStyle = fontOnlyStyle;
        //    cell1_2.CellStyle = fontAndBorderStyle;
        //    cell0_2.SetCellValue("DESCRIPTION");
        //    var cra2 = new NPOI.SS.Util.CellRangeAddress(0, 1, 2, 2);
        //    sheet.AddMergedRegion(cra2);

        //    XSSFCell cell0_3 = (XSSFCell)headerRow0_0.CreateCell(3);
        //    XSSFCell cell1_3 = (XSSFCell)headerRow1.CreateCell(3);
        //    sheet.SetColumnWidth(3, 5000);
        //    cell0_3.CellStyle = fontOnlyStyle;
        //    cell1_3.CellStyle = fontAndBorderStyle;
        //    cell0_3.SetCellValue("RESPONSE/HOLD");
        //    var cra3 = new NPOI.SS.Util.CellRangeAddress(0, 1, 3, 3);
        //    sheet.AddMergedRegion(cra3);

        //    XSSFCell cell0_4 = (XSSFCell)headerRow0_0.CreateCell(4);
        //    XSSFCell cell1_4 = (XSSFCell)headerRow1.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell0_4.CellStyle = fontOnlyStyle;
        //    cell1_4.CellStyle = fontAndBorderStyle;
        //    cell0_4.SetCellValue("HOLD REASON");
        //    var cra4 = new NPOI.SS.Util.CellRangeAddress(0, 1, 4, 4);
        //    sheet.AddMergedRegion(cra4);

        //    XSSFCell cell0_5 = (XSSFCell)headerRow0_0.CreateCell(5);
        //    XSSFCell cell1_5 = (XSSFCell)headerRow1.CreateCell(5);
        //    sheet.SetColumnWidth(5, 5000);
        //    cell0_5.CellStyle = fontOnlyStyle;
        //    cell1_5.CellStyle = fontAndBorderStyle;
        //    cell0_5.SetCellValue("EXPECTED RELEASE DATE/TIME");
        //    var cra5 = new NPOI.SS.Util.CellRangeAddress(0, 1, 5, 5);
        //    sheet.AddMergedRegion(cra5);

        //    XSSFCell cell0_6 = (XSSFCell)headerRow0_0.CreateCell(6);
        //    cell0_6.CellStyle = fontOnlyStyle;
        //    cell0_6.SetCellValue("RESOURCE RESPONSES BY RESOURCE TYPE");
        //    var cra6 = new NPOI.SS.Util.CellRangeAddress(0, 0, 6, 13);
        //    sheet.AddMergedRegion(cra6);

        //    XSSFCell cell1_6 = (XSSFCell)headerRow1.CreateCell(6);
        //    sheet.SetColumnWidth(6, 5000);
        //    cell1_6.CellStyle = fontAndBorderStyle;
        //    cell1_6.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_7 = (XSSFCell)headerRow1.CreateCell(7);
        //    sheet.SetColumnWidth(7, 5000);
        //    cell1_7.CellStyle = fontAndBorderStyle;
        //    cell1_7.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_8 = (XSSFCell)headerRow1.CreateCell(8);
        //    sheet.SetColumnWidth(8, 5000);
        //    cell1_8.CellStyle = fontAndBorderStyle;
        //    cell1_8.SetCellValue("DAMAGE");

        //    XSSFCell cell1_9 = (XSSFCell)headerRow1.CreateCell(9);
        //    sheet.SetColumnWidth(9, 5000);
        //    cell1_9.CellStyle = fontAndBorderStyle;
        //    cell1_9.SetCellValue("TREE");

        //    XSSFCell cell1_10 = (XSSFCell)headerRow1.CreateCell(10);
        //    sheet.SetColumnWidth(10, 5000);
        //    cell1_10.CellStyle = fontAndBorderStyle;
        //    cell1_10.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_11 = (XSSFCell)headerRow1.CreateCell(11);
        //    sheet.SetColumnWidth(11, 5000);
        //    cell1_11.CellStyle = fontAndBorderStyle;
        //    cell1_11.SetCellValue("NET UG");

        //    XSSFCell cell1_12 = (XSSFCell)headerRow1.CreateCell(12);
        //    sheet.SetColumnWidth(12, 5000);
        //    cell1_12.CellStyle = fontAndBorderStyle;
        //    cell1_12.SetCellValue("OTHER");

        //    XSSFCell cell1_13 = (XSSFCell)headerRow1.CreateCell(13);
        //    sheet.SetColumnWidth(13, 5000);
        //    cell1_13.CellStyle = fontAndBorderStyle;
        //    cell1_13.SetCellValue("DESCRIPTION");

        //    XSSFCell cell0_14 = (XSSFCell)headerRow0_0.CreateCell(14);
        //    XSSFCell cell1_14 = (XSSFCell)headerRow1.CreateCell(14);
        //    sheet.SetColumnWidth(14, 5000);
        //    cell0_14.CellStyle = fontOnlyStyle;
        //    cell1_14.CellStyle = fontAndBorderStyle;
        //    cell0_14.SetCellValue("COMPANY/NON-COMPANY");
        //    var cra14 = new NPOI.SS.Util.CellRangeAddress(0, 1, 14, 14);
        //    sheet.AddMergedRegion(cra14);

        //    XSSFCell cell0_15 = (XSSFCell)headerRow0_0.CreateCell(15);
        //    XSSFCell cell1_15 = (XSSFCell)headerRow1.CreateCell(15);
        //    sheet.SetColumnWidth(15, 5000);
        //    cell0_15.CellStyle = fontOnlyStyle;
        //    cell1_15.CellStyle = fontAndBorderStyle;
        //    cell0_15.SetCellValue("RELEASE TO ROLL");
        //    var cra15 = new NPOI.SS.Util.CellRangeAddress(0, 1, 15, 15);
        //    sheet.AddMergedRegion(cra15);

        //    XSSFCell cell0_16 = (XSSFCell)headerRow0_0.CreateCell(16);
        //    cell0_16.CellStyle = fontOnlyStyle;
        //    cell0_16.SetCellValue("CLIENT INFORMATION");
        //    var cra16 = new NPOI.SS.Util.CellRangeAddress(0, 0, 16, 21);
        //    sheet.AddMergedRegion(cra16);

        //    XSSFCell cell1_16 = (XSSFCell)headerRow1.CreateCell(16);
        //    sheet.SetColumnWidth(16, 5000);
        //    cell1_16.CellStyle = fontAndBorderStyle;
        //    cell1_16.SetCellValue("CLIENT NAME");

        //    XSSFCell cell1_17 = (XSSFCell)headerRow1.CreateCell(17);
        //    sheet.SetColumnWidth(17, 5000);
        //    cell1_17.CellStyle = fontAndBorderStyle;
        //    cell1_17.SetCellValue("CONTACT NAME");

        //    XSSFCell cell1_18 = (XSSFCell)headerRow1.CreateCell(18);
        //    sheet.SetColumnWidth(18, 10000);
        //    cell1_18.CellStyle = fontAndBorderStyle;
        //    cell1_18.SetCellValue("CONTACT EMAIL");

        //    XSSFCell cell1_19 = (XSSFCell)headerRow1.CreateCell(19);
        //    sheet.SetColumnWidth(19, 5000);
        //    cell1_19.CellStyle = fontAndBorderStyle;
        //    cell1_19.SetCellValue("CITY");

        //    XSSFCell cell1_20 = (XSSFCell)headerRow1.CreateCell(20);
        //    sheet.SetColumnWidth(20, 5000);
        //    cell1_20.CellStyle = fontAndBorderStyle;
        //    cell1_20.SetCellValue("STATE");

        //    XSSFCell cell1_21 = (XSSFCell)headerRow1.CreateCell(21);
        //    sheet.SetColumnWidth(21, 5000);
        //    cell1_21.CellStyle = fontAndBorderStyle;
        //    cell1_21.SetCellValue("CLIENT PHONE #");

        //    XSSFCell cell0_22 = (XSSFCell)headerRow0_0.CreateCell(22);
        //    XSSFCell cell1_22 = (XSSFCell)headerRow1.CreateCell(22);
        //    sheet.SetColumnWidth(22, 5000);
        //    cell0_22.CellStyle = fontOnlyStyle;
        //    cell1_22.CellStyle = fontAndBorderStyle;
        //    cell0_22.SetCellValue("LAST UPDATED BY");
        //    var cra22 = new NPOI.SS.Util.CellRangeAddress(0, 1, 22, 22);
        //    sheet.AddMergedRegion(cra22);

        //    XSSFCell cell0_23 = (XSSFCell)headerRow0_0.CreateCell(23);
        //    XSSFCell cell1_23 = (XSSFCell)headerRow1.CreateCell(23);
        //    sheet.SetColumnWidth(23, 5000);
        //    cell0_23.CellStyle = fontOnlyStyle;
        //    cell1_23.CellStyle = fontAndBorderStyle;
        //    cell0_23.SetCellValue("LAST UPDATED DATE/TIME");
        //    var cra23 = new NPOI.SS.Util.CellRangeAddress(0, 1, 23, 23);
        //    sheet.AddMergedRegion(cra23);

        //    XSSFCell cell0_24 = (XSSFCell)headerRow0_0.CreateCell(24);
        //    XSSFCell cell1_24 = (XSSFCell)headerRow1.CreateCell(24);
        //    sheet.SetColumnWidth(24, 5000);
        //    cell0_24.CellStyle = fontOnlyStyle;
        //    cell1_24.CellStyle = fontAndBorderStyle;
        //    cell0_24.SetCellValue("*STATUS");
        //    var cra24 = new NPOI.SS.Util.CellRangeAddress(0, 1, 24, 24);
        //    sheet.AddMergedRegion(cra24);

        //    XSSFCell cell0_25 = (XSSFCell)headerRow0_0.CreateCell(25);
        //    XSSFCell cell1_25 = (XSSFCell)headerRow1.CreateCell(25);
        //    sheet.SetColumnWidth(25, 5000);
        //    cell0_25.CellStyle = fontOnlyStyle;
        //    cell1_25.CellStyle = fontAndBorderStyle;
        //    cell0_25.SetCellValue("CALCULATION RUN");
        //    var cra25 = new NPOI.SS.Util.CellRangeAddress(0, 1, 25, 25);
        //    sheet.AddMergedRegion(cra25);

        //    #endregion

        //    //Set freeze columns
        //    sheet.CreateFreezePane(2, 0);
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        RESPONSEBL responseHandler = new RESPONSEBL();
        //        List<RESPONSEDC> responses = responseHandler.GetReponsesForExport(data.IDs);

        //        #region Populate Data
        //        NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //        NPOI.SS.UserModel.ICell cell;
        //        int rowIndex = 2;
        //        foreach (RESPONSEDC _response in responses)
        //        {
        //            NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_response.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_response.EVENT_TIME_ZONE_NAME);
        //            row.CreateCell(0).SetCellValue(_response.COMPANY.COMPANY_NAME);
        //            //row.CreateCell(1).SetCellValue(_response.COMPANY.RMAG.RMAG_NAME);
        //            row.CreateCell(2).SetCellValue(_response.DESCRIPTION);
        //            row.CreateCell(3).SetCellValue(_response.RESPONSE_TYPE.LU_NAME);
        //            row.CreateCell(4).SetCellValue(_response.HOLD_REASON.LU_NAME);
        //            row.CreateCell(5).SetCellValue(_response.RELEASE_DATE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.RELEASE_DATE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_response.DISTRIBUTION == null ? "" : _response.DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_response.TRANSMISSION == null ? "" : _response.TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_response.DAMAGE_ASSESSMENT == null ? "" : _response.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_response.TREE == null ? "" : _response.TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_response.SUBSTATION == null ? "" : _response.SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_response.NET_UG == null ? "" : _response.NET_UG.Value.ToString("#,##0"));
        //            cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_response.OTHERS == null ? "" : _response.OTHERS.Value.ToString("#,##0"));
        //            row.CreateCell(13).SetCellValue(_response.RESOURCE_TYPE_DESCRIPTION == null ? "" : _response.RESOURCE_TYPE_DESCRIPTION);
        //            row.CreateCell(14).SetCellValue(_response.IS_COMPANY.LU_NAME);
        //            row.CreateCell(15).SetCellValue(_response.RELEASE_ROLE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.RELEASE_ROLE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            row.CreateCell(16).SetCellValue(_response.COMPANY_NAME);
        //            row.CreateCell(17).SetCellValue(_response.COMPANY_CONTACT);
        //            row.CreateCell(18).SetCellValue(_response.COMPANY_EMAIL);
        //            row.CreateCell(19).SetCellValue(_response.COMPANY_CITY);
        //            row.CreateCell(20).SetCellValue(_response.COMPANY_STATE == null ? "" : _response.COMPANY_STATE);
        //            row.CreateCell(21).SetCellValue(_response.COMPANY_CELLPHONE);
        //            row.CreateCell(22).SetCellValue(_response.MODIFIED_BY);
        //            row.CreateCell(23).SetCellValue(TimeZoneInfo.ConvertTimeFromUtc(_response.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.CreateCell(24).SetCellValue(_response.STATUS.LU_NAME);
        //            row.CreateCell(25).SetCellValue(_response.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            rowIndex++;
        //        }

        //        #endregion
        //    }
        //}

        ///// <summary>
        ///// Export to PDF
        ///// </summary>
        ///// <param name="table"></param>
        ///// <param name="data"></param>
        //public static void ExportResponses(ref Table table, StandardExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(1170);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));

        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow1 = table.AddRow();

        //    headerRow0_0.Cells[0].MergeDown = 1;
        //    Paragraph p = headerRow0_0.Cells[0].AddParagraph();
        //    Font mandateryfont = new Font();
        //    mandateryfont.Bold = true;
        //    mandateryfont.Color = new Color(139, 0, 0);
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("CLIENT RESPONDING RESOURCES", TextFormat.Bold);

        //    headerRow0_0.Cells[1].MergeDown = 1;
        //    p = headerRow0_0.Cells[1].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("RMAG", TextFormat.Bold);

        //    headerRow0_0.Cells[2].MergeDown = 1;
        //    p = headerRow0_0.Cells[2].AddParagraph();
        //    p.AddFormattedText("DESCRIPTION", TextFormat.Bold);

        //    headerRow0_0.Cells[3].MergeDown = 1;
        //    p = headerRow0_0.Cells[3].AddParagraph();
        //    p.AddFormattedText("RESPONSE/HOLD", TextFormat.Bold);

        //    headerRow0_0.Cells[4].MergeDown = 1;
        //    p = headerRow0_0.Cells[4].AddParagraph();
        //    p.AddFormattedText("HOLD REASON", TextFormat.Bold);

        //    headerRow0_0.Cells[5].MergeDown = 1;
        //    p = headerRow0_0.Cells[5].AddParagraph();
        //    p.AddFormattedText("EXPECTED RELEASE DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[6].MergeRight = 7;
        //    p = headerRow0_0.Cells[6].AddParagraph();
        //    p.AddFormattedText("RESOURCE RESPONSES BY RESOURCE TYPE", TextFormat.Bold);

        //    p = headerRow1.Cells[6].AddParagraph();
        //    p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //    p = headerRow1.Cells[7].AddParagraph();
        //    p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //    p = headerRow1.Cells[8].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[9].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[10].AddParagraph();
        //    p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //    p = headerRow1.Cells[11].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    p = headerRow1.Cells[12].AddParagraph();
        //    p.AddFormattedText("OTHER", TextFormat.Bold);

        //    p = headerRow1.Cells[13].AddParagraph();
        //    p.AddFormattedText("DESCRIPTION", TextFormat.Bold);

        //    headerRow0_0.Cells[14].MergeDown = 1;
        //    p = headerRow0_0.Cells[14].AddParagraph();
        //    p.AddFormattedText("COMPANY/NON-COMPANY", TextFormat.Bold);

        //    headerRow0_0.Cells[15].MergeDown = 1;
        //    p = headerRow0_0.Cells[15].AddParagraph();
        //    p.AddFormattedText("RELEASE TO ROLL", TextFormat.Bold);

        //    headerRow0_0.Cells[16].MergeRight = 4;
        //    p = headerRow0_0.Cells[16].AddParagraph();
        //    p.AddFormattedText("CLIENT INFORMATION", TextFormat.Bold);

        //    p = headerRow1.Cells[16].AddParagraph();
        //    p.AddFormattedText("CLIENT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[17].AddParagraph();
        //    p.AddFormattedText("CONTACT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[18].AddParagraph();
        //    p.AddFormattedText("CONTACT EMAIL", TextFormat.Bold);

        //    p = headerRow1.Cells[19].AddParagraph();
        //    p.AddFormattedText("CITY", TextFormat.Bold);

        //    p = headerRow1.Cells[20].AddParagraph();
        //    p.AddFormattedText("STATE", TextFormat.Bold);

        //    p = headerRow1.Cells[21].AddParagraph();
        //    p.AddFormattedText("CLIENT PHONE #", TextFormat.Bold);

        //    headerRow0_0.Cells[22].MergeDown = 1;
        //    p = headerRow0_0.Cells[22].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED BY", TextFormat.Bold);

        //    headerRow0_0.Cells[23].MergeDown = 1;
        //    p = headerRow0_0.Cells[23].AddParagraph();
        //    p.AddFormattedText("LAST UPDATED DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[24].MergeDown = 1;
        //    p = headerRow0_0.Cells[24].AddParagraph();
        //    p.AddFormattedText("*", mandateryfont);
        //    p.AddFormattedText("STATUS", TextFormat.Bold);

        //    headerRow0_0.Cells[25].MergeDown = 1;
        //    p = headerRow0_0.Cells[25].AddParagraph();
        //    p.AddFormattedText("CALCULATION RUN", TextFormat.Bold);

        //    #endregion
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        RESPONSEBL responseHandler = new RESPONSEBL();
        //        List<RESPONSEDC> responses = responseHandler.GetReponsesForExport(data.IDs);

        //        #region Populate Data

        //        foreach (RESPONSEDC _response in responses)
        //        {
        //            Row row = table.AddRow();
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_response.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_response.EVENT_TIME_ZONE_NAME);
        //            row.Cells[0].AddParagraph(_response.COMPANY.COMPANY_NAME);
        //            //row.Cells[1].AddParagraph(_response.COMPANY.RMAG.RMAG_NAME);
        //            row.Cells[2].AddParagraph(_response.DESCRIPTION);
        //            row.Cells[3].AddParagraph(_response.RESPONSE_TYPE.LU_NAME);
        //            row.Cells[4].AddParagraph(_response.HOLD_REASON.LU_NAME);
        //            row.Cells[5].AddParagraph(_response.RELEASE_DATE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.RELEASE_DATE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            row.Cells[6].AddParagraph(_response.DISTRIBUTION == null ? "" : _response.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[7].AddParagraph(_response.TRANSMISSION == null ? "" : _response.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[8].AddParagraph(_response.DAMAGE_ASSESSMENT == null ? "" : _response.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[9].AddParagraph(_response.TREE == null ? "" : _response.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[10].AddParagraph(_response.SUBSTATION == null ? "" : _response.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[11].AddParagraph(_response.NET_UG == null ? "" : _response.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[12].AddParagraph(_response.OTHERS == null ? "" : _response.OTHERS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[13].AddParagraph(_response.RESOURCE_TYPE_DESCRIPTION == null ? "" : _response.RESOURCE_TYPE_DESCRIPTION);
        //            row.Cells[14].AddParagraph(_response.IS_COMPANY.LU_NAME);
        //            row.Cells[15].AddParagraph(_response.RELEASE_ROLE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.RELEASE_ROLE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            row.Cells[16].AddParagraph(_response.COMPANY_NAME);
        //            row.Cells[17].AddParagraph(_response.COMPANY_CONTACT);
        //            row.Cells[18].AddParagraph(_response.COMPANY_EMAIL);
        //            row.Cells[19].AddParagraph(_response.COMPANY_CITY);
        //            row.Cells[20].AddParagraph(_response.COMPANY_STATE == null ? "" : _response.COMPANY_STATE);
        //            row.Cells[21].AddParagraph(_response.COMPANY_CELLPHONE);
        //            row.Cells[22].AddParagraph(_response.MODIFIED_BY);
        //            row.Cells[23].AddParagraph(TimeZoneInfo.ConvertTimeFromUtc(_response.MODIFIED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[24].AddParagraph(_response.STATUS.LU_NAME);
        //            row.Cells[25].AddParagraph(_response.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_response.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //        }

        //        #endregion
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportAllocation(XSSFSheet sheet, AllocationExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    XSSFRow headerRow2 = (XSSFRow)sheet.CreateRow(2);
        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell1_0 = (XSSFCell)headerRow1.CreateCell(0);
        //    XSSFCell cell2_0 = (XSSFCell)headerRow2.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0_0.CellStyle = fontOnlyStyle;
        //    cell2_0.CellStyle = fontAndBorderStyle;
        //    cell0_0.SetCellValue("CLIENT REQUESTING RESOURCES");
        //    var cra0 = new NPOI.SS.Util.CellRangeAddress(0, 2, 0, 0);
        //    sheet.AddMergedRegion(cra0);

        //    XSSFCell cell0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell1_1 = (XSSFCell)headerRow1.CreateCell(1);
        //    XSSFCell cell2_1 = (XSSFCell)headerRow2.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell0_1.CellStyle = fontOnlyStyle;
        //    cell2_1.CellStyle = fontAndBorderStyle;
        //    cell0_1.SetCellValue("RMAG");
        //    var cra1 = new NPOI.SS.Util.CellRangeAddress(0, 2, 1, 1);
        //    sheet.AddMergedRegion(cra1);

        //    XSSFCell cell0_2 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    cell0_2.CellStyle = fontOnlyStyle;
        //    cell0_2.SetCellValue("PRE-STAGING ALLOCATION CALCULATIONS");
        //    var cra0_2 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 13);
        //    sheet.AddMergedRegion(cra0_2);

        //    XSSFCell cell1_2 = (XSSFCell)headerRow1.CreateCell(2);
        //    cell1_2.CellStyle = fontOnlyStyle;
        //    cell1_2.SetCellValue("EQUITABLE SHARE BASED ON REQUEST");
        //    var cra1_2 = new NPOI.SS.Util.CellRangeAddress(1, 1, 2, 7);
        //    sheet.AddMergedRegion(cra1_2);

        //    XSSFCell cell2_2 = (XSSFCell)headerRow2.CreateCell(2);
        //    sheet.SetColumnWidth(2, 2500);
        //    cell2_2.CellStyle = fontAndBorderStyle;
        //    cell2_2.SetCellValue("DIST.");

        //    XSSFCell cell2_3 = (XSSFCell)headerRow2.CreateCell(3);
        //    sheet.SetColumnWidth(3, 2500);
        //    cell2_3.CellStyle = fontAndBorderStyle;
        //    cell2_3.SetCellValue("TRANS.");

        //    XSSFCell cell2_4 = (XSSFCell)headerRow2.CreateCell(4);
        //    sheet.SetColumnWidth(4, 2500);
        //    cell2_4.CellStyle = fontAndBorderStyle;
        //    cell2_4.SetCellValue("DAMAGE");

        //    XSSFCell cell2_5 = (XSSFCell)headerRow2.CreateCell(5);
        //    sheet.SetColumnWidth(5, 2500);
        //    cell2_5.CellStyle = fontAndBorderStyle;
        //    cell2_5.SetCellValue("TREE");

        //    XSSFCell cell2_6 = (XSSFCell)headerRow2.CreateCell(6);
        //    sheet.SetColumnWidth(6, 2500);
        //    cell2_6.CellStyle = fontAndBorderStyle;
        //    cell2_6.SetCellValue("SUBST.");

        //    XSSFCell cell2_7 = (XSSFCell)headerRow2.CreateCell(7);
        //    sheet.SetColumnWidth(7, 2500);
        //    cell2_7.CellStyle = fontAndBorderStyle;
        //    cell2_7.SetCellValue("NET UG");

        //    XSSFCell cell1_8 = (XSSFCell)headerRow1.CreateCell(8);
        //    cell1_8.CellStyle = fontOnlyStyle;
        //    cell1_8.SetCellValue("EQUITABLE SHARE BASED ON TOTAL AVAILABLE RESOURCES");
        //    var cra1_8 = new NPOI.SS.Util.CellRangeAddress(1, 1, 8, 13);
        //    sheet.AddMergedRegion(cra1_8);

        //    XSSFCell cell2_8 = (XSSFCell)headerRow2.CreateCell(8);
        //    sheet.SetColumnWidth(8, 2500);
        //    cell2_8.CellStyle = fontAndBorderStyle;
        //    cell2_8.SetCellValue("DIST.");

        //    XSSFCell cell2_9 = (XSSFCell)headerRow2.CreateCell(9);
        //    sheet.SetColumnWidth(9, 2500);
        //    cell2_9.CellStyle = fontAndBorderStyle;
        //    cell2_9.SetCellValue("TRANS.");

        //    XSSFCell cell2_10 = (XSSFCell)headerRow2.CreateCell(10);
        //    sheet.SetColumnWidth(10, 2500);
        //    cell2_10.CellStyle = fontAndBorderStyle;
        //    cell2_10.SetCellValue("DAMAGE");

        //    XSSFCell cell2_11 = (XSSFCell)headerRow2.CreateCell(11);
        //    sheet.SetColumnWidth(11, 2500);
        //    cell2_11.CellStyle = fontAndBorderStyle;
        //    cell2_11.SetCellValue("TREE");

        //    XSSFCell cell2_12 = (XSSFCell)headerRow2.CreateCell(12);
        //    sheet.SetColumnWidth(12, 2500);
        //    cell2_12.CellStyle = fontAndBorderStyle;
        //    cell2_12.SetCellValue("SUBST.");

        //    XSSFCell cell2_13 = (XSSFCell)headerRow2.CreateCell(13);
        //    sheet.SetColumnWidth(13, 2500);
        //    cell2_13.CellStyle = fontAndBorderStyle;
        //    cell2_13.SetCellValue("NET UG");

        //    XSSFCell cell0_14 = (XSSFCell)headerRow0_0.CreateCell(14);
        //    cell0_14.CellStyle = fontOnlyStyle;
        //    cell0_14.SetCellValue("RESTORATION ALLOCATION CALCULATIONS");
        //    var cra0_14 = new NPOI.SS.Util.CellRangeAddress(0, 0, 14, 28);
        //    sheet.AddMergedRegion(cra0_14);

        //    XSSFCell cell1_14 = (XSSFCell)headerRow1.CreateCell(14);
        //    XSSFCell cell2_14 = (XSSFCell)headerRow2.CreateCell(14);
        //    sheet.SetColumnWidth(14, 5000);
        //    cell1_14.CellStyle = fontOnlyStyle;
        //    cell2_14.CellStyle = fontAndBorderStyle;
        //    cell1_14.SetCellValue("% TOTAL CUSTOMERS OUT");
        //    var cra14 = new NPOI.SS.Util.CellRangeAddress(1, 2, 14, 14);
        //    sheet.AddMergedRegion(cra14);

        //    XSSFCell cell1_15 = (XSSFCell)headerRow1.CreateCell(15);
        //    XSSFCell cell2_15 = (XSSFCell)headerRow2.CreateCell(15);
        //    sheet.SetColumnWidth(15, 5000);
        //    cell1_15.CellStyle = fontOnlyStyle;
        //    cell2_15.CellStyle = fontAndBorderStyle;
        //    cell1_15.SetCellValue("% TOTAL TROUBLE CASES");
        //    var cra15 = new NPOI.SS.Util.CellRangeAddress(1, 2, 15, 15);
        //    sheet.AddMergedRegion(cra15);

        //    XSSFCell cell1_16 = (XSSFCell)headerRow1.CreateCell(16);
        //    XSSFCell cell2_16 = (XSSFCell)headerRow2.CreateCell(16);
        //    sheet.SetColumnWidth(16, 5000);
        //    cell1_16.CellStyle = fontOnlyStyle;
        //    cell2_16.CellStyle = fontAndBorderStyle;
        //    cell1_16.SetCellValue("ADJUSTED NEEDS");
        //    var cra16 = new NPOI.SS.Util.CellRangeAddress(1, 2, 16, 16);
        //    sheet.AddMergedRegion(cra16);

        //    XSSFCell cell1_17 = (XSSFCell)headerRow1.CreateCell(17);
        //    cell1_17.CellStyle = fontOnlyStyle;
        //    cell1_17.SetCellValue("EQUITABLE SHARE BASED ON ADJUSTED NEED");
        //    var cra1_17 = new NPOI.SS.Util.CellRangeAddress(1, 1, 17, 22);
        //    sheet.AddMergedRegion(cra1_17);

        //    XSSFCell cell2_17 = (XSSFCell)headerRow2.CreateCell(17);
        //    sheet.SetColumnWidth(17, 2500);
        //    cell2_17.CellStyle = fontAndBorderStyle;
        //    cell2_17.SetCellValue("DIST.");

        //    XSSFCell cell2_18 = (XSSFCell)headerRow2.CreateCell(18);
        //    sheet.SetColumnWidth(18, 2500);
        //    cell2_18.CellStyle = fontAndBorderStyle;
        //    cell2_18.SetCellValue("TRANS.");

        //    XSSFCell cell2_19 = (XSSFCell)headerRow2.CreateCell(19);
        //    sheet.SetColumnWidth(19, 2500);
        //    cell2_19.CellStyle = fontAndBorderStyle;
        //    cell2_19.SetCellValue("DAMAGE");

        //    XSSFCell cell2_20 = (XSSFCell)headerRow2.CreateCell(20);
        //    sheet.SetColumnWidth(20, 2500);
        //    cell2_20.CellStyle = fontAndBorderStyle;
        //    cell2_20.SetCellValue("TREE");

        //    XSSFCell cell2_21 = (XSSFCell)headerRow2.CreateCell(21);
        //    sheet.SetColumnWidth(21, 2500);
        //    cell2_21.CellStyle = fontAndBorderStyle;
        //    cell2_21.SetCellValue("SUBST.");

        //    XSSFCell cell2_22 = (XSSFCell)headerRow2.CreateCell(22);
        //    sheet.SetColumnWidth(22, 2500);
        //    cell2_22.CellStyle = fontAndBorderStyle;
        //    cell2_22.SetCellValue("NET UG");

        //    XSSFCell cell1_23 = (XSSFCell)headerRow1.CreateCell(23);
        //    cell1_23.CellStyle = fontOnlyStyle;
        //    cell1_23.SetCellValue("EQUITABLE SHARE LESS RESOURCES ACQUIRED");
        //    var cra1_23 = new NPOI.SS.Util.CellRangeAddress(1, 1, 23, 28);
        //    sheet.AddMergedRegion(cra1_23);

        //    XSSFCell cell2_23 = (XSSFCell)headerRow2.CreateCell(23);
        //    sheet.SetColumnWidth(23, 2500);
        //    cell2_23.CellStyle = fontAndBorderStyle;
        //    cell2_23.SetCellValue("DIST.");

        //    XSSFCell cell2_24 = (XSSFCell)headerRow2.CreateCell(24);
        //    sheet.SetColumnWidth(24, 2500);
        //    cell2_24.CellStyle = fontAndBorderStyle;
        //    cell2_24.SetCellValue("TRANS.");

        //    XSSFCell cell2_25 = (XSSFCell)headerRow2.CreateCell(25);
        //    sheet.SetColumnWidth(25, 2500);
        //    cell2_25.CellStyle = fontAndBorderStyle;
        //    cell2_25.SetCellValue("DAMAGE");

        //    XSSFCell cell2_26 = (XSSFCell)headerRow2.CreateCell(26);
        //    sheet.SetColumnWidth(26, 2500);
        //    cell2_26.CellStyle = fontAndBorderStyle;
        //    cell2_26.SetCellValue("TREE");

        //    XSSFCell cell2_27 = (XSSFCell)headerRow2.CreateCell(27);
        //    sheet.SetColumnWidth(27, 2500);
        //    cell2_27.CellStyle = fontAndBorderStyle;
        //    cell2_27.SetCellValue("SUBST.");

        //    XSSFCell cell2_28 = (XSSFCell)headerRow2.CreateCell(28);
        //    sheet.SetColumnWidth(28, 2500);
        //    cell2_28.CellStyle = fontAndBorderStyle;
        //    cell2_28.SetCellValue("NET UG");

        //    #endregion

        //    //Set freeze columns
        //    sheet.CreateFreezePane(2, 0);

        //    //Get data from DB
        //    ALLOCATIONBL allocationHandler = new ALLOCATIONBL();
        //    int CALC_TYPE = data.CALC_TYPE == "" ? 0 : Convert.ToInt32(data.CALC_TYPE);
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    int VIEW_TYPE = Convert.ToInt32(data.VIEW_TYPE);
        //    double ADJ_CUSTOMER_OUT_VAR = Convert.ToDouble(data.ACOV);
        //    string CALC_RUN = (string.IsNullOrEmpty(data.CALC_RUN) || data.CALC_RUN == "0" || data.CALC_RUN == "? string:0 ?" || data.CALC_RUN == "? undefined:undefined ?" || data.CALC_RUN == "? string: ?") ? "" : data.CALC_RUN;
        //    string RMAG_NAME = (string.IsNullOrEmpty(data.RMAG_NAME) || data.RMAG_NAME.Trim().ToLower() == "all" || data.RMAG_NAME == "0" || data.RMAG_NAME == "? string:0 ?" || data.RMAG_NAME == "? undefined:undefined ?" || data.RMAG_NAME == "? string: ?") ? "" : data.RMAG_NAME;
        //    string COMPANY_NAME = (string.IsNullOrEmpty(data.COMPANY_NAME) || data.COMPANY_NAME.Trim().ToLower() == "all" || data.COMPANY_NAME == "0" || data.COMPANY_NAME == "? string:0 ?" || data.COMPANY_NAME == "? undefined:undefined ?" || data.COMPANY_NAME == "? string: ?") ? "" : data.COMPANY_NAME;
        //    List<ALLOCATIONDC> allocations = allocationHandler.GetAllocationsForExport(CALC_TYPE, EVENT_ID, VIEW_TYPE, ADJ_CUSTOMER_OUT_VAR, CALC_RUN, RMAG_NAME, COMPANY_NAME);

        //    #region Populate Data
        //    NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //    NPOI.SS.UserModel.ICell cell;
        //    int rowIndex = 3;
        //    foreach (ALLOCATIONDC _allocation in allocations)
        //    {
        //        NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //        row.CreateCell(0).SetCellValue(_allocation.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_allocation.RMAG_NAME);
        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DISTRIBUTION == null ? "0.00%" : _allocation.DISTRIBUTION.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TRANSMISSION == null ? "0.00%" : _allocation.TRANSMISSION.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DAMAGE_ASSESSMENT == null ? "0.00%" : _allocation.DAMAGE_ASSESSMENT.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TREE == null ? "0.00%" : _allocation.TREE.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.SUBSTATION == null ? "0.00%" : _allocation.SUBSTATION.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.NET_UG == null ? "0.00%" : _allocation.NET_UG.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DISTRIBUTION_ESTAR == null ? "" : _allocation.DISTRIBUTION_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TRANSMISSION_ESTAR == null ? "" : _allocation.TRANSMISSION_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DAMAGE_ASSESSMENT_ESTAR == null ? "" : _allocation.DAMAGE_ASSESSMENT_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TREE_ESTAR == null ? "" : _allocation.TREE_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.SUBSTATION_ESTAR == null ? "" : _allocation.SUBSTATION_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.NET_UG_ESTAR == null ? "" : _allocation.NET_UG_ESTAR.Value.ToString("#,##0"));
        //        cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.PERC_TOTAL_CUSTOMER_OUT == null ? "0.00%" : _allocation.PERC_TOTAL_CUSTOMER_OUT.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.PERC_TOTAL_TROUBLE_CASES == null ? "0.00%" : _allocation.PERC_TOTAL_TROUBLE_CASES.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(16); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.ADJUSTED_NEED == null ? "0.00%" : _allocation.ADJUSTED_NEED.Value.ToString("0.00") + "%");
        //        cell = row.CreateCell(17); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DISTRIBUTION_ADJ_NEED == null ? "0" : _allocation.DISTRIBUTION_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(18); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TRANSMISSION_ADJ_NEED == null ? "0" : _allocation.TRANSMISSION_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(19); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DAMAGE_ASSESSMENT_ADJ_NEED == null ? "0" : _allocation.DAMAGE_ASSESSMENT_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(20); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TREE_ADJ_NEED == null ? "0" : _allocation.TREE_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(21); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.SUBSTATION_ADJ_NEED == null ? "0" : _allocation.SUBSTATION_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(22); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.NET_UG_ADJ_NEED == null ? "0" : _allocation.NET_UG_ADJ_NEED.Value.ToString("#,##0"));
        //        cell = row.CreateCell(23); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DISTRIBUTION_LESS == null ? "0" : _allocation.DISTRIBUTION_LESS.Value.ToString("#,##0"));
        //        cell = row.CreateCell(24); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TRANSMISSION_LESS == null ? "0" : _allocation.TRANSMISSION_LESS.Value.ToString("#,##0"));
        //        cell = row.CreateCell(25); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.DAMAGE_ASSESSMENT_LESS == null ? "0" : _allocation.DAMAGE_ASSESSMENT_LESS.Value.ToString("#,##0"));
        //        cell = row.CreateCell(26); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.TREE_LESS == null ? "0" : _allocation.TREE_LESS.Value.ToString("#,##0"));
        //        cell = row.CreateCell(27); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.SUBSTATION_LESS == null ? "0" : _allocation.SUBSTATION_LESS.Value.ToString("#,##0"));
        //        cell = row.CreateCell(28); cell.CellStyle = numberStyle; cell.SetCellValue(_allocation.NET_UG_LESS == null ? "0" : _allocation.NET_UG_LESS.Value.ToString("#,##0"));
        //        rowIndex++;
        //    }

        //    #endregion
        //}

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportAllocation(ref Table table, AllocationExportData data)
        //{

        //    {
        //        Unit width, height;
        //        PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //        width = Unit.FromMillimeter(870);
        //        table.Section.PageSetup.PageWidth = width;
        //        table.Section.PageSetup.PageHeight = height;

        //        #region Build Header

        //        Column column = table.AddColumn(Unit.FromInch(3));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(2.0));
        //        column = table.AddColumn(Unit.FromInch(2.0));
        //        column = table.AddColumn(Unit.FromInch(2.0));
        //        column = table.AddColumn(Unit.FromInch(2.0));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));

        //        Row headerRow0_0 = table.AddRow();
        //        Row headerRow1 = table.AddRow();
        //        Row headerRow2 = table.AddRow();

        //        headerRow0_0.Cells[0].MergeDown = 2;
        //        Paragraph p = headerRow0_0.Cells[0].AddParagraph();
                
        //        p.AddFormattedText("COMPANY REQUESTING RESOURCES", TextFormat.Bold);

        //        headerRow0_0.Cells[1].MergeDown = 2;
        //        p = headerRow0_0.Cells[1].AddParagraph();
        //        p.AddFormattedText("RMAG", TextFormat.Bold);

        //        headerRow0_0.Cells[2].MergeRight = 11;
        //        p = headerRow0_0.Cells[2].AddParagraph();
        //        p.AddFormattedText("PRE-STAGING ALLOCATION CALCULATIONS", TextFormat.Bold);

        //        headerRow1.Cells[2].MergeRight = 5;
        //        p = headerRow1.Cells[2].AddParagraph();
        //        p.AddFormattedText("EQUITABLE SHARE BASED ON REQUEST", TextFormat.Bold);

        //        p = headerRow2.Cells[2].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[3].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[4].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[5].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[6].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[7].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[8].MergeRight = 5;
        //        p = headerRow1.Cells[8].AddParagraph();
        //        p.AddFormattedText("EQUITABLE SHARE BASED ON TOTAL AVAILABLE RESOURCES", TextFormat.Bold);

        //        p = headerRow2.Cells[8].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[9].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[10].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[11].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[12].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[13].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow0_0.Cells[14].MergeRight = 14;
        //        p = headerRow0_0.Cells[14].AddParagraph();
        //        p.AddFormattedText("RESTORATION ALLOCATION CALCULATIONS", TextFormat.Bold);

        //        headerRow1.Cells[14].MergeDown = 1;
        //        p = headerRow1.Cells[14].AddParagraph();
        //        p.AddFormattedText("% TOTAL CUSTOMERS OUT", TextFormat.Bold);

        //        headerRow1.Cells[15].MergeDown = 1;
        //        p = headerRow1.Cells[15].AddParagraph();
        //        p.AddFormattedText("% TOTAL TROUBLE CASES", TextFormat.Bold);

        //        headerRow1.Cells[16].MergeDown = 1;
        //        p = headerRow1.Cells[16].AddParagraph();
        //        p.AddFormattedText("ADJUSTED NEEDS", TextFormat.Bold);

        //        headerRow1.Cells[17].MergeRight = 5;
        //        p = headerRow1.Cells[17].AddParagraph();
        //        p.AddFormattedText("EQUITABLE SHARE BASED ON ADJUSTED NEED", TextFormat.Bold);

        //        p = headerRow2.Cells[17].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[18].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[19].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[20].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[21].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[22].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[23].MergeRight = 5;
        //        p = headerRow1.Cells[23].AddParagraph();
        //        p.AddFormattedText("EQUITABLE SHARE LESS RESOURCES ACQUIRED", TextFormat.Bold);

        //        p = headerRow2.Cells[23].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[24].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[25].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[26].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[27].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[28].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        #endregion

        //        //Get data from DB
        //        ALLOCATIONBL allocationHandler = new ALLOCATIONBL();
        //        int CALC_TYPE = data.CALC_TYPE == "" ? 0 : Convert.ToInt32(data.CALC_TYPE);
        //        int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //        int VIEW_TYPE = Convert.ToInt32(data.VIEW_TYPE);
        //        double ADJ_CUSTOMER_OUT_VAR = Convert.ToDouble(data.ACOV);
        //        string CALC_RUN = (string.IsNullOrEmpty(data.CALC_RUN) || data.CALC_RUN == "0" || data.CALC_RUN == "? string:0 ?" || data.CALC_RUN == "? undefined:undefined ?" || data.CALC_RUN == "? string: ?") ? "" : data.CALC_RUN;
        //        string RMAG_NAME = (string.IsNullOrEmpty(data.RMAG_NAME) || data.RMAG_NAME.Trim().ToLower() == "all" || data.RMAG_NAME == "0" || data.RMAG_NAME == "? string:0 ?" || data.RMAG_NAME == "? undefined:undefined ?" || data.RMAG_NAME == "? string: ?") ? "" : data.RMAG_NAME;
        //        string COMPANY_NAME = (string.IsNullOrEmpty(data.COMPANY_NAME) || data.COMPANY_NAME.Trim().ToLower() == "all" || data.COMPANY_NAME == "0" || data.COMPANY_NAME == "? string:0 ?" || data.COMPANY_NAME == "? undefined:undefined ?" || data.COMPANY_NAME == "? string: ?") ? "" : data.COMPANY_NAME;
        //        List<ALLOCATIONDC> allocations = allocationHandler.GetAllocationsForExport(CALC_TYPE, EVENT_ID, VIEW_TYPE, ADJ_CUSTOMER_OUT_VAR, CALC_RUN, RMAG_NAME, COMPANY_NAME);

        //        #region Populate Data

        //        foreach (ALLOCATIONDC _allocation in allocations)
        //        {
        //            Row row = table.AddRow();
        //            row.Cells[0].AddParagraph(_allocation.COMPANY_NAME);
        //            row.Cells[1].AddParagraph(_allocation.RMAG_NAME);
        //            row.Cells[2].AddParagraph(_allocation.DISTRIBUTION == null ? "0.00%" : _allocation.DISTRIBUTION.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[3].AddParagraph(_allocation.TRANSMISSION == null ? "0.00%" : _allocation.TRANSMISSION.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[4].AddParagraph(_allocation.DAMAGE_ASSESSMENT == null ? "0.00%" : _allocation.DAMAGE_ASSESSMENT.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[5].AddParagraph(_allocation.TREE == null ? "0.00%" : _allocation.TREE.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[6].AddParagraph(_allocation.SUBSTATION == null ? "0.00%" : _allocation.SUBSTATION.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[7].AddParagraph(_allocation.NET_UG == null ? "0.00%" : _allocation.NET_UG.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[8].AddParagraph(_allocation.DISTRIBUTION_ESTAR == null ? "" : _allocation.DISTRIBUTION_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[9].AddParagraph(_allocation.TRANSMISSION_ESTAR == null ? "" : _allocation.TRANSMISSION_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[10].AddParagraph(_allocation.DAMAGE_ASSESSMENT_ESTAR == null ? "" : _allocation.DAMAGE_ASSESSMENT_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[11].AddParagraph(_allocation.TREE_ESTAR == null ? "" : _allocation.TREE_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[12].AddParagraph(_allocation.SUBSTATION_ESTAR == null ? "" : _allocation.SUBSTATION_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[13].AddParagraph(_allocation.NET_UG_ESTAR == null ? "" : _allocation.NET_UG_ESTAR.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[14].AddParagraph(_allocation.PERC_TOTAL_CUSTOMER_OUT == null ? "0.00%" : _allocation.PERC_TOTAL_CUSTOMER_OUT.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[15].AddParagraph(_allocation.PERC_TOTAL_TROUBLE_CASES == null ? "0.00%" : _allocation.PERC_TOTAL_TROUBLE_CASES.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[16].AddParagraph(_allocation.ADJUSTED_NEED == null ? "0.00%" : _allocation.ADJUSTED_NEED.Value.ToString("0.00") + "%").Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[17].AddParagraph(_allocation.DISTRIBUTION_ADJ_NEED == null ? "0" : _allocation.DISTRIBUTION_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[18].AddParagraph(_allocation.TRANSMISSION_ADJ_NEED == null ? "0" : _allocation.TRANSMISSION_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[19].AddParagraph(_allocation.DAMAGE_ASSESSMENT_ADJ_NEED == null ? "0" : _allocation.DAMAGE_ASSESSMENT_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[20].AddParagraph(_allocation.TREE_ADJ_NEED == null ? "0" : _allocation.TREE_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[21].AddParagraph(_allocation.SUBSTATION_ADJ_NEED == null ? "0" : _allocation.SUBSTATION_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[22].AddParagraph(_allocation.NET_UG_ADJ_NEED == null ? "0" : _allocation.NET_UG_ADJ_NEED.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[23].AddParagraph(_allocation.DISTRIBUTION_LESS == null ? "0" : _allocation.DISTRIBUTION_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[24].AddParagraph(_allocation.TRANSMISSION_LESS == null ? "0" : _allocation.TRANSMISSION_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[25].AddParagraph(_allocation.DAMAGE_ASSESSMENT_LESS == null ? "0" : _allocation.DAMAGE_ASSESSMENT_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[26].AddParagraph(_allocation.TREE_LESS == null ? "0" : _allocation.TREE_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[27].AddParagraph(_allocation.SUBSTATION_LESS == null ? "0" : _allocation.SUBSTATION_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[28].AddParagraph(_allocation.NET_UG_LESS == null ? "0" : _allocation.NET_UG_LESS.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        }

        //        #endregion
        //    }
        //}


        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportResourceReport(XSSFSheet sheet, PreFormatedExportData data)
        //{
        //    sheet.Workbook.SetSheetName(0, "RESOURCES");

        //    XSSFSheet requestsSheet = sheet;
        //    XSSFSheet responsesSheet = (XSSFSheet)sheet.Workbook.CreateSheet("ALLOCATION DETAIL");

        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = requestsSheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = requestsSheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = requestsSheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    #region Build Header - RESOURCES

        //    //headerRow names are like: headerRowSheetx_Rowx
        //    XSSFRow headerRow0_0 = (XSSFRow)requestsSheet.CreateRow(0);
        //    XSSFRow headerRow0_1 = (XSSFRow)requestsSheet.CreateRow(1);

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell0_0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell0_1_0 = (XSSFCell)headerRow0_1.CreateCell(0);
        //    requestsSheet.SetColumnWidth(0, 5000);
        //    cell0_0_0.CellStyle = fontOnlyStyle;
        //    cell0_1_0.CellStyle = fontAndBorderStyle;
        //    cell0_0_0.SetCellValue("COMPANY");
        //    var cra0_0_0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    requestsSheet.AddMergedRegion(cra0_0_0);

        //    XSSFCell cell0_0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell0_1_1 = (XSSFCell)headerRow0_1.CreateCell(1);
        //    requestsSheet.SetColumnWidth(1, 5000);
        //    cell0_0_1.CellStyle = fontOnlyStyle;
        //    cell0_1_1.CellStyle = fontAndBorderStyle;
        //    cell0_0_1.SetCellValue("RMAG");
        //    var cra0_0_1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    requestsSheet.AddMergedRegion(cra0_0_1);

        //    XSSFCell cell0_0_2 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    cell0_0_2.CellStyle = fontOnlyStyle;
        //    cell0_0_2.SetCellValue("RESOURCE REQUESTS");
        //    var cra0_0_2 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 7);
        //    requestsSheet.AddMergedRegion(cra0_0_2);

        //    XSSFCell cell0_1_2 = (XSSFCell)headerRow0_1.CreateCell(2);
        //    requestsSheet.SetColumnWidth(2, 2500);
        //    cell0_1_2.CellStyle = fontAndBorderStyle;
        //    cell0_1_2.SetCellValue("DIST.");

        //    XSSFCell cell0_1_3 = (XSSFCell)headerRow0_1.CreateCell(3);
        //    requestsSheet.SetColumnWidth(3, 2500);
        //    cell0_1_3.CellStyle = fontAndBorderStyle;
        //    cell0_1_3.SetCellValue("TRANS.");

        //    XSSFCell cell0_1_4 = (XSSFCell)headerRow0_1.CreateCell(4);
        //    requestsSheet.SetColumnWidth(4, 2500);
        //    cell0_1_4.CellStyle = fontAndBorderStyle;
        //    cell0_1_4.SetCellValue("DAMAGE");

        //    XSSFCell cell0_1_5 = (XSSFCell)headerRow0_1.CreateCell(5);
        //    requestsSheet.SetColumnWidth(5, 2500);
        //    cell0_1_5.CellStyle = fontAndBorderStyle;
        //    cell0_1_5.SetCellValue("TREE");

        //    XSSFCell cell0_1_6 = (XSSFCell)headerRow0_1.CreateCell(6);
        //    requestsSheet.SetColumnWidth(6, 2500);
        //    cell0_1_6.CellStyle = fontAndBorderStyle;
        //    cell0_1_6.SetCellValue("SUBST.");

        //    XSSFCell cell0_1_7 = (XSSFCell)headerRow0_1.CreateCell(7);
        //    requestsSheet.SetColumnWidth(7, 2500);
        //    cell0_1_7.CellStyle = fontAndBorderStyle;
        //    cell0_1_7.SetCellValue("NET UG");

        //    XSSFCell cell0_0_8 = (XSSFCell)headerRow0_0.CreateCell(8);
        //    cell0_0_8.CellStyle = fontOnlyStyle;
        //    cell0_0_8.SetCellValue("RESOURCES ACQUIRED");
        //    var cra0_0_8 = new NPOI.SS.Util.CellRangeAddress(0, 0, 8, 13);
        //    requestsSheet.AddMergedRegion(cra0_0_8);

        //    XSSFCell cell0_1_8 = (XSSFCell)headerRow0_1.CreateCell(8);
        //    requestsSheet.SetColumnWidth(8, 2500);
        //    cell0_1_8.CellStyle = fontAndBorderStyle;
        //    cell0_1_8.SetCellValue("DIST.");

        //    XSSFCell cell0_1_9 = (XSSFCell)headerRow0_1.CreateCell(9);
        //    requestsSheet.SetColumnWidth(9, 2500);
        //    cell0_1_9.CellStyle = fontAndBorderStyle;
        //    cell0_1_9.SetCellValue("TRANS.");

        //    XSSFCell cell0_1_10 = (XSSFCell)headerRow0_1.CreateCell(10);
        //    requestsSheet.SetColumnWidth(10, 2500);
        //    cell0_1_10.CellStyle = fontAndBorderStyle;
        //    cell0_1_10.SetCellValue("DAMAGE");

        //    XSSFCell cell0_1_11 = (XSSFCell)headerRow0_1.CreateCell(11);
        //    requestsSheet.SetColumnWidth(11, 2500);
        //    cell0_1_11.CellStyle = fontAndBorderStyle;
        //    cell0_1_11.SetCellValue("TREE");

        //    XSSFCell cell0_1_12 = (XSSFCell)headerRow0_1.CreateCell(12);
        //    requestsSheet.SetColumnWidth(12, 2500);
        //    cell0_1_12.CellStyle = fontAndBorderStyle;
        //    cell0_1_12.SetCellValue("SUBST.");

        //    XSSFCell cell0_1_13 = (XSSFCell)headerRow0_1.CreateCell(13);
        //    requestsSheet.SetColumnWidth(13, 2500);
        //    cell0_1_13.CellStyle = fontAndBorderStyle;
        //    cell0_1_13.SetCellValue("NET UG");

        //    #endregion



        //    REPORTBL objREPORTBL = new REPORTBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //    int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //    int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //    List<REPORTDC> resourcereport = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE, "RESOURCES");
        //    List<REPORTDC> resourceallocationreport = objREPORTBL.GenerateResourceReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE);

        //    ///  Calculation for allocation

        //    double dis_sum = 0;
        //    double trn_sum = 0;
        //    double dam_sum = 0;
        //    double tre_sum = 0;
        //    double sub_sum = 0;
        //    double net_sum = 0;

        //    double dis_sum_nn = 0;
        //    double trn_sum_nn = 0;
        //    double dam_sum_nn = 0;
        //    double tre_sum_nn = 0;
        //    double sub_sum_nn = 0;
        //    double net_sum_nn = 0;




        //    #region Build Header - Allocation Detail

        //    //headerRow names are like: headerRowSheetx_Rowx
        //    XSSFRow headerRow1_0 = (XSSFRow)responsesSheet.CreateRow(0);
        //    XSSFRow headerRow1_1 = (XSSFRow)responsesSheet.CreateRow(1);
        //    XSSFRow headerRow1_2 = (XSSFRow)responsesSheet.CreateRow(2);
        //    XSSFRow headerRow1_3 = (XSSFRow)responsesSheet.CreateRow(3);

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_r0_c0 = (XSSFCell)headerRow1_0.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_r0_c0.CellStyle = fontOnlyStyle;
        //    cell1_r0_c0.SetCellValue("ACQUIRED RESOURCE TYPE");
        //    var cra1_r0_r0 = new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 1);
        //    responsesSheet.AddMergedRegion(cra1_r0_r0);

        //    XSSFCell cell1_r0_c2 = (XSSFCell)headerRow1_0.CreateCell(2);
        //    responsesSheet.SetColumnWidth(2, 5000);
        //    cell1_r0_c2.CellStyle = fontOnlyStyle;
        //    cell1_r0_c2.SetCellValue("DISTRIBUTION");

        //    XSSFCell cell1_r0_c3 = (XSSFCell)headerRow1_0.CreateCell(3);
        //    responsesSheet.SetColumnWidth(3, 5000);
        //    cell1_r0_c3.CellStyle = fontOnlyStyle;
        //    cell1_r0_c3.SetCellValue("TRANSMISSION");

        //    XSSFCell cell1_r0_c4 = (XSSFCell)headerRow1_0.CreateCell(4);
        //    responsesSheet.SetColumnWidth(4, 5000);
        //    cell1_r0_c4.CellStyle = fontOnlyStyle;
        //    cell1_r0_c4.SetCellValue("DAMAGE");

        //    XSSFCell cell1_r0_c5 = (XSSFCell)headerRow1_0.CreateCell(5);
        //    responsesSheet.SetColumnWidth(5, 5000);
        //    cell1_r0_c5.CellStyle = fontOnlyStyle;
        //    cell1_r0_c5.SetCellValue("TREE");

        //    XSSFCell cell1_r0_c6 = (XSSFCell)headerRow1_0.CreateCell(6);
        //    responsesSheet.SetColumnWidth(6, 5000);
        //    cell1_r0_c6.CellStyle = fontOnlyStyle;
        //    cell1_r0_c6.SetCellValue("SUBSTATION");

        //    XSSFCell cell1_r0_c7 = (XSSFCell)headerRow1_0.CreateCell(7);
        //    responsesSheet.SetColumnWidth(7, 5000);
        //    cell1_r0_c7.CellStyle = fontOnlyStyle;
        //    cell1_r0_c7.SetCellValue("NET UG");


        //    ////  Second Row

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_r1_c0 = (XSSFCell)headerRow1_1.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_r1_c0.CellStyle = fontOnlyStyle;
        //    cell1_r1_c0.SetCellValue("TOTAL RESOURCE REQUEST");
        //    var cra1_r1_r0 = new NPOI.SS.Util.CellRangeAddress(1, 1, 0, 1);
        //    responsesSheet.AddMergedRegion(cra1_r1_r0);

        //    XSSFCell cell1_r1_c2 = (XSSFCell)headerRow1_1.CreateCell(2);
        //    responsesSheet.SetColumnWidth(2, 5000);


        //    XSSFCell cell1_r1_c3 = (XSSFCell)headerRow1_1.CreateCell(3);
        //    responsesSheet.SetColumnWidth(3, 5000);


        //    XSSFCell cell1_r1_c4 = (XSSFCell)headerRow1_1.CreateCell(4);
        //    responsesSheet.SetColumnWidth(4, 5000);


        //    XSSFCell cell1_r1_c5 = (XSSFCell)headerRow1_1.CreateCell(5);
        //    responsesSheet.SetColumnWidth(5, 5000);


        //    XSSFCell cell1_r1_c6 = (XSSFCell)headerRow1_1.CreateCell(6);
        //    responsesSheet.SetColumnWidth(6, 5000);


        //    XSSFCell cell1_r1_c7 = (XSSFCell)headerRow1_1.CreateCell(7);
        //    responsesSheet.SetColumnWidth(7, 5000);



        //    ////// Third Header row


        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_r2_c0 = (XSSFCell)headerRow1_2.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_r2_c0.CellStyle = fontOnlyStyle;
        //    cell1_r2_c0.SetCellValue("% RESOURCE REQUESTED VS. OBTAINED");
        //    var cra1_r2_r0 = new NPOI.SS.Util.CellRangeAddress(2, 2, 0, 1);
        //    responsesSheet.AddMergedRegion(cra1_r2_r0);

        //    XSSFCell cell1_r2_c2 = (XSSFCell)headerRow1_2.CreateCell(2);
        //    responsesSheet.SetColumnWidth(2, 5000);


        //    XSSFCell cell1_r2_c3 = (XSSFCell)headerRow1_2.CreateCell(3);
        //    responsesSheet.SetColumnWidth(3, 5000);


        //    XSSFCell cell1_r2_c4 = (XSSFCell)headerRow1_2.CreateCell(4);
        //    responsesSheet.SetColumnWidth(4, 5000);


        //    XSSFCell cell1_r2_c5 = (XSSFCell)headerRow1_2.CreateCell(5);
        //    responsesSheet.SetColumnWidth(5, 5000);


        //    XSSFCell cell1_r2_c6 = (XSSFCell)headerRow1_2.CreateCell(6);
        //    responsesSheet.SetColumnWidth(6, 5000);


        //    XSSFCell cell1_r2_c7 = (XSSFCell)headerRow1_2.CreateCell(7);
        //    responsesSheet.SetColumnWidth(7, 5000);




        //    /////   Allocation Table

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_r3_c0 = (XSSFCell)headerRow1_3.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_r3_c0.CellStyle = fontOnlyStyle;
        //    cell1_r3_c0.SetCellValue("ALLOCATION DETAIL");
        //    var cra1_r3_r0 = new NPOI.SS.Util.CellRangeAddress(3, 3, 0, 22);
        //    responsesSheet.AddMergedRegion(cra1_r3_r0);


        //    //headerRow names are like: headerRowSheetx_Rowx
        //    XSSFRow headerRow1_4 = (XSSFRow)responsesSheet.CreateRow(4);
        //    XSSFRow headerRow1_5 = (XSSFRow)responsesSheet.CreateRow(5);

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_0_0 = (XSSFCell)headerRow1_4.CreateCell(0);
        //    XSSFCell cell1_1_0 = (XSSFCell)headerRow1_5.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_0_0.CellStyle = fontOnlyStyle;
        //    cell1_1_0.CellStyle = fontAndBorderStyle;
        //    cell1_0_0.SetCellValue("COMPANY");
        //    var cra1_0_0 = new NPOI.SS.Util.CellRangeAddress(4, 5, 0, 0);
        //    responsesSheet.AddMergedRegion(cra1_0_0);

        //    XSSFCell cell1_0_1 = (XSSFCell)headerRow1_4.CreateCell(1);
        //    XSSFCell cell1_1_1 = (XSSFCell)headerRow1_5.CreateCell(1);
        //    responsesSheet.SetColumnWidth(1, 5000);
        //    cell1_0_1.CellStyle = fontOnlyStyle;
        //    cell1_1_1.CellStyle = fontAndBorderStyle;
        //    cell1_0_1.SetCellValue("RMAG");
        //    var cra1_0_1 = new NPOI.SS.Util.CellRangeAddress(4, 5, 1, 1);
        //    responsesSheet.AddMergedRegion(cra1_0_1);

        //    XSSFCell cell1_0_2 = (XSSFCell)headerRow1_4.CreateCell(2);
        //    XSSFCell cell1_1_2 = (XSSFCell)headerRow1_5.CreateCell(2);
        //    responsesSheet.SetColumnWidth(2, 10000);
        //    cell1_0_2.CellStyle = fontOnlyStyle;
        //    cell1_1_2.CellStyle = fontAndBorderStyle;
        //    cell1_0_2.SetCellValue("COMPANY/NON-COMPANY");
        //    var cra1_0_2 = new NPOI.SS.Util.CellRangeAddress(4, 5, 2, 2);
        //    responsesSheet.AddMergedRegion(cra1_0_2);


        //    XSSFCell cell1_0_3 = (XSSFCell)headerRow1_4.CreateCell(3);
        //    XSSFCell cell1_1_3 = (XSSFCell)headerRow1_5.CreateCell(3);
        //    responsesSheet.SetColumnWidth(3, 5000);
        //    cell1_0_3.CellStyle = fontOnlyStyle;
        //    cell1_1_3.CellStyle = fontAndBorderStyle;
        //    cell1_0_3.SetCellValue("CITY");
        //    var cra1_0_3 = new NPOI.SS.Util.CellRangeAddress(4, 5, 3, 3);
        //    responsesSheet.AddMergedRegion(cra1_0_3);


        //    XSSFCell cell1_0_4 = (XSSFCell)headerRow1_4.CreateCell(4);
        //    XSSFCell cell1_1_4 = (XSSFCell)headerRow1_5.CreateCell(4);
        //    responsesSheet.SetColumnWidth(4, 5000);
        //    cell1_0_4.CellStyle = fontOnlyStyle;
        //    cell1_1_4.CellStyle = fontAndBorderStyle;
        //    cell1_0_4.SetCellValue("STATE");
        //    var cra1_0_4 = new NPOI.SS.Util.CellRangeAddress(4, 5, 4, 4);
        //    responsesSheet.AddMergedRegion(cra1_0_4);


        //    XSSFCell cell1_0_5 = (XSSFCell)headerRow1_4.CreateCell(5);
        //    XSSFCell cell1_1_5 = (XSSFCell)headerRow1_5.CreateCell(5);
        //    responsesSheet.SetColumnWidth(5, 8000);
        //    cell1_0_5.CellStyle = fontOnlyStyle;
        //    cell1_1_5.CellStyle = fontAndBorderStyle;
        //    cell1_0_5.SetCellValue("RELEASE TO ROLL");
        //    var cra1_0_5 = new NPOI.SS.Util.CellRangeAddress(4, 5, 5, 5);
        //    responsesSheet.AddMergedRegion(cra1_0_5);

        //    XSSFCell cell1_0_6 = (XSSFCell)headerRow1_4.CreateCell(6);
        //    XSSFCell cell1_1_6 = (XSSFCell)headerRow1_5.CreateCell(6);
        //    responsesSheet.SetColumnWidth(6, 10000);
        //    cell1_0_6.CellStyle = fontOnlyStyle;
        //    cell1_1_6.CellStyle = fontAndBorderStyle;
        //    cell1_0_6.SetCellValue("RESPONSE DATE/TIME");
        //    var cra1_0_6 = new NPOI.SS.Util.CellRangeAddress(4, 5, 6, 6);
        //    responsesSheet.AddMergedRegion(cra1_0_6);


        //    XSSFCell cell1_0_7 = (XSSFCell)headerRow1_4.CreateCell(7);
        //    cell1_0_7.CellStyle = fontOnlyStyle;
        //    cell1_0_7.SetCellValue("DISTRIBUTION");
        //    var cra1_0_7 = new NPOI.SS.Util.CellRangeAddress(4, 4, 7, 8);
        //    responsesSheet.AddMergedRegion(cra1_0_7);

        //    XSSFCell cell1_1_22 = (XSSFCell)headerRow1_5.CreateCell(7);
        //    responsesSheet.SetColumnWidth(2, 2500);
        //    cell1_1_22.CellStyle = fontAndBorderStyle;
        //    cell1_1_22.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_33 = (XSSFCell)headerRow1_5.CreateCell(8);
        //    responsesSheet.SetColumnWidth(3, 2500);
        //    cell1_1_33.CellStyle = fontAndBorderStyle;
        //    cell1_1_33.SetCellValue("ACQ.");

        //    XSSFCell cell1_0_9 = (XSSFCell)headerRow1_4.CreateCell(9);
        //    cell1_0_9.CellStyle = fontOnlyStyle;
        //    cell1_0_9.SetCellValue("TRANSMISSION");
        //    var cra1_0_9 = new NPOI.SS.Util.CellRangeAddress(4, 4, 9, 10);
        //    responsesSheet.AddMergedRegion(cra1_0_9);


        //    XSSFCell cell1_1_44 = (XSSFCell)headerRow1_5.CreateCell(9);
        //    responsesSheet.SetColumnWidth(4, 2500);
        //    cell1_1_44.CellStyle = fontAndBorderStyle;
        //    cell1_1_44.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_55 = (XSSFCell)headerRow1_5.CreateCell(10);
        //    responsesSheet.SetColumnWidth(5, 2500);
        //    cell1_1_55.CellStyle = fontAndBorderStyle;
        //    cell1_1_55.SetCellValue("ACQ.");

        //    XSSFCell cell1_0_10 = (XSSFCell)headerRow1_4.CreateCell(11);
        //    cell1_0_10.CellStyle = fontOnlyStyle;
        //    cell1_0_10.SetCellValue("DAMAGE");
        //    var cra1_0_10 = new NPOI.SS.Util.CellRangeAddress(4, 4, 11, 12);
        //    responsesSheet.AddMergedRegion(cra1_0_10);

        //    XSSFCell cell1_1_66 = (XSSFCell)headerRow1_5.CreateCell(11);
        //    responsesSheet.SetColumnWidth(6, 2500);
        //    cell1_1_66.CellStyle = fontAndBorderStyle;
        //    cell1_1_66.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_77 = (XSSFCell)headerRow1_5.CreateCell(12);
        //    responsesSheet.SetColumnWidth(7, 2500);
        //    cell1_1_77.CellStyle = fontAndBorderStyle;
        //    cell1_1_77.SetCellValue("ACQ.");

        //    XSSFCell cell1_0_11 = (XSSFCell)headerRow1_4.CreateCell(13);
        //    cell1_0_11.CellStyle = fontOnlyStyle;
        //    cell1_0_11.SetCellValue("TREE");
        //    var cra1_0_11 = new NPOI.SS.Util.CellRangeAddress(4, 4, 13, 14);
        //    responsesSheet.AddMergedRegion(cra1_0_11);

        //    XSSFCell cell1_1_666 = (XSSFCell)headerRow1_5.CreateCell(13);
        //    responsesSheet.SetColumnWidth(6, 2500);
        //    cell1_1_666.CellStyle = fontAndBorderStyle;
        //    cell1_1_666.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_777 = (XSSFCell)headerRow1_5.CreateCell(14);
        //    responsesSheet.SetColumnWidth(7, 2500);
        //    cell1_1_777.CellStyle = fontAndBorderStyle;
        //    cell1_1_777.SetCellValue("ACQ.");


        //    XSSFCell cell1_0_13 = (XSSFCell)headerRow1_4.CreateCell(15);
        //    cell1_0_13.CellStyle = fontOnlyStyle;
        //    cell1_0_13.SetCellValue("SUBSTATION");
        //    var cra1_0_13 = new NPOI.SS.Util.CellRangeAddress(4, 4, 15, 16);
        //    responsesSheet.AddMergedRegion(cra1_0_13);

        //    XSSFCell cell1_1_668 = (XSSFCell)headerRow1_5.CreateCell(15);
        //    responsesSheet.SetColumnWidth(6, 2500);
        //    cell1_1_668.CellStyle = fontAndBorderStyle;
        //    cell1_1_668.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_779 = (XSSFCell)headerRow1_5.CreateCell(16);
        //    responsesSheet.SetColumnWidth(7, 2500);
        //    cell1_1_779.CellStyle = fontAndBorderStyle;
        //    cell1_1_779.SetCellValue("ACQ.");


        //    XSSFCell cell1_0_15 = (XSSFCell)headerRow1_4.CreateCell(17);
        //    cell1_0_15.CellStyle = fontOnlyStyle;
        //    cell1_0_15.SetCellValue("NET UG");
        //    var cra1_0_15 = new NPOI.SS.Util.CellRangeAddress(4, 4, 17, 18);
        //    responsesSheet.AddMergedRegion(cra1_0_15);

        //    XSSFCell cell1_1_6610 = (XSSFCell)headerRow1_5.CreateCell(17);
        //    responsesSheet.SetColumnWidth(6, 2500);
        //    cell1_1_6610.CellStyle = fontAndBorderStyle;
        //    cell1_1_6610.SetCellValue("OFFERS");

        //    XSSFCell cell1_1_7711 = (XSSFCell)headerRow1_5.CreateCell(18);
        //    responsesSheet.SetColumnWidth(7, 2500);
        //    cell1_1_7711.CellStyle = fontAndBorderStyle;
        //    cell1_1_7711.SetCellValue("ACQ.");



        //    #endregion



        //    #region Populate Data - CLIENTS REQUESTING RESOURCES
        //    NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //    NPOI.SS.UserModel.ICell cell;

        //    int rowIndex = 2;
        //    foreach (REPORTDC _matchingRequest in resourcereport)
        //    {
        //        NPOI.SS.UserModel.IRow row = requestsSheet.CreateRow(rowIndex);
        //        row.CreateCell(0).SetCellValue(_matchingRequest.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_matchingRequest.RMAG_NAME);

        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DISTRIBUTION == null ? "0" : _matchingRequest.DISTRIBUTION.ToString("#,##0"));
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TRANSMISSION == null ? "0" : _matchingRequest.TRANSMISSION.ToString("#,##0"));
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT.ToString("#,##0"));
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TREE == null ? "0" : _matchingRequest.TREE.ToString("#,##0"));
        //        cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.SUBSTATION == null ? "0" : _matchingRequest.SUBSTATION.ToString("#,##0"));
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NET_UG == null ? "0" : _matchingRequest.NET_UG.ToString("#,##0"));
        //        cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_DISTRIBUTION == null ? "0" : _matchingRequest.NON_NATIVE_DISTRIBUTION.ToString("#,##0"));
        //        cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_TRANSMISSION == null ? "0" : _matchingRequest.NON_NATIVE_TRANSMISSION.ToString("#,##0"));
        //        cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT.ToString("#,##0"));
        //        cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_TREE == null ? "0" : _matchingRequest.NON_NATIVE_TREE.ToString("#,##0"));
        //        cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_SUBSTATION == null ? "0" : _matchingRequest.NON_NATIVE_SUBSTATION.ToString("#,##0"));
        //        cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NON_NATIVE_NET_UG == null ? "0" : _matchingRequest.NON_NATIVE_NET_UG.ToString("#,##0"));

        //        ///
        //        dis_sum += _matchingRequest.DISTRIBUTION == null ? 0 : _matchingRequest.DISTRIBUTION;
        //        trn_sum += _matchingRequest.TRANSMISSION == null ? 0 : _matchingRequest.TRANSMISSION;
        //        dam_sum += _matchingRequest.DAMAGE_ASSESSMENT == null ? 0 : _matchingRequest.DAMAGE_ASSESSMENT;
        //        tre_sum += _matchingRequest.TREE == null ? 0 : _matchingRequest.TREE;
        //        sub_sum += _matchingRequest.SUBSTATION == null ? 0 : _matchingRequest.SUBSTATION;
        //        net_sum += _matchingRequest.NET_UG == null ? 0 : _matchingRequest.NET_UG;

        //        dis_sum_nn += _matchingRequest.NON_NATIVE_DISTRIBUTION == null ? 0 : _matchingRequest.NON_NATIVE_DISTRIBUTION;
        //        trn_sum_nn += _matchingRequest.NON_NATIVE_TRANSMISSION == null ? 0 : _matchingRequest.NON_NATIVE_TRANSMISSION;
        //        dam_sum_nn += _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT == null ? 0 : _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT;
        //        tre_sum_nn += _matchingRequest.NON_NATIVE_TREE == null ? 0 : _matchingRequest.NON_NATIVE_TREE;
        //        sub_sum_nn += _matchingRequest.NON_NATIVE_SUBSTATION == null ? 0 : _matchingRequest.NON_NATIVE_SUBSTATION;
        //        net_sum_nn += _matchingRequest.NON_NATIVE_NET_UG == null ? 0 : _matchingRequest.NON_NATIVE_NET_UG;

        //        rowIndex++;
        //    }

        //    #endregion



        //    #region Populate Data - CLIENTS OFFERING RESOURCES

        //    rowIndex = 6;
        //    foreach (REPORTDC _matchingResponse in resourceallocationreport)
        //    {
        //        NPOI.SS.UserModel.IRow row = responsesSheet.CreateRow(rowIndex);
        //        TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchingResponse.TIME_ZONE_NAME + " Standard Time");
        //        string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchingResponse.TIME_ZONE_NAME);
        //        row.CreateCell(0).SetCellValue(_matchingResponse.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_matchingResponse.RMAG_NAME);
        //        row.CreateCell(2).SetCellValue(_matchingResponse.IS_COMPANY);
        //        row.CreateCell(3).SetCellValue(_matchingResponse.COMPANY_CITY);
        //        row.CreateCell(4).SetCellValue(_matchingResponse.COMPANY_STATE);
        //        row.CreateCell(5).SetCellValue(String.IsNullOrEmpty(_matchingResponse.RELEASE_ROLE) ? "" : TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(_matchingResponse.RELEASE_ROLE), eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //        row.CreateCell(6).SetCellValue(String.IsNullOrEmpty(_matchingResponse.MODIFIED_ON) ? "" : TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(_matchingResponse.MODIFIED_ON), eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.DISTRIBUTION == null ? "0" : _matchingResponse.DISTRIBUTION.ToString("#,##0"));
        //        cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_DISTRIBUTION == null ? "0" : _matchingResponse.NON_NATIVE_DISTRIBUTION.ToString("#,##0"));
        //        cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.TRANSMISSION == null ? "0" : _matchingResponse.TRANSMISSION.ToString("#,##0"));
        //        cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_TRANSMISSION == null ? "0" : _matchingResponse.NON_NATIVE_TRANSMISSION.ToString("#,##0"));
        //        cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.DAMAGE_ASSESSMENT.ToString("#,##0"));
        //        cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.NON_NATIVE_DAMAGE_ASSESSMENT.ToString("#,##0"));
        //        cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.TREE == null ? "0" : _matchingResponse.TREE.ToString("#,##0"));
        //        cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_TREE == null ? "0" : _matchingResponse.NON_NATIVE_TREE.ToString("#,##0"));
        //        cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.SUBSTATION == null ? "0" : _matchingResponse.SUBSTATION.ToString("#,##0"));
        //        cell = row.CreateCell(16); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_SUBSTATION == null ? "0" : _matchingResponse.NON_NATIVE_SUBSTATION.ToString("#,##0"));
        //        cell = row.CreateCell(17); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NET_UG == null ? "0" : _matchingResponse.NET_UG.ToString("#,##0"));
        //        cell = row.CreateCell(18); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NON_NATIVE_NET_UG == null ? "0" : _matchingResponse.NON_NATIVE_NET_UG.ToString("#,##0"));



        //        rowIndex++;
        //    }

        //    cell1_r1_c2.CellStyle = numberStyle; cell1_r1_c2.SetCellValue(dis_sum.ToString("#,##0"));
        //    cell1_r1_c3.CellStyle = numberStyle; cell1_r1_c3.SetCellValue(trn_sum.ToString("#,##0"));
        //    cell1_r1_c4.CellStyle = numberStyle; cell1_r1_c4.SetCellValue(dam_sum.ToString("#,##0"));
        //    cell1_r1_c5.CellStyle = numberStyle; cell1_r1_c5.SetCellValue(tre_sum.ToString("#,##0"));
        //    cell1_r1_c6.CellStyle = numberStyle; cell1_r1_c6.SetCellValue(sub_sum.ToString("#,##0"));
        //    cell1_r1_c7.CellStyle = numberStyle; cell1_r1_c7.SetCellValue(net_sum.ToString("#,##0"));

        //    cell1_r2_c2.CellStyle = numberStyle; cell1_r2_c2.SetCellValue(string.Format("{0:0.00}", ((dis_sum_nn / dis_sum) * 100)) + " %");
        //    cell1_r2_c3.CellStyle = numberStyle; cell1_r2_c3.SetCellValue((((trn_sum_nn / trn_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((trn_sum_nn / trn_sum) * 100))) + " %");
        //    cell1_r2_c4.CellStyle = numberStyle; cell1_r2_c4.SetCellValue((((dam_sum_nn / dam_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((dam_sum_nn / dam_sum) * 100))) + " %");
        //    cell1_r2_c5.CellStyle = numberStyle; cell1_r2_c5.SetCellValue((((tre_sum_nn / tre_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((tre_sum_nn / tre_sum) * 100))) + " %");
        //    cell1_r2_c6.CellStyle = numberStyle; cell1_r2_c6.SetCellValue((((sub_sum_nn / sub_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((sub_sum_nn / sub_sum) * 100))) + " %");
        //    cell1_r2_c7.CellStyle = numberStyle; cell1_r2_c7.SetCellValue((((net_sum_nn / net_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((net_sum_nn / net_sum) * 100))) + " %");

        //    #endregion
        //}


        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportResourceReport(ref Table table, PreFormatedExportData data)
        //{

        //    {
        //        Unit width, height;
        //        PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //        width = Unit.FromMillimeter(1000);
        //        table.Section.PageSetup.PageWidth = width;
        //        table.Section.PageSetup.PageHeight = height;

        //        #region Build Header

        //        Column column = table.AddColumn(Unit.FromInch(3));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));

        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));

        //        Row headerRow1 = table.AddRow();
        //        Row headerRow2 = table.AddRow();

        //        Paragraph p;

        //        headerRow1.Cells[0].MergeDown = 1;
        //        p = headerRow1.Cells[0].AddParagraph();
        //        p.AddFormattedText("COMPANY", TextFormat.Bold);

        //        headerRow1.Cells[1].MergeDown = 1;
        //        p = headerRow1.Cells[1].AddParagraph();
        //        p.AddFormattedText("RMAG", TextFormat.Bold);

        //        headerRow1.Cells[2].MergeRight = 5;
        //        p = headerRow1.Cells[2].AddParagraph();
        //        p.AddFormattedText("RESOURCE REQUESTS", TextFormat.Bold);

        //        p = headerRow2.Cells[2].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[3].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[4].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[5].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[6].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[7].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[8].MergeRight = 5;
        //        p = headerRow1.Cells[8].AddParagraph();
        //        p.AddFormattedText("RESOURCES ACQUIRED", TextFormat.Bold);

        //        p = headerRow2.Cells[8].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[9].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[10].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[11].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[12].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[13].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[14].Borders.Color = new Color(255, 255, 255);
        //        headerRow1.Cells[14].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow1.Cells[15].Borders.Color = new Color(255, 255, 255);

        //        headerRow1.Cells[16].Borders.Color = new Color(255, 255, 255);

        //        headerRow1.Cells[17].Borders.Color = new Color(255, 255, 255);

        //        headerRow1.Cells[18].Borders.Color = new Color(255, 255, 255);

        //        headerRow1.Cells[19].Borders.Color = new Color(255, 255, 255);


        //        headerRow2.Cells[14].Borders.Color = new Color(255, 255, 255);
        //        headerRow2.Cells[14].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow2.Cells[15].Borders.Color = new Color(255, 255, 255);

        //        headerRow2.Cells[16].Borders.Color = new Color(255, 255, 255);

        //        headerRow2.Cells[17].Borders.Color = new Color(255, 255, 255);

        //        headerRow2.Cells[18].Borders.Color = new Color(255, 255, 255);

        //        headerRow2.Cells[19].Borders.Color = new Color(255, 255, 255);


        //        #endregion

        //        //Get data from DB
        //        REPORTBL objREPORTBL = new REPORTBL();
        //        int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //        string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //        int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //        int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //        List<REPORTDC> resourcereport = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE, "RESOURCES");
        //        List<REPORTDC> resourceallocationreport = objREPORTBL.GenerateResourceReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE);

        //        ///  Calculation for allocation

        //        double dis_sum = 0;
        //        double trn_sum = 0;
        //        double dam_sum = 0;
        //        double tre_sum = 0;
        //        double sub_sum = 0;
        //        double net_sum = 0;

        //        double dis_sum_nn = 0;
        //        double trn_sum_nn = 0;
        //        double dam_sum_nn = 0;
        //        double tre_sum_nn = 0;
        //        double sub_sum_nn = 0;
        //        double net_sum_nn = 0;

        //        #region Populate Data

        //        int maxVal = resourcereport.Count;

        //        for (int i = 0; i < maxVal; i++)
        //        {
        //            Row row = table.AddRow();
        //            REPORTDC _matchingRequest = null;

        //            if (i < resourcereport.Count)
        //                _matchingRequest = resourcereport[i];

        //            if (_matchingRequest != null)
        //            {
        //                row.Cells[0].AddParagraph(_matchingRequest.COMPANY_NAME);
        //                row.Cells[1].AddParagraph(_matchingRequest.RMAG_NAME);
        //                row.Cells[2].AddParagraph(_matchingRequest.DISTRIBUTION == null ? "0" : _matchingRequest.DISTRIBUTION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[3].AddParagraph(_matchingRequest.TRANSMISSION == null ? "0" : _matchingRequest.TRANSMISSION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[4].AddParagraph(_matchingRequest.DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[5].AddParagraph(_matchingRequest.TREE == null ? "0" : _matchingRequest.TREE.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[6].AddParagraph(_matchingRequest.SUBSTATION == null ? "0" : _matchingRequest.SUBSTATION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[7].AddParagraph(_matchingRequest.NET_UG == null ? "0" : _matchingRequest.NET_UG.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[8].AddParagraph(_matchingRequest.NON_NATIVE_DISTRIBUTION == null ? "0" : _matchingRequest.NON_NATIVE_DISTRIBUTION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[9].AddParagraph(_matchingRequest.NON_NATIVE_TRANSMISSION == null ? "0" : _matchingRequest.NON_NATIVE_TRANSMISSION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[10].AddParagraph(_matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[11].AddParagraph(_matchingRequest.NON_NATIVE_TREE == null ? "0" : _matchingRequest.NON_NATIVE_TREE.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[12].AddParagraph(_matchingRequest.NON_NATIVE_SUBSTATION == null ? "0" : _matchingRequest.NON_NATIVE_SUBSTATION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[13].AddParagraph(_matchingRequest.NON_NATIVE_NET_UG == null ? "0" : _matchingRequest.NON_NATIVE_NET_UG.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;

        //                row.Cells[14].Borders.Color = new Color(255, 255, 255);
        //                row.Cells[14].Borders.Left.Color = new Color(0, 0, 0);

        //                row.Cells[15].Borders.Color = new Color(255, 255, 255);

        //                row.Cells[16].Borders.Color = new Color(255, 255, 255);

        //                row.Cells[17].Borders.Color = new Color(255, 255, 255);

        //                row.Cells[18].Borders.Color = new Color(255, 255, 255);

        //                row.Cells[19].Borders.Color = new Color(255, 255, 255);

        //                ///
        //                dis_sum += _matchingRequest.DISTRIBUTION == null ? 0 : _matchingRequest.DISTRIBUTION;
        //                trn_sum += _matchingRequest.TRANSMISSION == null ? 0 : _matchingRequest.TRANSMISSION;
        //                dam_sum += _matchingRequest.DAMAGE_ASSESSMENT == null ? 0 : _matchingRequest.DAMAGE_ASSESSMENT;
        //                tre_sum += _matchingRequest.TREE == null ? 0 : _matchingRequest.TREE;
        //                sub_sum += _matchingRequest.SUBSTATION == null ? 0 : _matchingRequest.SUBSTATION;
        //                net_sum += _matchingRequest.NET_UG == null ? 0 : _matchingRequest.NET_UG;

        //                dis_sum_nn += _matchingRequest.NON_NATIVE_DISTRIBUTION == null ? 0 : _matchingRequest.NON_NATIVE_DISTRIBUTION;
        //                trn_sum_nn += _matchingRequest.NON_NATIVE_TRANSMISSION == null ? 0 : _matchingRequest.NON_NATIVE_TRANSMISSION;
        //                dam_sum_nn += _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT == null ? 0 : _matchingRequest.NON_NATIVE_DAMAGE_ASSESSMENT;
        //                tre_sum_nn += _matchingRequest.NON_NATIVE_TREE == null ? 0 : _matchingRequest.NON_NATIVE_TREE;
        //                sub_sum_nn += _matchingRequest.NON_NATIVE_SUBSTATION == null ? 0 : _matchingRequest.NON_NATIVE_SUBSTATION;
        //                net_sum_nn += _matchingRequest.NON_NATIVE_NET_UG == null ? 0 : _matchingRequest.NON_NATIVE_NET_UG;
        //            }

        //        }

        //        Row headerRow7 = table.AddRow();
        //        headerRow7.Borders.Color = new Color(255, 255, 255);
        //        Row headerRow8 = table.AddRow();
        //        headerRow8.Borders.Color = new Color(255, 255, 255);
        //        Row headerRow9 = table.AddRow();
        //        headerRow9.Borders.Color = new Color(255, 255, 255);
        //        Row headerRow10 = table.AddRow();
        //        headerRow10.Borders.Color = new Color(255, 255, 255);
        //        Row headerRow11 = table.AddRow();
        //        headerRow11.Borders.Color = new Color(255, 255, 255);

        //        headerRow11.Cells[0].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[1].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[2].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[3].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[4].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[5].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[6].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow11.Cells[7].Borders.Bottom.Color = new Color(0, 0, 0);

        //        //////// Analysis table   /////

        //        Row headerRow12 = table.AddRow();

        //        headerRow12.Cells[0].MergeRight = 1;
        //        headerRow12.Cells[0].Borders.Top.Color = new Color(0, 0, 0);
        //        p = headerRow12.Cells[0].AddParagraph();
        //        p.AddFormattedText("ACQUIRED RESOURCE TYPE", TextFormat.Bold);

        //        p = headerRow12.Cells[2].AddParagraph();
        //        headerRow12.Cells[2].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //        p = headerRow12.Cells[3].AddParagraph();
        //        headerRow12.Cells[3].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //        p = headerRow12.Cells[4].AddParagraph();
        //        headerRow12.Cells[4].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow12.Cells[5].AddParagraph();
        //        headerRow12.Cells[5].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow12.Cells[6].AddParagraph();
        //        headerRow12.Cells[6].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //        p = headerRow12.Cells[7].AddParagraph();
        //        headerRow12.Cells[7].Borders.Top.Color = new Color(0, 0, 0);
        //        p.AddFormattedText("NET UG", TextFormat.Bold);
        //        headerRow12.Cells[7].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow12.Cells[8].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[9].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[10].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[11].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[12].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[13].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[14].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[15].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[16].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[17].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[18].Borders.Color = new Color(255, 255, 255);
        //        headerRow12.Cells[19].Borders.Color = new Color(255, 255, 255);

        //        Row headerRow13 = table.AddRow();

        //        headerRow13.Cells[0].MergeRight = 1;
        //        p = headerRow13.Cells[0].AddParagraph();
        //        p.AddFormattedText("TOTAL RESOURCE REQUEST", TextFormat.Bold);

        //        p = headerRow13.Cells[2].AddParagraph();
        //        p.AddFormattedText(dis_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow13.Cells[3].AddParagraph();
        //        p.AddFormattedText(trn_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow13.Cells[4].AddParagraph();
        //        p.AddFormattedText(dam_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow13.Cells[5].AddParagraph();
        //        p.AddFormattedText(tre_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow13.Cells[6].AddParagraph();
        //        p.AddFormattedText(sub_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow13.Cells[7].AddParagraph();
        //        p.AddFormattedText(net_sum.ToString("#,##0")); p.Format.Alignment = ParagraphAlignment.Right;
        //        headerRow13.Cells[7].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow13.Cells[8].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[9].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[10].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[11].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[12].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[13].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[14].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[15].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[16].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[17].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[18].Borders.Color = new Color(255, 255, 255);
        //        headerRow13.Cells[19].Borders.Color = new Color(255, 255, 255);


        //        Row headerRow14 = table.AddRow();

        //        headerRow14.Cells[0].MergeRight = 1;
        //        p = headerRow14.Cells[0].AddParagraph();
        //        p.AddFormattedText("% RESOURCE REQUESTED VS. OBTAINED", TextFormat.Bold);

        //        p = headerRow14.Cells[2].AddParagraph();
        //        p.AddFormattedText((((dis_sum_nn / dis_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((dis_sum_nn / dis_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow14.Cells[3].AddParagraph();
        //        p.AddFormattedText((((trn_sum_nn / trn_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((trn_sum_nn / trn_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow14.Cells[4].AddParagraph();
        //        p.AddFormattedText((((dam_sum_nn / dam_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((dam_sum_nn / dam_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow14.Cells[5].AddParagraph();
        //        p.AddFormattedText((((tre_sum_nn / tre_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((tre_sum_nn / tre_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow14.Cells[6].AddParagraph();
        //        p.AddFormattedText((((sub_sum_nn / sub_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((sub_sum_nn / sub_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;

        //        p = headerRow14.Cells[7].AddParagraph();
        //        p.AddFormattedText((((net_sum_nn / net_sum) * 100).ToString() == "NaN" ? "0" : string.Format("{0:0.00}", ((net_sum_nn / net_sum) * 100))) + " %");
        //        p.Format.Alignment = ParagraphAlignment.Right;
        //        headerRow14.Cells[7].Borders.Left.Color = new Color(0, 0, 0);


        //        headerRow14.Cells[8].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[9].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[10].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[11].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[12].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[13].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[14].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[15].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[16].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[17].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[18].Borders.Color = new Color(255, 255, 255);
        //        headerRow14.Cells[19].Borders.Color = new Color(255, 255, 255);


        //        Row headerRow4 = table.AddRow();
        //        headerRow4.Borders.Color = new Color(255, 255, 255);

        //        headerRow4.Cells[0].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[1].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[2].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[3].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[4].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[5].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[6].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[7].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[8].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[9].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[10].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[11].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[12].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[13].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[14].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[15].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[16].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[17].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[18].Borders.Bottom.Color = new Color(0, 0, 0);
        //        headerRow4.Cells[17].Borders.Bottom.Color = new Color(0, 0, 0);

        //        Row headerRow5 = table.AddRow();
        //        Row headerRow6 = table.AddRow();

        //        headerRow5.Cells[19].Borders.Color = new Color(255, 255, 255);
        //        headerRow5.Cells[19].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow6.Cells[19].Borders.Color = new Color(255, 255, 255);
        //        headerRow6.Cells[19].Borders.Left.Color = new Color(0, 0, 0);

        //        headerRow5.Cells[0].MergeDown = 1;
        //        p = headerRow5.Cells[0].AddParagraph();
        //        p.AddFormattedText("COMPANY", TextFormat.Bold);

        //        headerRow5.Cells[1].MergeDown = 1;
        //        p = headerRow5.Cells[1].AddParagraph();
        //        p.AddFormattedText("RMAG", TextFormat.Bold);

        //        headerRow5.Cells[2].MergeDown = 1;
        //        p = headerRow5.Cells[2].AddParagraph();
        //        p.AddFormattedText("COMPANY/NON-COMPANY", TextFormat.Bold);

        //        headerRow5.Cells[3].MergeDown = 1;
        //        p = headerRow5.Cells[3].AddParagraph();
        //        p.AddFormattedText("CITY", TextFormat.Bold);

        //        headerRow5.Cells[4].MergeDown = 1;
        //        p = headerRow5.Cells[4].AddParagraph();
        //        p.AddFormattedText("STATE", TextFormat.Bold);

        //        headerRow5.Cells[5].MergeDown = 1;
        //        p = headerRow5.Cells[5].AddParagraph();
        //        p.AddFormattedText("RELEASE TO ROLL", TextFormat.Bold);

        //        headerRow5.Cells[6].MergeDown = 1;
        //        p = headerRow5.Cells[6].AddParagraph();
        //        p.AddFormattedText("RESPONSE DATE/TIME", TextFormat.Bold);

        //        headerRow5.Cells[7].MergeRight = 1;
        //        p = headerRow5.Cells[7].AddParagraph();
        //        p.AddFormattedText("DISTRIBUTION", TextFormat.Bold);

        //        p = headerRow6.Cells[7].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[8].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[9].MergeRight = 1;
        //        p = headerRow5.Cells[9].AddParagraph();
        //        p.AddFormattedText("TRANSMISSION", TextFormat.Bold);

        //        p = headerRow6.Cells[9].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[10].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[11].MergeRight = 1;
        //        p = headerRow5.Cells[11].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow6.Cells[11].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[12].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[13].MergeRight = 1;
        //        p = headerRow5.Cells[13].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow6.Cells[13].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[14].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[15].MergeRight = 1;
        //        p = headerRow5.Cells[15].AddParagraph();
        //        p.AddFormattedText("SUBSTATION", TextFormat.Bold);

        //        p = headerRow6.Cells[15].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[16].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[17].MergeRight = 1;
        //        p = headerRow5.Cells[17].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        p = headerRow6.Cells[17].AddParagraph();
        //        p.AddFormattedText("OFFERS", TextFormat.Bold);

        //        p = headerRow6.Cells[18].AddParagraph();
        //        p.AddFormattedText("ACQ.", TextFormat.Bold);

        //        headerRow5.Cells[19].Borders.Color = new Color(255, 255, 255);
        //        headerRow5.Cells[19].Borders.Left.Color = new Color(0, 0, 0);

        //        maxVal = resourceallocationreport.Count;

        //        for (int i = 0; i < maxVal; i++)
        //        {
        //            Row row = table.AddRow();
        //            REPORTDC _matchingResponse = null;
        //            //  MATCHING_RESPONSESDC _matchingResponse = null;
        //            if (i < resourceallocationreport.Count)
        //                _matchingResponse = resourceallocationreport[i];

        //            if (_matchingResponse != null)
        //            {
        //                TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchingResponse.TIME_ZONE_NAME + " Standard Time");
        //                string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchingResponse.TIME_ZONE_NAME);
        //                row.Cells[0].AddParagraph(_matchingResponse.COMPANY_NAME);
        //                row.Cells[1].AddParagraph(_matchingResponse.RMAG_NAME);
        //                row.Cells[2].AddParagraph(_matchingResponse.IS_COMPANY);
        //                row.Cells[3].AddParagraph(_matchingResponse.COMPANY_CITY);
        //                row.Cells[4].AddParagraph(_matchingResponse.COMPANY_STATE);
        //                row.Cells[5].AddParagraph(String.IsNullOrEmpty(_matchingResponse.RELEASE_ROLE) ? "" : TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(_matchingResponse.RELEASE_ROLE), eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //                row.Cells[6].AddParagraph(String.IsNullOrEmpty(_matchingResponse.MODIFIED_ON)  ? "" : TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(_matchingResponse.MODIFIED_ON), eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //                row.Cells[7].AddParagraph(_matchingResponse.DISTRIBUTION == null ? "0" : _matchingResponse.DISTRIBUTION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[8].AddParagraph(_matchingResponse.NON_NATIVE_DISTRIBUTION == null ? "0" : _matchingResponse.NON_NATIVE_DISTRIBUTION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[9].AddParagraph(_matchingResponse.TRANSMISSION == null ? "0" : _matchingResponse.TRANSMISSION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[10].AddParagraph(_matchingResponse.NON_NATIVE_TRANSMISSION == null ? "0" : _matchingResponse.NON_NATIVE_TRANSMISSION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[11].AddParagraph(_matchingResponse.DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.DAMAGE_ASSESSMENT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[12].AddParagraph(_matchingResponse.NON_NATIVE_DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.NON_NATIVE_DAMAGE_ASSESSMENT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[13].AddParagraph(_matchingResponse.TREE == null ? "0" : _matchingResponse.TREE.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[14].AddParagraph(_matchingResponse.NON_NATIVE_TREE == null ? "0" : _matchingResponse.NON_NATIVE_TREE.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[15].AddParagraph(_matchingResponse.SUBSTATION == null ? "0" : _matchingResponse.SUBSTATION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[16].AddParagraph(_matchingResponse.NON_NATIVE_SUBSTATION == null ? "0" : _matchingResponse.NON_NATIVE_SUBSTATION.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[17].AddParagraph(_matchingResponse.NET_UG == null ? "0" : _matchingResponse.NET_UG.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[18].AddParagraph(_matchingResponse.NON_NATIVE_NET_UG == null ? "0" : _matchingResponse.NON_NATIVE_NET_UG.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;

        //                row.Cells[19].Borders.Color = new Color(255, 255, 255);
        //                row.Cells[19].Borders.Left.Color = new Color(0, 0, 0);
        //            }
        //        }


        //        #endregion
        //    }
        //}



        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportOutageCasesReport(XSSFSheet sheet, PreFormatedExportData data)
        //{
        //    #region Build Header


        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    fontAndBorderStyle.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
        //    fontAndBorderStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        //    style.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    style.SetFont(font);
        //    style.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_20 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    cell0_20.CellStyle = style;
        //    cell0_20.SetCellValue("OUTAGE CASES CONSOLIDATED REPORT");
        //    var cra20 = new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 5);
        //    sheet.AddMergedRegion(cra20);

        //    XSSFCell cell0 = (XSSFCell)headerRow1.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0.CellStyle = fontAndBorderStyle;
        //    cell0.SetCellValue("COMPANY");

        //    XSSFCell cell1 = (XSSFCell)headerRow1.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell1.CellStyle = fontAndBorderStyle;
        //    cell1.SetCellValue("RMAG");

        //    XSSFCell cell2 = (XSSFCell)headerRow1.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell2.CellStyle = fontAndBorderStyle;
        //    cell2.SetCellValue("TOTAL CUSTOMER");

        //    XSSFCell cell3 = (XSSFCell)headerRow1.CreateCell(3);
        //    sheet.SetColumnWidth(3, 5000);
        //    cell3.CellStyle = fontAndBorderStyle;
        //    cell3.SetCellValue("CUSTOMER OUT");

        //    XSSFCell cell4 = (XSSFCell)headerRow1.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell4.CellStyle = fontAndBorderStyle;
        //    cell4.SetCellValue("CASES");

        //    XSSFCell cell5 = (XSSFCell)headerRow1.CreateCell(5);
        //    sheet.SetColumnWidth(5, 5000);
        //    cell5.CellStyle = fontAndBorderStyle;
        //    cell5.SetCellValue("%CUSTOMER OUT");

        //    XSSFCell cell0_21 = (XSSFCell)headerRow0_0.CreateCell(6);
        //    cell0_21.CellStyle = style;
        //    cell0_21.SetCellValue("% RESOURCES ALLOCATED FROM TOTAL RESOURCES AVAILABLE");
        //    var cra21 = new NPOI.SS.Util.CellRangeAddress(0, 0, 6, 11);
        //    sheet.AddMergedRegion(cra21);


        //    XSSFCell cell6 = (XSSFCell)headerRow1.CreateCell(6);
        //    sheet.SetColumnWidth(6, 5000);
        //    cell6.CellStyle = fontAndBorderStyle;
        //    cell6.SetCellValue("DIST.");

        //    XSSFCell cell7 = (XSSFCell)headerRow1.CreateCell(7);
        //    sheet.SetColumnWidth(7, 5000);
        //    cell7.CellStyle = fontAndBorderStyle;
        //    cell7.SetCellValue("TRANS.");

        //    XSSFCell cell8 = (XSSFCell)headerRow1.CreateCell(8);
        //    sheet.SetColumnWidth(8, 5000);
        //    cell8.CellStyle = fontAndBorderStyle;
        //    cell8.SetCellValue("DAMAGE");

        //    XSSFCell cell9 = (XSSFCell)headerRow1.CreateCell(9);
        //    sheet.SetColumnWidth(9, 2500);
        //    cell9.CellStyle = fontAndBorderStyle;
        //    cell9.SetCellValue("TREE");

        //    XSSFCell cell10 = (XSSFCell)headerRow1.CreateCell(10);
        //    sheet.SetColumnWidth(10, 5000);
        //    cell10.CellStyle = fontAndBorderStyle;
        //    cell10.SetCellValue("SUBST.");

        //    XSSFCell cell11 = (XSSFCell)headerRow1.CreateCell(11);
        //    sheet.SetColumnWidth(11, 5000);
        //    cell11.CellStyle = fontAndBorderStyle;
        //    cell11.SetCellValue("NET UG");


        //    #endregion


        //    //Get data from DB
        //    REPORTBL objREPORTBL = new REPORTBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //    int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //    int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //    List<REPORTDC> outagereportnumber = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE, "CASES");

        //    #region Populate Data
        //    double cus_ser = 0;
        //    double cus_out = 0;
        //    double cases = 0;
        //    double cus_out_per = 0;
        //    double dis_sum = 0;
        //    double trn_sum = 0;
        //    double dam_sum = 0;
        //    double tre_sum = 0;
        //    double sub_sum = 0;
        //    double net_sum = 0;

        //    NPOI.SS.UserModel.IRow Summaryrow = sheet.CreateRow(2);

        //    NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //    NPOI.SS.UserModel.ICell cell;
        //    int rowIndex = 3;
        //    foreach (REPORTDC _item in outagereportnumber)
        //    {
        //        NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //        row.CreateCell(0).SetCellValue(_item.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_item.RMAG_NAME);
        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CUSTOMERS_SERVED.ToString("#,##0"));
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CUSTOMERS_OUT.ToString("#,##0"));
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CASES.ToString("#,##0"));
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(string.Format("{0:0.00}", _item.CUSTOMERS_OUT_PCT) + " %");
        //        cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_item.DISTRIBUTION.ToString("#,##0") + "   -   " + _item.DISTRIBUTION_PCT + "%");
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_item.TRANSMISSION.ToString("#,##0") + "   -   " + _item.TRANSMISSION_PCT + "%");
        //        cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_item.DAMAGE_ASSESSMENT.ToString("#,##0") + "   -   " + _item.DAMAGE_ASSESSMENT_PCT + "%");
        //        cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_item.TREE.ToString("#,##0") + "   -   " + _item.TREE_PCT + "%");
        //        cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_item.SUBSTATION.ToString("#,##0") + "   -   " + _item.SUBSTATION_PCT + "%");
        //        cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_item.NET_UG.ToString("#,##0") + "   -   " + _item.NET_UG_PCT + "%");

        //        cus_ser += _item.CUSTOMERS_SERVED == null ? 0 : _item.CUSTOMERS_SERVED;
        //        cus_out += _item.CUSTOMERS_OUT == null ? 0 : _item.CUSTOMERS_OUT;
        //        cases += _item.CASES == null ? 0 : _item.CASES;
        //        cus_out_per += _item.CUSTOMERS_OUT_PCT == null ? 0 : _item.CUSTOMERS_OUT_PCT;
        //        dis_sum += _item.DISTRIBUTION == null ? 0 : _item.DISTRIBUTION;
        //        trn_sum += _item.TRANSMISSION == null ? 0 : _item.TRANSMISSION;
        //        dam_sum += _item.DAMAGE_ASSESSMENT == null ? 0 : _item.DAMAGE_ASSESSMENT;
        //        tre_sum += _item.TREE == null ? 0 : _item.TREE;
        //        sub_sum += _item.SUBSTATION == null ? 0 : _item.SUBSTATION;
        //        net_sum += _item.NET_UG == null ? 0 : _item.NET_UG;

        //        rowIndex++;
        //    }

        //    XSSFCell cellS0 = (XSSFCell)Summaryrow.CreateCell(0);
        //    cellS0.SetCellValue("Summary");
        //    cellS0.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS1 = (XSSFCell)Summaryrow.CreateCell(1);
        //    cellS1.SetCellValue("");
        //    cellS1.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS2 = (XSSFCell)Summaryrow.CreateCell(2);
        //    cellS2.SetCellValue(cus_ser.ToString("#,##0"));
        //    cellS2.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS3 = (XSSFCell)Summaryrow.CreateCell(3);
        //    cellS3.SetCellValue(cus_out.ToString("#,##0"));
        //    cellS3.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS4 = (XSSFCell)Summaryrow.CreateCell(4);
        //    cellS4.SetCellValue(cases.ToString("#,##0"));
        //    cellS4.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS5 = (XSSFCell)Summaryrow.CreateCell(5);
        //    cellS5.SetCellValue(string.Format("{0:0.00}", cus_out_per) + " %");
        //    cellS5.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS6 = (XSSFCell)Summaryrow.CreateCell(6);
        //    cellS6.SetCellValue(dis_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? dis_sum : 100) + "%");
        //    cellS6.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS7 = (XSSFCell)Summaryrow.CreateCell(7);
        //    cellS7.SetCellValue(trn_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? trn_sum : 100) + "%");
        //    cellS7.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS8 = (XSSFCell)Summaryrow.CreateCell(8);
        //    cellS8.SetCellValue(dam_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? dam_sum : 100) + "%");
        //    cellS8.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS9 = (XSSFCell)Summaryrow.CreateCell(9);
        //    cellS9.SetCellValue(tre_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? tre_sum : 100) + "%");
        //    cellS9.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS10 = (XSSFCell)Summaryrow.CreateCell(10);
        //    cellS10.SetCellValue(sub_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? sub_sum : 100) + "%");
        //    cellS10.CellStyle = fontAndBorderStyle;

        //    XSSFCell cellS11 = (XSSFCell)Summaryrow.CreateCell(11);
        //    cellS11.SetCellValue(net_sum.ToString("#,##0") + "   -   " + (outagereportnumber.Count == 0 ? net_sum : 100) + "%");
        //    cellS11.CellStyle = fontAndBorderStyle;

        //    #endregion
        //}

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportOutageCasesReport(ref Document document, ref Table table, PreFormatedExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(750);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2));
        //    column = table.AddColumn(Unit.FromInch(2));
        //    column = table.AddColumn(Unit.FromInch(2));
        //    column = table.AddColumn(Unit.FromInch(2));
        //    column = table.AddColumn(Unit.FromInch(2));
        //    column = table.AddColumn(Unit.FromInch(2));


        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow = table.AddRow();

        //    Paragraph p;

        //    headerRow0_0.Cells[0].MergeRight = 5;
        //    p = headerRow0_0.Cells[0].AddParagraph();
        //    p.AddFormattedText("OUTAGE CASES CONSOLIDATED REPORT", TextFormat.Bold);

        //    p = headerRow.Cells[0].AddParagraph();
        //    p.AddFormattedText("COMPANY", TextFormat.Bold);
           
        //    p = headerRow.Cells[1].AddParagraph();
        //    p.AddFormattedText("RMAG", TextFormat.Bold);
        //    p = headerRow.Cells[2].AddParagraph();
        //    p.AddFormattedText("TOTAL CUSTOMER", TextFormat.Bold);
        //    p = headerRow.Cells[3].AddParagraph();
        //    p.AddFormattedText("CUSTOMER OUT", TextFormat.Bold);
        //    p = headerRow.Cells[4].AddParagraph();
        //    p.AddFormattedText("CASES", TextFormat.Bold);
        //    p = headerRow.Cells[5].AddParagraph();
        //    p.AddFormattedText("%CUSTOMER OUT", TextFormat.Bold);

        //    headerRow0_0.Cells[6].MergeRight = 5;
        //    p = headerRow0_0.Cells[6].AddParagraph();
        //    p.AddFormattedText("% RESOURCES ALLOCATED FROM TOTAL RESOURCES AVAILABLE", TextFormat.Bold);


        //    p = headerRow.Cells[6].AddParagraph();
        //    p.AddFormattedText("DIST.", TextFormat.Bold);
        //    p = headerRow.Cells[7].AddParagraph();
        //    p.AddFormattedText("TRANS.", TextFormat.Bold);
        //    p = headerRow.Cells[8].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);
        //    p = headerRow.Cells[9].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);
        //    p = headerRow.Cells[10].AddParagraph();
        //    p.AddFormattedText("SUBST.", TextFormat.Bold);
        //    p = headerRow.Cells[11].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    headerRow.Cells[12].Borders.Color = new Color(255, 255, 255);
        //    headerRow.Cells[12].Borders.Left.Color = new Color(0, 0, 0);

        //    headerRow0_0.Cells[12].Borders.Color = new Color(255, 255, 255);
        //    headerRow0_0.Cells[12].Borders.Left.Color = new Color(0, 0, 0);


        //    #endregion
        //    //Get data from DB
        //    REPORTBL objREPORTBL = new REPORTBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //    int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //    int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //    List<REPORTDC> outagereportnumber = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE, "CASES");

        //    #region Populate Data

        //    Row Summaryrow = table.AddRow();
        //    double cus_ser = 0;
        //    double cus_out = 0;
        //    double cases = 0;
        //    double cus_out_per = 0;
        //    double dis_sum = 0;
        //    double trn_sum = 0;
        //    double dam_sum = 0;
        //    double tre_sum = 0;
        //    double sub_sum = 0;
        //    double net_sum = 0;

        //    int rowIndex = 2;

        //    foreach (REPORTDC _item in outagereportnumber)
        //    {
        //        Row row = table.AddRow();
        //        row.Cells[0].AddParagraph(_item.COMPANY_NAME);
        //        row.Cells[1].AddParagraph(_item.RMAG_NAME);
        //        row.Cells[2].AddParagraph(_item.CUSTOMERS_SERVED == null ? "0" : _item.CUSTOMERS_SERVED.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[3].AddParagraph(_item.CUSTOMERS_OUT == null ? "0" : _item.CUSTOMERS_OUT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[4].AddParagraph(_item.CASES == null ? "0" : _item.CASES.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[5].AddParagraph((_item.CUSTOMERS_OUT == null ? "0" : string.Format("{0:0.00}", _item.CUSTOMERS_OUT)) + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[6].AddParagraph(_item.DISTRIBUTION == null ? "0" : _item.DISTRIBUTION.ToString("#,##0") + "   -   " + (_item.DISTRIBUTION_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[7].AddParagraph(_item.TRANSMISSION == null ? "0" : _item.TRANSMISSION.ToString("#,##0") + "   -   " + (_item.TRANSMISSION_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[8].AddParagraph(_item.DAMAGE_ASSESSMENT == null ? "0" : _item.DAMAGE_ASSESSMENT.ToString("#,##0") + "   -   " + (_item.DAMAGE_ASSESSMENT_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[9].AddParagraph(_item.TREE == null ? "0" : _item.TREE.ToString("#,##0") + "   -   " + (_item.TREE_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[10].AddParagraph(_item.SUBSTATION == null ? "0" : _item.SUBSTATION.ToString("#,##0") + "   -   " + (_item.SUBSTATION_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[11].AddParagraph(_item.NET_UG == null ? "0" : _item.NET_UG.ToString("#,##0") + "   -   " + (_item.NET_UG_PCT).ToString() + "%").Format.Alignment = ParagraphAlignment.Right;

        //        cus_ser += _item.CUSTOMERS_SERVED == null ? 0 : _item.CUSTOMERS_SERVED;
        //        cus_out += _item.CUSTOMERS_OUT == null ? 0 : _item.CUSTOMERS_OUT;
        //        cases += _item.CASES == null ? 0 : _item.CASES;
        //        cus_out_per += _item.CUSTOMERS_OUT_PCT == null ? 0 : _item.CUSTOMERS_OUT;
        //        dis_sum += _item.DISTRIBUTION == null ? 0 : _item.DISTRIBUTION;
        //        trn_sum += _item.TRANSMISSION == null ? 0 : _item.TRANSMISSION;
        //        dam_sum += _item.DAMAGE_ASSESSMENT == null ? 0 : _item.DAMAGE_ASSESSMENT;
        //        tre_sum += _item.TREE == null ? 0 : _item.TREE;
        //        sub_sum += _item.SUBSTATION == null ? 0 : _item.SUBSTATION;
        //        net_sum += _item.NET_UG == null ? 0 : _item.NET_UG;

        //        row.Cells[12].Borders.Color = new Color(255, 255, 255);
        //        row.Cells[12].Borders.Left.Color = new Color(0, 0, 0);
        //    }

        //    p = Summaryrow.Cells[0].AddParagraph();
        //    p.AddFormattedText("Summary", TextFormat.Bold);
        //    p = Summaryrow.Cells[1].AddParagraph();
        //    p.AddFormattedText("", TextFormat.Bold);
        //    p = Summaryrow.Cells[2].AddParagraph();
        //    p.AddFormattedText(cus_ser.ToString("#,##0"), TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[3].AddParagraph();
        //    p.AddFormattedText(cus_out.ToString("#,##0"), TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[4].AddParagraph();
        //    p.AddFormattedText(cases.ToString("#,##0"), TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[5].AddParagraph();
        //    p.AddFormattedText(string.Format("{0:0.00}", cus_out_per) + " %", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[6].AddParagraph();
        //    p.AddFormattedText(dis_sum.ToString("#,##0") + "  -  " + (outagereportnumber.Count == 0 ? dis_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[7].AddParagraph();
        //    p.AddFormattedText(trn_sum.ToString("#,##0") + "  -   " + (outagereportnumber.Count == 0 ? trn_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[8].AddParagraph();
        //    p.AddFormattedText(dam_sum.ToString("#,##0") + "  -   " + (outagereportnumber.Count == 0 ? dam_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[9].AddParagraph();
        //    p.AddFormattedText(tre_sum.ToString("#,##0") + "  -   " + (outagereportnumber.Count == 0 ? tre_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[10].AddParagraph();
        //    p.AddFormattedText(sub_sum.ToString("#,##0") + "  -   " + (outagereportnumber.Count == 0 ? sub_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    p = Summaryrow.Cells[11].AddParagraph();
        //    p.AddFormattedText(net_sum.ToString("#,##0") + "  -   " + (outagereportnumber.Count == 0 ? net_sum : 100).ToString() + "%", TextFormat.Bold);
        //    p.Format.Alignment = ParagraphAlignment.Right;
        //    Summaryrow.Cells[12].Borders.Color = new Color(255, 255, 255);
        //    Summaryrow.Cells[12].Borders.Left.Color = new Color(0, 0, 0);

        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph("NUMBER OF OUTAGE CASES BY CLIENTS REQESTING RESOURCES", "Heading1");
        //    document.LastSection.AddParagraph();

        //    if(outagereportnumber.Count > 0)
        //    { 
        //    Chart chart = new Chart(ChartType.Bar2D);
        //    chart.Width = Unit.FromCentimeter(40);
        //    chart.Height = Unit.FromCentimeter(12);

        //    //Series series ;

        //    List<double> CasesList = new List<double>();
        //    List<double> CustomerOutList = new List<double>();
        //    List<string> CompanyNameList = new List<string>();

        //    for (int i = outagereportnumber.Count - 1; i >= 0; i--)
        //    {
        //        CasesList.Add(outagereportnumber[i].CASES == null ? 0 : outagereportnumber[i].CASES);
        //        CustomerOutList.Add(outagereportnumber[i].CUSTOMERS_OUT == null ? 0 : outagereportnumber[i].CUSTOMERS_OUT);
        //        CompanyNameList.Add(outagereportnumber[i].COMPANY_NAME);
        //    }

        //    ///// TOTAL CUSTOMERS OUT BY COMPANY

        //    Series series = chart.SeriesCollection.AddSeries();
        //    series.Name = "Customers Out";
        //    series.FillFormat.Color = new Color(89, 175, 106);

        //    series.Add(CustomerOutList.ToArray());

        //    series = chart.SeriesCollection.AddSeries();
        //    series.Name = "Cases";
        //    series.FillFormat.Color = new Color(174, 231, 40);
        //    series.Add(CasesList.ToArray());

        //    XSeries xseries = chart.XValues.AddXSeries();
        //    xseries.Add(CompanyNameList.ToArray());

        //    chart.XAxis.MajorTickMark = TickMarkType.Outside;

        //    chart.YAxis.MajorTickMark = TickMarkType.Outside;
        //    chart.YAxis.HasMajorGridlines = true;
        //    chart.YAxis.TickLabels.Format = "#,##0";

        //    chart.RightArea.AddLegend();

        //    chart.PlotArea.LineFormat.Color = new MigraDoc.DocumentObjectModel.Color(0, 0, 0);
        //    chart.PlotArea.LineFormat.Width = 1;
        //    chart.PlotArea.LineFormat.Visible = true;

        //    chart.HasDataLabel = true;

        //    chart.DataLabel.Type = DataLabelType.Value;
        //    chart.DataLabel.Position = DataLabelPosition.OutsideEnd;
        //    chart.DataLabel.Format = "#,##0";

        //    document.LastSection.Add(chart);
        //    }

        //    #endregion
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportOutageNumberReport(XSSFSheet sheet, PreFormatedExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow = (XSSFRow)sheet.CreateRow(1);

        //    NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    fontAndBorderStyle.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
        //    fontAndBorderStyle.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Center;
        //    style.BorderLeft = NPOI.SS.UserModel.BorderStyle.Thin;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    style.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_20 = (XSSFCell)headerRow0.CreateCell(0);
        //    cell0_20.CellStyle = fontAndBorderStyle;
        //    cell0_20.SetCellValue("CUSTOMER OUTAGE NUMBERS");
        //    var cra20 = new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 5);
        //    sheet.AddMergedRegion(cra20);

        //    XSSFCell cell0 = (XSSFCell)headerRow.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell0.CellStyle = style;
        //    cell0.SetCellValue("COMPANY");

        //    XSSFCell cell1 = (XSSFCell)headerRow.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell1.CellStyle = style;
        //    cell1.SetCellValue("RMAG");

        //    XSSFCell cell2 = (XSSFCell)headerRow.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell2.CellStyle = style;
        //    cell2.SetCellValue("TOTAL CUSTOMER");

        //    XSSFCell cell3 = (XSSFCell)headerRow.CreateCell(3);
        //    sheet.SetColumnWidth(3, 5000);
        //    cell3.CellStyle = style;
        //    cell3.SetCellValue("CUSTOMER OUT");

        //    XSSFCell cell4 = (XSSFCell)headerRow.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell4.CellStyle = style;
        //    cell4.SetCellValue("CASES");

        //    XSSFCell cell5 = (XSSFCell)headerRow.CreateCell(5);
        //    sheet.SetColumnWidth(5, 5000);
        //    cell5.CellStyle = style;
        //    cell5.SetCellValue("%CUSTOMER OUT");


        //    #endregion

        //    //Get data from DB
        //    REPORTBL objREPORTBL = new REPORTBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //    int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //    int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //    List<REPORTDC> outagereportnumber = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE);

        //    #region Populate Data
        //    NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //    NPOI.SS.UserModel.ICell cell;

        //    int rowIndex = 2;
        //    foreach (REPORTDC _item in outagereportnumber)
        //    {
        //        NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //        row.CreateCell(0).SetCellValue(_item.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_item.RMAG_NAME);
        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CUSTOMERS_SERVED.ToString("#,##0"));
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CUSTOMERS_OUT.ToString("#,##0"));
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_item.CASES.ToString("#,##0"));
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(string.Format("{0:0.00}", _item.CUSTOMERS_OUT_PCT) + " %");
        //        rowIndex++;
        //    }

        //    #endregion
        //}

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportOutageNumberReport(ref Document document, ref Table table, PreFormatedExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(750);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(3));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));

        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow = table.AddRow();
        //    Paragraph p;

        //    headerRow0_0.Cells[0].MergeRight = 5;
        //    p = headerRow0_0.Cells[0].AddParagraph();
        //    p.AddFormattedText("CUSTOMER OUTAGE NUMBERS", TextFormat.Bold);

        //    p = headerRow.Cells[0].AddParagraph();
        //    p.AddFormattedText("COMPANY", TextFormat.Bold);
        //    p = headerRow.Cells[1].AddParagraph();
        //    p.AddFormattedText("RMAG", TextFormat.Bold);
        //    p = headerRow.Cells[2].AddParagraph();
        //    p.AddFormattedText("TOTAL CUSTOMER", TextFormat.Bold);
        //    p = headerRow.Cells[3].AddParagraph();
        //    p.AddFormattedText("CUSTOMER OUT", TextFormat.Bold);
        //    p = headerRow.Cells[4].AddParagraph();
        //    p.AddFormattedText("CASES", TextFormat.Bold);
        //    p = headerRow.Cells[5].AddParagraph();
        //    p.AddFormattedText("%CUSTOMER OUT", TextFormat.Bold);


        //    #endregion
        //    //Get data from DB
        //    REPORTBL objREPORTBL = new REPORTBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    string SNAPSHOT_DATE = (string.IsNullOrEmpty(data.SNAPSHOT_DATE) || data.SNAPSHOT_DATE == "-1" || data.SNAPSHOT_DATE == "? string:0 ?" || data.SNAPSHOT_DATE == "? undefined:undefined ?" || data.SNAPSHOT_DATE == "? string: ?") ? null : data.SNAPSHOT_DATE;
        //    int RMAG_ID = Convert.ToInt32(data.RMAG_ID);
        //    int COMPANY_ID = Convert.ToInt32(data.COMPANY_ID);
        //    List<REPORTDC> outagereportnumber = objREPORTBL.GenerateOutageNumbersReport(EVENT_ID, RMAG_ID, COMPANY_ID, SNAPSHOT_DATE);

        //    #region Populate Data

        //    int rowIndex = 2;
        //    foreach (REPORTDC _item in outagereportnumber)
        //    {
        //        Row row = table.AddRow();
        //        row.Cells[0].AddParagraph(_item.COMPANY_NAME);
        //        row.Cells[1].AddParagraph(_item.RMAG_NAME);
        //        row.Cells[2].AddParagraph(_item.CUSTOMERS_SERVED.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[3].AddParagraph(_item.CUSTOMERS_OUT.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[4].AddParagraph(_item.CASES.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        row.Cells[5].AddParagraph((string.Format("{0:0.00}", _item.CUSTOMERS_OUT_PCT)) + " %").Format.Alignment = ParagraphAlignment.Right;
        //    }

        //    #endregion


        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph("TOTAL CUSTOMERS OUT BY COMPANY", "Heading1");
        //    document.LastSection.AddParagraph();

        //    if (outagereportnumber.Count > 0) { 
        //    Chart chart = new Chart(ChartType.Bar2D);
        //    Chart chart1 = new Chart(ChartType.BarStacked2D);
        //    chart.Width = Unit.FromCentimeter(40);
        //    chart.Height = Unit.FromCentimeter(9);
        //    chart1.Width = Unit.FromCentimeter(32);
        //    chart1.Height = Unit.FromCentimeter(7);
        //    //Series series ;

        //    List<double> TotalCustomerList = new List<double>();
        //    List<double> CustomerOutList = new List<double>();
        //    List<double> PerCustomerOutList = new List<double>();
        //    List<string> CompanyNameList = new List<string>();

        //    for (int i = outagereportnumber.Count - 1; i >= 0; i--)
        //    {
        //        TotalCustomerList.Add(outagereportnumber[i].CUSTOMERS_SERVED == null ? 0 : outagereportnumber[i].CUSTOMERS_SERVED);
        //        CustomerOutList.Add(outagereportnumber[i].CUSTOMERS_OUT == null ? 0 : outagereportnumber[i].CUSTOMERS_OUT);
        //        CompanyNameList.Add(outagereportnumber[i].COMPANY_NAME);
        //        PerCustomerOutList.Add(outagereportnumber[i].CUSTOMERS_OUT_PCT == null ? 0 : outagereportnumber[i].CUSTOMERS_OUT_PCT);
        //    }

        //    ///// TOTAL CUSTOMERS OUT BY COMPANY

        //    Series series = chart.SeriesCollection.AddSeries();
        //    series.Name = "Customers Out";
        //    series.FillFormat.Color = new Color(89, 157, 193);

        //    //  series.
        //    series.Add(CustomerOutList.ToArray());

        //    series = chart.SeriesCollection.AddSeries();
        //    series.Name = "Total Customer";
        //    series.FillFormat.Color = new Color(101, 192, 245);

        //    series.Add(TotalCustomerList.ToArray());

        //    XSeries xseries = chart.XValues.AddXSeries();
        //    xseries.Add(CompanyNameList.ToArray());

        //    chart.XAxis.MajorTickMark = TickMarkType.Outside;

        //    chart.YAxis.MajorTickMark = TickMarkType.Outside;
        //    chart.YAxis.HasMajorGridlines = true;
        //    chart.YAxis.TickLabels.Format = "#,##0";

        //    chart.RightArea.AddLegend();

        //    chart.PlotArea.LineFormat.Color = new MigraDoc.DocumentObjectModel.Color(0, 0, 0);
        //    chart.PlotArea.LineFormat.Width = 1;
        //    chart.PlotArea.LineFormat.Visible = true;
        //    chart.HasDataLabel = true;
        //    chart.DataLabel.Type = DataLabelType.Value;
        //    chart.DataLabel.Position = DataLabelPosition.OutsideEnd;
        //    chart.DataLabel.Format = "#,##0";

        //    document.LastSection.Add(chart);

        //    /////  % CUSTOMERS OUT BY COMPANY

        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph();
        //    document.LastSection.AddParagraph("% CUSTOMERS OUT BY COMPANY", "Heading1");
        //    document.LastSection.AddParagraph();

        //    Series series1 = chart1.SeriesCollection.AddSeries();
        //    series1.Name = "% Customers Out";
        //    series1.FillFormat.Color = new Color(174, 231, 40);
        //    series1.Add(PerCustomerOutList.ToArray());


        //    XSeries xseries1 = chart1.XValues.AddXSeries();
        //    xseries1.Add(CompanyNameList.ToArray());
        //    chart1.XAxis.MajorTickMark = TickMarkType.Cross;
        //    chart1.XAxis.MajorTick = 100;
        //    chart1.XAxis.MaximumScale = 100;

        //    chart1.YAxis.MajorTickMark = TickMarkType.Outside;
        //    chart1.YAxis.HasMajorGridlines = true;

        //    chart1.PlotArea.LineFormat.Color = new Color(0, 0, 0);
        //    chart1.PlotArea.LineFormat.Width = 1;
        //    chart1.PlotArea.LineFormat.Visible = true;
        //    chart1.YAxis.Title.Caption = "% Percentages";
        //    chart1.RightArea.AddLegend();

        //    chart1.HasDataLabel = true;
        //    chart1.DataLabel.Position = DataLabelPosition.Center;

        //    chart1.DataLabel.Type = DataLabelType.Value;
        //    chart1.DataLabel.Position = DataLabelPosition.OutsideEnd;

        //    document.LastSection.Add(chart1);
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportMatching(XSSFSheet sheet, MatchingExportData data)
        //{
        //    sheet.Workbook.SetSheetName(0, "REQUESTING CLIENTS");
        //    XSSFSheet requestsSheet = sheet;
        //    XSSFSheet responsesSheet = (XSSFSheet)sheet.Workbook.CreateSheet("RESPONDING CLIENTS");

        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = requestsSheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = requestsSheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = requestsSheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    #region Build Header - CLIENTS REQUESTING RESOURCES

        //    //headerRow names are like: headerRowSheetx_Rowx
        //    XSSFRow headerRow0_0 = (XSSFRow)requestsSheet.CreateRow(0);
        //    XSSFRow headerRow0_1 = (XSSFRow)requestsSheet.CreateRow(1);

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell0_0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    XSSFCell cell0_1_0 = (XSSFCell)headerRow0_1.CreateCell(0);
        //    requestsSheet.SetColumnWidth(0, 5000);
        //    cell0_0_0.CellStyle = fontOnlyStyle;
        //    cell0_1_0.CellStyle = fontAndBorderStyle;
        //    cell0_0_0.SetCellValue("CLIENT REQUESTING RESOURCES");
        //    var cra0_0_0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    requestsSheet.AddMergedRegion(cra0_0_0);

        //    XSSFCell cell0_0_1 = (XSSFCell)headerRow0_0.CreateCell(1);
        //    XSSFCell cell0_1_1 = (XSSFCell)headerRow0_1.CreateCell(1);
        //    requestsSheet.SetColumnWidth(1, 5000);
        //    cell0_0_1.CellStyle = fontOnlyStyle;
        //    cell0_1_1.CellStyle = fontAndBorderStyle;
        //    cell0_0_1.SetCellValue("RMAG");
        //    var cra0_0_1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    requestsSheet.AddMergedRegion(cra0_0_1);

        //    XSSFCell cell0_0_2 = (XSSFCell)headerRow0_0.CreateCell(2);
        //    cell0_0_2.CellStyle = fontOnlyStyle;
        //    cell0_0_2.SetCellValue("RESOURCE REQUESTS");
        //    var cra0_0_2 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 7);
        //    requestsSheet.AddMergedRegion(cra0_0_2);

        //    XSSFCell cell0_1_2 = (XSSFCell)headerRow0_1.CreateCell(2);
        //    requestsSheet.SetColumnWidth(2, 2500);
        //    cell0_1_2.CellStyle = fontAndBorderStyle;
        //    cell0_1_2.SetCellValue("DIST.");

        //    XSSFCell cell0_1_3 = (XSSFCell)headerRow0_1.CreateCell(3);
        //    requestsSheet.SetColumnWidth(3, 2500);
        //    cell0_1_3.CellStyle = fontAndBorderStyle;
        //    cell0_1_3.SetCellValue("TRANS.");

        //    XSSFCell cell0_1_4 = (XSSFCell)headerRow0_1.CreateCell(4);
        //    requestsSheet.SetColumnWidth(4, 2500);
        //    cell0_1_4.CellStyle = fontAndBorderStyle;
        //    cell0_1_4.SetCellValue("DAMAGE");

        //    XSSFCell cell0_1_5 = (XSSFCell)headerRow0_1.CreateCell(5);
        //    requestsSheet.SetColumnWidth(5, 2500);
        //    cell0_1_5.CellStyle = fontAndBorderStyle;
        //    cell0_1_5.SetCellValue("TREE");

        //    XSSFCell cell0_1_6 = (XSSFCell)headerRow0_1.CreateCell(6);
        //    requestsSheet.SetColumnWidth(6, 2500);
        //    cell0_1_6.CellStyle = fontAndBorderStyle;
        //    cell0_1_6.SetCellValue("SUBST.");

        //    XSSFCell cell0_1_7 = (XSSFCell)headerRow0_1.CreateCell(7);
        //    requestsSheet.SetColumnWidth(7, 2500);
        //    cell0_1_7.CellStyle = fontAndBorderStyle;
        //    cell0_1_7.SetCellValue("NET UG");

        //    XSSFCell cell0_0_8 = (XSSFCell)headerRow0_0.CreateCell(8);
        //    cell0_0_8.CellStyle = fontOnlyStyle;
        //    cell0_0_8.SetCellValue("EQUITABLE SHARE ALLOCATED");
        //    var cra0_0_8 = new NPOI.SS.Util.CellRangeAddress(0, 0, 8, 13);
        //    requestsSheet.AddMergedRegion(cra0_0_8);

        //    XSSFCell cell0_1_8 = (XSSFCell)headerRow0_1.CreateCell(8);
        //    requestsSheet.SetColumnWidth(8, 2500);
        //    cell0_1_8.CellStyle = fontAndBorderStyle;
        //    cell0_1_8.SetCellValue("DIST.");

        //    XSSFCell cell0_1_9 = (XSSFCell)headerRow0_1.CreateCell(9);
        //    requestsSheet.SetColumnWidth(9, 2500);
        //    cell0_1_9.CellStyle = fontAndBorderStyle;
        //    cell0_1_9.SetCellValue("TRANS.");

        //    XSSFCell cell0_1_10 = (XSSFCell)headerRow0_1.CreateCell(10);
        //    requestsSheet.SetColumnWidth(10, 2500);
        //    cell0_1_10.CellStyle = fontAndBorderStyle;
        //    cell0_1_10.SetCellValue("DAMAGE");

        //    XSSFCell cell0_1_11 = (XSSFCell)headerRow0_1.CreateCell(11);
        //    requestsSheet.SetColumnWidth(11, 2500);
        //    cell0_1_11.CellStyle = fontAndBorderStyle;
        //    cell0_1_11.SetCellValue("TREE");

        //    XSSFCell cell0_1_12 = (XSSFCell)headerRow0_1.CreateCell(12);
        //    requestsSheet.SetColumnWidth(12, 2500);
        //    cell0_1_12.CellStyle = fontAndBorderStyle;
        //    cell0_1_12.SetCellValue("SUBST.");

        //    XSSFCell cell0_1_13 = (XSSFCell)headerRow0_1.CreateCell(13);
        //    requestsSheet.SetColumnWidth(13, 2500);
        //    cell0_1_13.CellStyle = fontAndBorderStyle;
        //    cell0_1_13.SetCellValue("NET UG");

        //    XSSFCell cell0_0_14 = (XSSFCell)headerRow0_0.CreateCell(14);
        //    cell0_0_14.CellStyle = fontOnlyStyle;
        //    cell0_0_14.SetCellValue("RESOURCES ACQUIRED");
        //    var cra0_0_14 = new NPOI.SS.Util.CellRangeAddress(0, 0, 14, 19);
        //    requestsSheet.AddMergedRegion(cra0_0_14);

        //    XSSFCell cell0_1_14 = (XSSFCell)headerRow0_1.CreateCell(14);
        //    requestsSheet.SetColumnWidth(14, 2500);
        //    cell0_1_14.CellStyle = fontAndBorderStyle;
        //    cell0_1_14.SetCellValue("DIST.");

        //    XSSFCell cell0_1_15 = (XSSFCell)headerRow0_1.CreateCell(15);
        //    requestsSheet.SetColumnWidth(15, 2500);
        //    cell0_1_15.CellStyle = fontAndBorderStyle;
        //    cell0_1_15.SetCellValue("TRANS.");

        //    XSSFCell cell0_1_16 = (XSSFCell)headerRow0_1.CreateCell(16);
        //    requestsSheet.SetColumnWidth(16, 2500);
        //    cell0_1_16.CellStyle = fontAndBorderStyle;
        //    cell0_1_16.SetCellValue("DAMAGE");

        //    XSSFCell cell0_1_17 = (XSSFCell)headerRow0_1.CreateCell(17);
        //    requestsSheet.SetColumnWidth(17, 2500);
        //    cell0_1_17.CellStyle = fontAndBorderStyle;
        //    cell0_1_17.SetCellValue("TREE");

        //    XSSFCell cell0_1_18 = (XSSFCell)headerRow0_1.CreateCell(18);
        //    requestsSheet.SetColumnWidth(18, 2500);
        //    cell0_1_18.CellStyle = fontAndBorderStyle;
        //    cell0_1_18.SetCellValue("SUBST.");

        //    XSSFCell cell0_1_19 = (XSSFCell)headerRow0_1.CreateCell(19);
        //    requestsSheet.SetColumnWidth(19, 2500);
        //    cell0_1_19.CellStyle = fontAndBorderStyle;
        //    cell0_1_19.SetCellValue("NET UG");

        //    #endregion

        //    #region Build Header - CLIENTS OFFERING RESOURCES

        //    //headerRow names are like: headerRowSheetx_Rowx
        //    XSSFRow headerRow1_0 = (XSSFRow)responsesSheet.CreateRow(0);
        //    XSSFRow headerRow1_1 = (XSSFRow)responsesSheet.CreateRow(1);

        //    //Cell names are like: cellSheetx_Rowx_Colx
        //    XSSFCell cell1_0_0 = (XSSFCell)headerRow1_0.CreateCell(0);
        //    XSSFCell cell1_1_0 = (XSSFCell)headerRow1_1.CreateCell(0);
        //    responsesSheet.SetColumnWidth(0, 5000);
        //    cell1_0_0.CellStyle = fontOnlyStyle;
        //    cell1_1_0.CellStyle = fontAndBorderStyle;
        //    cell1_0_0.SetCellValue("RESPONDING COMPANY");
        //    var cra1_0_0 = new NPOI.SS.Util.CellRangeAddress(0, 1, 0, 0);
        //    responsesSheet.AddMergedRegion(cra1_0_0);

        //    XSSFCell cell1_0_1 = (XSSFCell)headerRow1_0.CreateCell(1);
        //    XSSFCell cell1_1_1 = (XSSFCell)headerRow1_1.CreateCell(1);
        //    responsesSheet.SetColumnWidth(1, 5000);
        //    cell1_0_1.CellStyle = fontOnlyStyle;
        //    cell1_1_1.CellStyle = fontAndBorderStyle;
        //    cell1_0_1.SetCellValue("RMAG");
        //    var cra1_0_1 = new NPOI.SS.Util.CellRangeAddress(0, 1, 1, 1);
        //    responsesSheet.AddMergedRegion(cra1_0_1);

        //    XSSFCell cell1_0_2 = (XSSFCell)headerRow1_0.CreateCell(2);
        //    cell1_0_2.CellStyle = fontOnlyStyle;
        //    cell1_0_2.SetCellValue("RESPONSES BY RESOURCE TYPE");
        //    var cra1_0_2 = new NPOI.SS.Util.CellRangeAddress(0, 0, 2, 7);
        //    responsesSheet.AddMergedRegion(cra1_0_2);

        //    XSSFCell cell1_1_2 = (XSSFCell)headerRow1_1.CreateCell(2);
        //    responsesSheet.SetColumnWidth(2, 2500);
        //    cell1_1_2.CellStyle = fontAndBorderStyle;
        //    cell1_1_2.SetCellValue("DIST.");

        //    XSSFCell cell1_1_3 = (XSSFCell)headerRow1_1.CreateCell(3);
        //    responsesSheet.SetColumnWidth(3, 2500);
        //    cell1_1_3.CellStyle = fontAndBorderStyle;
        //    cell1_1_3.SetCellValue("TRANS.");

        //    XSSFCell cell1_1_4 = (XSSFCell)headerRow1_1.CreateCell(4);
        //    responsesSheet.SetColumnWidth(4, 2500);
        //    cell1_1_4.CellStyle = fontAndBorderStyle;
        //    cell1_1_4.SetCellValue("DAMAGE");

        //    XSSFCell cell1_1_5 = (XSSFCell)headerRow1_1.CreateCell(5);
        //    responsesSheet.SetColumnWidth(5, 2500);
        //    cell1_1_5.CellStyle = fontAndBorderStyle;
        //    cell1_1_5.SetCellValue("TREE");

        //    XSSFCell cell1_1_6 = (XSSFCell)headerRow1_1.CreateCell(6);
        //    responsesSheet.SetColumnWidth(6, 2500);
        //    cell1_1_6.CellStyle = fontAndBorderStyle;
        //    cell1_1_6.SetCellValue("SUBST.");

        //    XSSFCell cell1_1_7 = (XSSFCell)headerRow1_1.CreateCell(7);
        //    responsesSheet.SetColumnWidth(7, 2500);
        //    cell1_1_7.CellStyle = fontAndBorderStyle;
        //    cell1_1_7.SetCellValue("NET UG");

        //    XSSFCell cell1_0_8 = (XSSFCell)headerRow1_0.CreateCell(8);
        //    XSSFCell cell1_1_8 = (XSSFCell)headerRow1_1.CreateCell(8);
        //    responsesSheet.SetColumnWidth(8, 5000);
        //    cell1_0_8.CellStyle = fontOnlyStyle;
        //    cell1_1_8.CellStyle = fontAndBorderStyle;
        //    cell1_0_8.SetCellValue("COMPANY/NON-COMPANY");
        //    var cra1_0_8 = new NPOI.SS.Util.CellRangeAddress(0, 1, 8, 8);
        //    responsesSheet.AddMergedRegion(cra1_0_8);

        //    XSSFCell cell1_0_9 = (XSSFCell)headerRow1_0.CreateCell(9);
        //    XSSFCell cell1_1_9 = (XSSFCell)headerRow1_1.CreateCell(9);
        //    responsesSheet.SetColumnWidth(9, 5000);
        //    cell1_0_9.CellStyle = fontOnlyStyle;
        //    cell1_1_9.CellStyle = fontAndBorderStyle;
        //    cell1_0_9.SetCellValue("CITY");
        //    var cra1_0_9 = new NPOI.SS.Util.CellRangeAddress(0, 1, 9, 9);
        //    responsesSheet.AddMergedRegion(cra1_0_9);

        //    XSSFCell cell1_0_10 = (XSSFCell)headerRow1_0.CreateCell(10);
        //    XSSFCell cell1_1_10 = (XSSFCell)headerRow1_1.CreateCell(10);
        //    responsesSheet.SetColumnWidth(10, 5000);
        //    cell1_0_10.CellStyle = fontOnlyStyle;
        //    cell1_1_10.CellStyle = fontAndBorderStyle;
        //    cell1_0_10.SetCellValue("STATE");
        //    var cra1_0_10 = new NPOI.SS.Util.CellRangeAddress(0, 1, 10, 10);
        //    responsesSheet.AddMergedRegion(cra1_0_10);

        //    XSSFCell cell1_0_11 = (XSSFCell)headerRow1_0.CreateCell(11);
        //    XSSFCell cell1_1_11 = (XSSFCell)headerRow1_1.CreateCell(11);
        //    responsesSheet.SetColumnWidth(11, 5000);
        //    cell1_0_11.CellStyle = fontOnlyStyle;
        //    cell1_1_11.CellStyle = fontAndBorderStyle;
        //    cell1_0_11.SetCellValue("RELEASE TO ROLL");
        //    var cra1_0_11 = new NPOI.SS.Util.CellRangeAddress(0, 1, 11, 11);
        //    responsesSheet.AddMergedRegion(cra1_0_11);

        //    #endregion

        //    //Set freeze columns
        //    requestsSheet.CreateFreezePane(2, 0);
        //    responsesSheet.CreateFreezePane(2, 0);

        //    //Get data from DB
        //    MATCHINGBL matchingHandler = new MATCHINGBL();
        //    int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //    int VIEW_TYPE = Convert.ToInt32(data.VIEW_TYPE);
        //    string CALC_RUN = (string.IsNullOrEmpty(data.CALC_RUN) || data.CALC_RUN == "0" || data.CALC_RUN == "? string:0 ?" || data.CALC_RUN == "? undefined:undefined ?" || data.CALC_RUN == "? string: ?") ? "" : data.CALC_RUN;
        //    int MATCHING_RMAG_ID = (string.IsNullOrEmpty(data.MATCHING_RMAG_ID) || data.MATCHING_RMAG_ID == "0") ? 0 : Convert.ToInt32(data.MATCHING_RMAG_ID);
        //    int MATCHING_REQUEST_ID = (string.IsNullOrEmpty(data.MATCHING_REQUEST_ID) || data.MATCHING_REQUEST_ID == "0") ? 0 : Convert.ToInt32(data.MATCHING_REQUEST_ID);
        //    string REQ_RMAG_NAME = (string.IsNullOrEmpty(data.REQ_RMAG_NAME) || data.REQ_RMAG_NAME.Trim().ToLower() == "all" || data.REQ_RMAG_NAME == "0" || data.REQ_RMAG_NAME == "? string:0 ?" || data.REQ_RMAG_NAME == "? undefined:undefined ?" || data.REQ_RMAG_NAME == "? string: ?") ? "" : data.REQ_RMAG_NAME;
        //    string REQ_COMPANY_NAME = (string.IsNullOrEmpty(data.REQ_COMPANY_NAME) || data.REQ_COMPANY_NAME.Trim().ToLower() == "all" || data.REQ_COMPANY_NAME == "0" || data.REQ_COMPANY_NAME == "? string:0 ?" || data.REQ_COMPANY_NAME == "? undefined:undefined ?" || data.REQ_COMPANY_NAME == "? string: ?") ? "" : data.REQ_COMPANY_NAME;
        //    string RESP_RMAG_NAME = (string.IsNullOrEmpty(data.RESP_RMAG_NAME) || data.RESP_RMAG_NAME.Trim().ToLower() == "all" || data.RESP_RMAG_NAME == "0" || data.RESP_RMAG_NAME == "? string:0 ?" || data.RESP_RMAG_NAME == "? undefined:undefined ?" || data.RESP_RMAG_NAME == "? string: ?") ? "" : data.RESP_RMAG_NAME;
        //    string RESP_COMPANY_NAME = (string.IsNullOrEmpty(data.RESP_COMPANY_NAME) || data.RESP_COMPANY_NAME.Trim().ToLower() == "all" || data.RESP_COMPANY_NAME == "0" || data.RESP_COMPANY_NAME == "? string:0 ?" || data.RESP_COMPANY_NAME == "? undefined:undefined ?" || data.RESP_COMPANY_NAME == "? string: ?") ? "" : data.RESP_COMPANY_NAME;
        //    //CLIENTS REQUESTING RESOURCES
        //    List<MATCHING_REQUESTSDC> matchingRequests = matchingHandler.GetRequestsForExport(EVENT_ID, VIEW_TYPE, CALC_RUN, REQ_RMAG_NAME, REQ_COMPANY_NAME);
        //    //CLIENTS OFFERING RESOURCES
        //    List<MATCHING_RESPONSESDC> matchingResponses = matchingHandler.GetResponsesForExport(EVENT_ID, VIEW_TYPE, CALC_RUN, MATCHING_RMAG_ID, MATCHING_REQUEST_ID, RESP_RMAG_NAME, RESP_COMPANY_NAME);

        //    #region Populate Data - COMPANIES REQUESTING RESOURCES
        //    NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //    NPOI.SS.UserModel.ICell cell;

        //    int rowIndex = 2;
        //    foreach (MATCHING_REQUESTSDC _matchingRequest in matchingRequests)
        //    {
        //        NPOI.SS.UserModel.IRow row = requestsSheet.CreateRow(rowIndex);
        //        row.CreateCell(0).SetCellValue(_matchingRequest.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_matchingRequest.RMAG_NAME);
        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DISTRIBUTION == null ? "0" : _matchingRequest.DISTRIBUTION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TRANSMISSION == null ? "0" : _matchingRequest.TRANSMISSION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TREE == null ? "0" : _matchingRequest.TREE.Value.ToString("#,##0"));
        //        cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.SUBSTATION == null ? "0" : _matchingRequest.SUBSTATION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NET_UG == null ? "0" : _matchingRequest.NET_UG.Value.ToString("#,##0"));
        //        cell = row.CreateCell(8); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DISTRIBUTION_ESALOC == null ? "0" : _matchingRequest.DISTRIBUTION_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(9); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TRANSMISSION_ESALOC == null ? "0" : _matchingRequest.TRANSMISSION_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DAMAGE_ASSESSMENT_ESALOC == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TREE_ESALOC == null ? "0" : _matchingRequest.TREE_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.SUBSTATION_ESALOC == null ? "0" : _matchingRequest.SUBSTATION_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NET_UG_ESALOC == null ? "0" : _matchingRequest.NET_UG_ESALOC.Value.ToString("#,##0"));
        //        cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DISTRIBUTION_ACQ == null ? "0" : _matchingRequest.DISTRIBUTION_ACQ.Value.ToString("#,##0"));
        //        cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TRANSMISSION_ACQ == null ? "0" : _matchingRequest.TRANSMISSION_ACQ.Value.ToString("#,##0"));
        //        cell = row.CreateCell(16); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.DAMAGE_ASSESSMENT_ACQ == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT_ACQ.Value.ToString("#,##0"));
        //        cell = row.CreateCell(17); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.TREE_ACQ == null ? "0" : _matchingRequest.TREE_ACQ.Value.ToString("#,##0"));
        //        cell = row.CreateCell(18); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.SUBSTATION_ACQ == null ? "0" : _matchingRequest.SUBSTATION_ACQ.Value.ToString("#,##0"));
        //        cell = row.CreateCell(19); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingRequest.NET_UG_ACQ == null ? "0" : _matchingRequest.NET_UG_ACQ.Value.ToString("#,##0"));
        //        rowIndex++;
        //    }

        //    #endregion

        //    #region Populate Data - COMPANIES OFFERING RESOURCES

        //    rowIndex = 2;
        //    foreach (MATCHING_RESPONSESDC _matchingResponse in matchingResponses)
        //    {
        //        NPOI.SS.UserModel.IRow row = responsesSheet.CreateRow(rowIndex);
        //        TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchingResponse.TIME_ZONE + " Standard Time");
        //        string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchingResponse.TIME_ZONE);
        //        row.CreateCell(0).SetCellValue(_matchingResponse.COMPANY_NAME);
        //        row.CreateCell(1).SetCellValue(_matchingResponse.RMAG_NAME);
        //        cell = row.CreateCell(2); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.DISTRIBUTION == null ? "0" : _matchingResponse.DISTRIBUTION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(3); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.TRANSMISSION == null ? "0" : _matchingResponse.TRANSMISSION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(4); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //        cell = row.CreateCell(5); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.TREE == null ? "0" : _matchingResponse.TREE.Value.ToString("#,##0"));
        //        cell = row.CreateCell(6); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.SUBSTATION == null ? "0" : _matchingResponse.SUBSTATION.Value.ToString("#,##0"));
        //        cell = row.CreateCell(7); cell.CellStyle = numberStyle; cell.SetCellValue(_matchingResponse.NET_UG == null ? "0" : _matchingResponse.NET_UG.Value.ToString("#,##0"));
        //        row.CreateCell(8).SetCellValue(_matchingResponse.IS_COMPANY);
        //        row.CreateCell(9).SetCellValue(_matchingResponse.COMPANY_CITY);
        //        row.CreateCell(10).SetCellValue(_matchingResponse.COMPANY_STATE);
        //        row.CreateCell(11).SetCellValue(_matchingResponse.RELEASE_ROLE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchingResponse.RELEASE_ROLE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //        rowIndex++;
        //    }

        //    #endregion
        //}

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        //public static void ExportMatching(ref Table table, MatchingExportData data)
        //{

        //    {
        //        Unit width, height;
        //        PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //        width = Unit.FromMillimeter(1070);
        //        table.Section.PageSetup.PageWidth = width;
        //        table.Section.PageSetup.PageHeight = height;

        //        #region Build Header

        //        Column column = table.AddColumn(Unit.FromInch(3));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(0.1));
        //        column = table.AddColumn(Unit.FromInch(3));
        //        column = table.AddColumn(Unit.FromInch(1.5));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(2));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));
        //        column = table.AddColumn(Unit.FromInch(1));

        //        Row headerRow0 = table.AddRow();
        //        Row headerRow1 = table.AddRow();
        //        Row headerRow2 = table.AddRow();

        //        headerRow0.Cells[0].MergeRight = 19;
        //        Paragraph p = headerRow0.Cells[0].AddParagraph();
        //        p.AddFormattedText("REQUESTING COMPANIES", TextFormat.Bold);

        //        headerRow1.Cells[0].MergeDown = 1;
        //        p = headerRow1.Cells[0].AddParagraph();
        //        p.AddFormattedText("COMPANY", TextFormat.Bold);

        //        headerRow1.Cells[1].MergeDown = 1;
        //        p = headerRow1.Cells[1].AddParagraph();
        //        p.AddFormattedText("RMAG", TextFormat.Bold);

        //        headerRow1.Cells[2].MergeRight = 5;
        //        p = headerRow1.Cells[2].AddParagraph();
        //        p.AddFormattedText("RESOURCE REQUESTS", TextFormat.Bold);

        //        p = headerRow2.Cells[2].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[3].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[4].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[5].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[6].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[7].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[8].MergeRight = 5;
        //        p = headerRow1.Cells[8].AddParagraph();
        //        p.AddFormattedText("EQUITABLE SHARE ALLOCATED", TextFormat.Bold);

        //        p = headerRow2.Cells[8].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[9].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[10].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[11].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[12].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[13].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[14].MergeRight = 5;
        //        p = headerRow1.Cells[14].AddParagraph();
        //        p.AddFormattedText("RESOURCES ACQUIRED", TextFormat.Bold);

        //        p = headerRow2.Cells[14].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[15].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[16].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[17].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[18].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[19].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow0.Cells[21].MergeRight = 11;
        //        p = headerRow0.Cells[21].AddParagraph();
        //        p.AddFormattedText("RESPONDING COMPANIES", TextFormat.Bold);

        //        headerRow1.Cells[21].MergeDown = 1;
        //        p = headerRow1.Cells[21].AddParagraph();
        //        p.AddFormattedText("COMPANY", TextFormat.Bold);

        //        headerRow1.Cells[22].MergeDown = 1;
        //        p = headerRow1.Cells[22].AddParagraph();
        //        p.AddFormattedText("RMAG", TextFormat.Bold);

        //        headerRow1.Cells[23].MergeRight = 5;
        //        p = headerRow1.Cells[23].AddParagraph();
        //        p.AddFormattedText("RESPONSES BY RESOURCE TYPE", TextFormat.Bold);

        //        p = headerRow2.Cells[23].AddParagraph();
        //        p.AddFormattedText("DIST.", TextFormat.Bold);

        //        p = headerRow2.Cells[24].AddParagraph();
        //        p.AddFormattedText("TRANS.", TextFormat.Bold);

        //        p = headerRow2.Cells[25].AddParagraph();
        //        p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //        p = headerRow2.Cells[26].AddParagraph();
        //        p.AddFormattedText("TREE", TextFormat.Bold);

        //        p = headerRow2.Cells[27].AddParagraph();
        //        p.AddFormattedText("SUBST.", TextFormat.Bold);

        //        p = headerRow2.Cells[28].AddParagraph();
        //        p.AddFormattedText("NET UG", TextFormat.Bold);

        //        headerRow1.Cells[29].MergeDown = 1;
        //        p = headerRow1.Cells[29].AddParagraph();
        //        p.AddFormattedText("COMPANY/NON-COMPANY", TextFormat.Bold);

        //        headerRow1.Cells[30].MergeDown = 1;
        //        p = headerRow1.Cells[30].AddParagraph();
        //        p.AddFormattedText("CITY", TextFormat.Bold);

        //        headerRow1.Cells[31].MergeDown = 1;
        //        p = headerRow1.Cells[31].AddParagraph();
        //        p.AddFormattedText("STATE", TextFormat.Bold);

        //        headerRow1.Cells[32].MergeDown = 1;
        //        p = headerRow1.Cells[32].AddParagraph();
        //        p.AddFormattedText("RELEASE TO ROLL", TextFormat.Bold);

        //        #endregion

        //        //Get data from DB
        //        MATCHINGBL matchingHandler = new MATCHINGBL();
        //        int EVENT_ID = Convert.ToInt32(data.EVENT_ID);
        //        int VIEW_TYPE = Convert.ToInt32(data.VIEW_TYPE);
        //        string CALC_RUN = (string.IsNullOrEmpty(data.CALC_RUN) || data.CALC_RUN == "0" || data.CALC_RUN == "? string:0 ?" || data.CALC_RUN == "? undefined:undefined ?" || data.CALC_RUN == "? string: ?") ? "" : data.CALC_RUN;
        //        int MATCHING_RMAG_ID = (string.IsNullOrEmpty(data.MATCHING_RMAG_ID) || data.MATCHING_RMAG_ID == "0") ? 0 : Convert.ToInt32(data.MATCHING_RMAG_ID);
        //        int MATCHING_REQUEST_ID = (string.IsNullOrEmpty(data.MATCHING_REQUEST_ID) || data.MATCHING_REQUEST_ID == "0") ? 0 : Convert.ToInt32(data.MATCHING_REQUEST_ID);
        //        string REQ_RMAG_NAME = (string.IsNullOrEmpty(data.REQ_RMAG_NAME) || data.REQ_RMAG_NAME.Trim().ToLower() == "all" || data.REQ_RMAG_NAME == "0" || data.REQ_RMAG_NAME == "? string:0 ?" || data.REQ_RMAG_NAME == "? undefined:undefined ?" || data.REQ_RMAG_NAME == "? string: ?") ? "" : data.REQ_RMAG_NAME;
        //        string REQ_COMPANY_NAME = (string.IsNullOrEmpty(data.REQ_COMPANY_NAME) || data.REQ_COMPANY_NAME.Trim().ToLower() == "all" || data.REQ_COMPANY_NAME == "0" || data.REQ_COMPANY_NAME == "? string:0 ?" || data.REQ_COMPANY_NAME == "? undefined:undefined ?" || data.REQ_COMPANY_NAME == "? string: ?") ? "" : data.REQ_COMPANY_NAME;
        //        string RESP_RMAG_NAME = (string.IsNullOrEmpty(data.RESP_RMAG_NAME) || data.RESP_RMAG_NAME.Trim().ToLower() == "all" || data.RESP_RMAG_NAME == "0" || data.RESP_RMAG_NAME == "? string:0 ?" || data.RESP_RMAG_NAME == "? undefined:undefined ?" || data.RESP_RMAG_NAME == "? string: ?") ? "" : data.RESP_RMAG_NAME;
        //        string RESP_COMPANY_NAME = (string.IsNullOrEmpty(data.RESP_COMPANY_NAME) || data.RESP_COMPANY_NAME.Trim().ToLower() == "all" || data.RESP_COMPANY_NAME == "0" || data.RESP_COMPANY_NAME == "? string:0 ?" || data.RESP_COMPANY_NAME == "? undefined:undefined ?" || data.RESP_COMPANY_NAME == "? string: ?") ? "" : data.RESP_COMPANY_NAME;
        //        //COMPANIES REQUESTING RESOURCES
        //        List<MATCHING_REQUESTSDC> matchingRequests = matchingHandler.GetRequestsForExport(EVENT_ID, VIEW_TYPE, CALC_RUN, REQ_RMAG_NAME, REQ_COMPANY_NAME);
        //        //COMPANIES OFFERING RESOURCES
        //        List<MATCHING_RESPONSESDC> matchingResponses = matchingHandler.GetResponsesForExport(EVENT_ID, VIEW_TYPE, CALC_RUN, MATCHING_RMAG_ID, MATCHING_REQUEST_ID, RESP_RMAG_NAME, RESP_COMPANY_NAME);

        //        #region Populate Data

        //        int maxVal = (matchingRequests.Count < matchingResponses.Count) ? matchingResponses.Count : matchingRequests.Count;
        //        headerRow0.Cells[20].MergeDown = maxVal + 2;
        //        headerRow0.Cells[20].Shading = new Shading()
        //        {
        //            Color = new Color(0, 0, 0)
        //        };

        //        for (int i = 0; i < maxVal; i++)
        //        {
        //            Row row = table.AddRow();
        //            MATCHING_REQUESTSDC _matchingRequest = null;
        //            MATCHING_RESPONSESDC _matchingResponse = null;
        //            if (i < matchingRequests.Count)
        //                _matchingRequest = matchingRequests[i];
        //            if (i < matchingResponses.Count)
        //                _matchingResponse = matchingResponses[i];

        //            if (_matchingRequest != null)
        //            {
        //                row.Cells[0].AddParagraph(_matchingRequest.COMPANY_NAME);
        //                row.Cells[1].AddParagraph(_matchingRequest.RMAG_NAME);
        //                row.Cells[2].AddParagraph(_matchingRequest.DISTRIBUTION == null ? "0" : _matchingRequest.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[3].AddParagraph(_matchingRequest.TRANSMISSION == null ? "0" : _matchingRequest.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[4].AddParagraph(_matchingRequest.DAMAGE_ASSESSMENT == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[5].AddParagraph(_matchingRequest.TREE == null ? "0" : _matchingRequest.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[6].AddParagraph(_matchingRequest.SUBSTATION == null ? "0" : _matchingRequest.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[7].AddParagraph(_matchingRequest.NET_UG == null ? "0" : _matchingRequest.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[8].AddParagraph(_matchingRequest.DISTRIBUTION_ESALOC == null ? "0" : _matchingRequest.DISTRIBUTION_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[9].AddParagraph(_matchingRequest.TRANSMISSION_ESALOC == null ? "0" : _matchingRequest.TRANSMISSION_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[10].AddParagraph(_matchingRequest.DAMAGE_ASSESSMENT_ESALOC == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[11].AddParagraph(_matchingRequest.TREE_ESALOC == null ? "0" : _matchingRequest.TREE_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[12].AddParagraph(_matchingRequest.SUBSTATION_ESALOC == null ? "0" : _matchingRequest.SUBSTATION_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[13].AddParagraph(_matchingRequest.NET_UG_ESALOC == null ? "0" : _matchingRequest.NET_UG_ESALOC.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[14].AddParagraph(_matchingRequest.DISTRIBUTION_ACQ == null ? "0" : _matchingRequest.DISTRIBUTION_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[15].AddParagraph(_matchingRequest.TRANSMISSION_ACQ == null ? "0" : _matchingRequest.TRANSMISSION_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[16].AddParagraph(_matchingRequest.DAMAGE_ASSESSMENT_ACQ == null ? "0" : _matchingRequest.DAMAGE_ASSESSMENT_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[17].AddParagraph(_matchingRequest.TREE_ACQ == null ? "0" : _matchingRequest.TREE_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[18].AddParagraph(_matchingRequest.SUBSTATION_ACQ == null ? "0" : _matchingRequest.SUBSTATION_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[19].AddParagraph(_matchingRequest.NET_UG_ACQ == null ? "0" : _matchingRequest.NET_UG_ACQ.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            }

        //            if (_matchingResponse != null)
        //            {
        //                TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchingResponse.TIME_ZONE + " Standard Time");
        //                string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchingResponse.TIME_ZONE);
        //                row.Cells[21].AddParagraph(_matchingResponse.COMPANY_NAME);
        //                row.Cells[22].AddParagraph(_matchingResponse.RMAG_NAME);
        //                row.Cells[23].AddParagraph(_matchingResponse.DISTRIBUTION == null ? "0" : _matchingResponse.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[24].AddParagraph(_matchingResponse.TRANSMISSION == null ? "0" : _matchingResponse.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[25].AddParagraph(_matchingResponse.DAMAGE_ASSESSMENT == null ? "0" : _matchingResponse.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[26].AddParagraph(_matchingResponse.TREE == null ? "0" : _matchingResponse.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[27].AddParagraph(_matchingResponse.SUBSTATION == null ? "0" : _matchingResponse.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[28].AddParagraph(_matchingResponse.NET_UG == null ? "0" : _matchingResponse.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //                row.Cells[29].AddParagraph(_matchingResponse.IS_COMPANY);
        //                row.Cells[30].AddParagraph(_matchingResponse.COMPANY_CITY);
        //                row.Cells[31].AddParagraph(_matchingResponse.COMPANY_STATE);
        //                row.Cells[32].AddParagraph(_matchingResponse.RELEASE_ROLE == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchingResponse.RELEASE_ROLE.Value, eventZone).ToString("MM/dd/yyyy HH:mm") + " " + eventZoneSuffix);
        //            }
        //        }

        //        #endregion
        //    }
        //}

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        public static void ExportCompanies(XSSFSheet sheet, StandardExportData data)
        {
            #region Build Header

            XSSFRow headerRow = (XSSFRow)sheet.CreateRow(0);
            NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
            style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
            NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
            font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
            style.SetFont(font);

            XSSFCell cell0 = (XSSFCell)headerRow.CreateCell(0);
            sheet.SetColumnWidth(0, 5000);
            cell0.CellStyle = style;
            cell0.SetCellValue("*CLIENT NAME");

            XSSFCell cell1 = (XSSFCell)headerRow.CreateCell(1);
            sheet.SetColumnWidth(1, 5000);
            cell1.CellStyle = style;
            cell1.SetCellValue("*NO. OF CUSTOMERS");

            XSSFCell cell2 = (XSSFCell)headerRow.CreateCell(2);
            sheet.SetColumnWidth(2, 5000);
            cell2.CellStyle = style;
            cell2.SetCellValue("*RMAGs");

            XSSFCell cell3 = (XSSFCell)headerRow.CreateCell(3);
            sheet.SetColumnWidth(3, 5000);
            cell3.CellStyle = style;
            cell3.SetCellValue("*HOME RMAG");

            XSSFCell cell4 = (XSSFCell)headerRow.CreateCell(4);
            sheet.SetColumnWidth(4, 5000);
            cell4.CellStyle = style;
            cell4.SetCellValue("*CLIENT PHONE");

            XSSFCell cell5 = (XSSFCell)headerRow.CreateCell(5);
            sheet.SetColumnWidth(5, 5000);
            cell5.CellStyle = style;
            cell5.SetCellValue("*PRIMARY CONTACT NAME");

            XSSFCell cell6 = (XSSFCell)headerRow.CreateCell(6);
            sheet.SetColumnWidth(6, 10000);
            cell6.CellStyle = style;
            cell6.SetCellValue("*PRIMARY CONTACT EMAIL");

            XSSFCell cell7 = (XSSFCell)headerRow.CreateCell(7);
            sheet.SetColumnWidth(7, 5000);
            cell7.CellStyle = style;
            cell7.SetCellValue("CITY");

            XSSFCell cell8 = (XSSFCell)headerRow.CreateCell(8);
            sheet.SetColumnWidth(8, 5000);
            cell8.CellStyle = style;
            cell8.SetCellValue("STATE");

            XSSFCell cell9 = (XSSFCell)headerRow.CreateCell(9);
            sheet.SetColumnWidth(9, 5000);
            cell9.CellStyle = style;
            cell9.SetCellValue("ZIP");

            XSSFCell cell10 = (XSSFCell)headerRow.CreateCell(10);
            sheet.SetColumnWidth(10, 5000);
            cell10.CellStyle = style;
            cell10.SetCellValue("STATUS");

            #endregion

            //Set freeze columns
            sheet.CreateFreezePane(4, 0);
            if (!string.IsNullOrEmpty(data.IDs))
            {
                //Get data from DB
                COMPANIEBL companiesHandler = new COMPANIEBL();
                List<COMPANIEDC> companies = companiesHandler.GetCompaniesForExport(data.IDs);

                #region Populate Data
                NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
                NPOI.SS.UserModel.ICell cell;
                int rowIndex = 1;
                foreach (COMPANIEDC company in companies)
                {
                    NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
                    row.CreateCell(0).SetCellValue(company.COMPANY_NAME);
                    //cell = row.CreateCell(1); cell.CellStyle = numberStyle; cell.SetCellValue(company.TOTAL_CUSTOMERS.ToString("#,##0"));
                    //row.CreateCell(2).SetCellValue(company.RMAGS_NAMES);
                    //row.CreateCell(3).SetCellValue(company.RMAG.RMAG_NAME);
                    row.CreateCell(1).SetCellValue(company.COMPANY_PHONE_NUMBER);
                    row.CreateCell(2).SetCellValue(company.PRIMARY_CONTACT_NAME);
                    row.CreateCell(3).SetCellValue(company.PRIMARY_CONTACT_EMAIL);
                    row.CreateCell(4).SetCellValue(company.COMPANY_CITY);
                    row.CreateCell(5).SetCellValue(company.COMPANY_STATE);
                    row.CreateCell(6).SetCellValue(company.COMPANY_ZIP);
                    row.CreateCell(7).SetCellValue(company.COMPANY_ADDRESS);
                    row.CreateCell(8).SetCellValue(company.STATUS == "Y" ? "Active" : "InActive");
                    rowIndex++;
                }

                #endregion
            }
        }

        /// <summary>
        /// Export to PDF
        /// </summary>
        /// <param name="table"></param>
        /// <param name="data"></param>
        public static void ExportCompanies(ref Table table, StandardExportData data)
        {
            Unit width, height;
            PageSetup.GetPageSize(PageFormat.A4, out width, out height);
            width = Unit.FromMillimeter(510);
            table.Section.PageSetup.PageWidth = width;
            table.Section.PageSetup.PageHeight = height;

            #region Build Header

            Column column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(1.5));
            column = table.AddColumn(Unit.FromInch(2));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(2.5));
            column = table.AddColumn(Unit.FromInch(1));
            column = table.AddColumn(Unit.FromInch(1));
            column = table.AddColumn(Unit.FromInch(1));
            column = table.AddColumn(Unit.FromInch(1));

            Row headerRow = table.AddRow();
            Paragraph p = headerRow.Cells[0].AddParagraph();
            Font mandateryfont = new Font();
            mandateryfont.Bold = true;
            mandateryfont.Color = new Color(139, 0, 0);
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("CLIENT NAME", TextFormat.Bold);
            p = headerRow.Cells[1].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("NO. OF CUSTOMERS", TextFormat.Bold);
            p = headerRow.Cells[2].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("RMAGs", TextFormat.Bold);
            p = headerRow.Cells[3].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("HOME RMAG", TextFormat.Bold);
            p = headerRow.Cells[4].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("CLIENT PHONE #", TextFormat.Bold);
            p = headerRow.Cells[5].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("PRIMARY CONTACT NAME", TextFormat.Bold);
            p = headerRow.Cells[6].AddParagraph();
            p.AddFormattedText("*", mandateryfont);
            p.AddFormattedText("PRIMARY CONTACT EMAIL", TextFormat.Bold);
            p = headerRow.Cells[7].AddParagraph();
            p.AddFormattedText("CITY", TextFormat.Bold);
            p = headerRow.Cells[8].AddParagraph();
            p.AddFormattedText("STATE", TextFormat.Bold);
            p = headerRow.Cells[9].AddParagraph();
            p.AddFormattedText("ZIP", TextFormat.Bold);
            p = headerRow.Cells[10].AddParagraph();
            p.AddFormattedText("STATUS", TextFormat.Bold);

            #endregion
            if (!string.IsNullOrEmpty(data.IDs))
            {
                //Get data from DB
                COMPANIEBL companiesHandler = new COMPANIEBL();
                List<COMPANIEDC> companies = companiesHandler.GetCompaniesForExport(data.IDs);

                #region Populate Data

                foreach (COMPANIEDC company in companies)
                {
                    Row row = table.AddRow();
                    row.Cells[0].AddParagraph(company.COMPANY_NAME);
                    //row.Cells[1].AddParagraph(company.TOTAL_CUSTOMERS.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
                    //row.Cells[2].AddParagraph(company.RMAGS_NAMES);
                    //row.Cells[3].AddParagraph(company.RMAG.RMAG_NAME);
                    row.Cells[1].AddParagraph(company.COMPANY_PHONE_NUMBER);
                    row.Cells[2].AddParagraph(company.PRIMARY_CONTACT_NAME);
                    row.Cells[3].AddParagraph(company.PRIMARY_CONTACT_EMAIL);
                    row.Cells[4].AddParagraph(company.COMPANY_CITY);
                    row.Cells[5].AddParagraph(company.COMPANY_STATE);
                    row.Cells[6].AddParagraph(company.COMPANY_ZIP);
                    row.Cells[7].AddParagraph(company.COMPANY_ADDRESS);
                    row.Cells[8].AddParagraph(company.STATUS == "Y" ? "Active" : "InActive");
                }

                #endregion
            }
        }

        /// <summary>
        /// Export to Excel
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="data"></param>
        //public static void ExportMatchLog(XSSFSheet sheet, StandardExportData data)
        //{
        //    #region Build Header

        //    XSSFRow headerRow0_0 = (XSSFRow)sheet.CreateRow(0);
        //    XSSFRow headerRow1 = (XSSFRow)sheet.CreateRow(1);
        //    NPOI.SS.UserModel.ICellStyle fontOnlyStyle = sheet.Workbook.CreateCellStyle();
        //    NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
        //    fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
        //    NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
        //    font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
        //    fontOnlyStyle.SetFont(font);
        //    fontAndBorderStyle.SetFont(font);

        //    XSSFCell cell0_0 = (XSSFCell)headerRow0_0.CreateCell(0);
        //    cell0_0.CellStyle = fontOnlyStyle;
        //    cell0_0.SetCellValue("REQUESTING COMPANY");
        //    var cra0_0 = new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 4);
        //    sheet.AddMergedRegion(cra0_0);

        //    XSSFCell cell1_0 = (XSSFCell)headerRow1.CreateCell(0);
        //    sheet.SetColumnWidth(0, 5000);
        //    cell1_0.CellStyle = fontAndBorderStyle;
        //    cell1_0.SetCellValue("REQUESTING RMAG");

        //    XSSFCell cell1_1 = (XSSFCell)headerRow1.CreateCell(1);
        //    sheet.SetColumnWidth(1, 5000);
        //    cell1_1.CellStyle = fontAndBorderStyle;
        //    cell1_1.SetCellValue("CLIENT NAME");

        //    XSSFCell cell1_2 = (XSSFCell)headerRow1.CreateCell(2);
        //    sheet.SetColumnWidth(2, 5000);
        //    cell1_2.CellStyle = fontAndBorderStyle;
        //    cell1_2.SetCellValue("CONTACT NAME");

        //    XSSFCell cell1_3 = (XSSFCell)headerRow1.CreateCell(3);
        //    sheet.SetColumnWidth(3, 10000);
        //    cell1_3.CellStyle = fontAndBorderStyle;
        //    cell1_3.SetCellValue("CONTACT EMAIL");

        //    XSSFCell cell1_4 = (XSSFCell)headerRow1.CreateCell(4);
        //    sheet.SetColumnWidth(4, 5000);
        //    cell1_4.CellStyle = fontAndBorderStyle;
        //    cell1_4.SetCellValue("CLIENT PHONE #");

        //    XSSFCell cell0_5 = (XSSFCell)headerRow0_0.CreateCell(5);
        //    cell0_5.CellStyle = fontOnlyStyle;
        //    cell0_5.SetCellValue("RESPONDING COMPANY");
        //    var cra0_5 = new NPOI.SS.Util.CellRangeAddress(0, 0, 5, 9);
        //    sheet.AddMergedRegion(cra0_5);

        //    XSSFCell cell1_5_new = (XSSFCell)headerRow1.CreateCell(5);
        //    sheet.SetColumnWidth(5, 7000);
        //    cell1_5_new.CellStyle = fontAndBorderStyle;
        //    cell1_5_new.SetCellValue("RESPONDING COMPANY");

        //    XSSFCell cell1_5 = (XSSFCell)headerRow1.CreateCell(6);
        //    sheet.SetColumnWidth(6, 5000);
        //    cell1_5.CellStyle = fontAndBorderStyle;
        //    cell1_5.SetCellValue("CLIENT NAME");

        //    XSSFCell cell1_6 = (XSSFCell)headerRow1.CreateCell(7);
        //    sheet.SetColumnWidth(7, 5000);
        //    cell1_6.CellStyle = fontAndBorderStyle;
        //    cell1_6.SetCellValue("CONTACT NAME");

        //    XSSFCell cell1_7 = (XSSFCell)headerRow1.CreateCell(8);
        //    sheet.SetColumnWidth(8, 10000);
        //    cell1_7.CellStyle = fontAndBorderStyle;
        //    cell1_7.SetCellValue("CONTACT EMAIL");

        //    XSSFCell cell1_8 = (XSSFCell)headerRow1.CreateCell(9);
        //    sheet.SetColumnWidth(9, 5000);
        //    cell1_8.CellStyle = fontAndBorderStyle;
        //    cell1_8.SetCellValue("CLIENT PHONE #");

        //    XSSFCell cell0_9 = (XSSFCell)headerRow0_0.CreateCell(10);
        //    cell0_9.CellStyle = fontOnlyStyle;
        //    cell0_9.SetCellValue("MATCHED RESOURCES");
        //    var cra0_9 = new NPOI.SS.Util.CellRangeAddress(0, 0, 10, 15);
        //    sheet.AddMergedRegion(cra0_9);

        //    XSSFCell cell1_9 = (XSSFCell)headerRow1.CreateCell(10);
        //    sheet.SetColumnWidth(10, 2500);
        //    cell1_9.CellStyle = fontAndBorderStyle;
        //    cell1_9.SetCellValue("DIST.");

        //    XSSFCell cell1_10 = (XSSFCell)headerRow1.CreateCell(11);
        //    sheet.SetColumnWidth(11, 2500);
        //    cell1_10.CellStyle = fontAndBorderStyle;
        //    cell1_10.SetCellValue("TRANS.");

        //    XSSFCell cell1_11 = (XSSFCell)headerRow1.CreateCell(12);
        //    sheet.SetColumnWidth(12, 2500);
        //    cell1_11.CellStyle = fontAndBorderStyle;
        //    cell1_11.SetCellValue("DAMAGE");

        //    XSSFCell cell1_12 = (XSSFCell)headerRow1.CreateCell(13);
        //    sheet.SetColumnWidth(13, 2500);
        //    cell1_12.CellStyle = fontAndBorderStyle;
        //    cell1_12.SetCellValue("TREE");

        //    XSSFCell cell1_13 = (XSSFCell)headerRow1.CreateCell(14);
        //    sheet.SetColumnWidth(14, 2500);
        //    cell1_13.CellStyle = fontAndBorderStyle;
        //    cell1_13.SetCellValue("SUBST.");

        //    XSSFCell cell1_14 = (XSSFCell)headerRow1.CreateCell(15);
        //    sheet.SetColumnWidth(15, 2500);
        //    cell1_14.CellStyle = fontAndBorderStyle;
        //    cell1_14.SetCellValue("NET UG");

        //    XSSFCell cell0_15 = (XSSFCell)headerRow0_0.CreateCell(16);
        //    XSSFCell cell1_15 = (XSSFCell)headerRow1.CreateCell(16);
        //    sheet.SetColumnWidth(16, 5000);
        //    cell0_15.CellStyle = fontOnlyStyle;
        //    cell1_15.CellStyle = fontAndBorderStyle;
        //    cell0_15.SetCellValue("ASSIGNED BY");
        //    var cra15 = new NPOI.SS.Util.CellRangeAddress(0, 1, 16, 16);
        //    sheet.AddMergedRegion(cra15);

        //    XSSFCell cell0_16 = (XSSFCell)headerRow0_0.CreateCell(17);
        //    XSSFCell cell1_16 = (XSSFCell)headerRow1.CreateCell(17);
        //    sheet.SetColumnWidth(17, 5000);
        //    cell0_16.CellStyle = fontOnlyStyle;
        //    cell1_16.CellStyle = fontAndBorderStyle;
        //    cell0_16.SetCellValue("ASSIGNED DATE/TIME");
        //    var cra16 = new NPOI.SS.Util.CellRangeAddress(0, 1, 17, 17);
        //    sheet.AddMergedRegion(cra16);

        //    XSSFCell cell0_17 = (XSSFCell)headerRow0_0.CreateCell(18);
        //    XSSFCell cell1_17 = (XSSFCell)headerRow1.CreateCell(18);
        //    sheet.SetColumnWidth(18, 5000);
        //    cell0_17.CellStyle = fontOnlyStyle;
        //    cell1_17.CellStyle = fontAndBorderStyle;
        //    cell0_17.SetCellValue("MATCH TYPE");
        //    var cra17 = new NPOI.SS.Util.CellRangeAddress(0, 1, 18, 18);
        //    sheet.AddMergedRegion(cra17);

        //    XSSFCell cell0_18 = (XSSFCell)headerRow0_0.CreateCell(19);
        //    XSSFCell cell1_18 = (XSSFCell)headerRow1.CreateCell(19);
        //    sheet.SetColumnWidth(19, 5000);
        //    cell0_18.CellStyle = fontOnlyStyle;
        //    cell1_18.CellStyle = fontAndBorderStyle;
        //    cell0_18.SetCellValue("CALCULATION RUN");
        //    var cra18 = new NPOI.SS.Util.CellRangeAddress(0, 1, 19, 19);
        //    sheet.AddMergedRegion(cra18);

        //    XSSFCell cell0_19 = (XSSFCell)headerRow0_0.CreateCell(20);
        //    XSSFCell cell1_19 = (XSSFCell)headerRow1.CreateCell(20);
        //    sheet.SetColumnWidth(20, 5000);
        //    cell0_19.CellStyle = fontOnlyStyle;
        //    cell1_19.CellStyle = fontAndBorderStyle;
        //    cell0_19.SetCellValue("MATCHING STATUS");
        //    var cra19 = new NPOI.SS.Util.CellRangeAddress(0, 1, 20, 20);
        //    sheet.AddMergedRegion(cra19);

        //    XSSFCell cell0_20 = (XSSFCell)headerRow0_0.CreateCell(21);
        //    XSSFCell cell1_20 = (XSSFCell)headerRow1.CreateCell(21);
        //    sheet.SetColumnWidth(21, 5000);
        //    cell0_20.CellStyle = fontOnlyStyle;
        //    cell1_20.CellStyle = fontAndBorderStyle;
        //    cell0_20.SetCellValue("RELEASED/RECALLED STATUS");
        //    var cra20 = new NPOI.SS.Util.CellRangeAddress(0, 1, 21, 21);
        //    sheet.AddMergedRegion(cra20);

        //    XSSFCell cell0_21 = (XSSFCell)headerRow0_0.CreateCell(22);
        //    XSSFCell cell1_21 = (XSSFCell)headerRow1.CreateCell(22);
        //    sheet.SetColumnWidth(22, 5000);
        //    cell0_21.CellStyle = fontOnlyStyle;
        //    cell1_21.CellStyle = fontAndBorderStyle;
        //    cell0_21.SetCellValue("REASON");
        //    var cra21 = new NPOI.SS.Util.CellRangeAddress(0, 1, 22, 22);
        //    sheet.AddMergedRegion(cra21);

        //    XSSFCell cell0_22 = (XSSFCell)headerRow0_0.CreateCell(23);
        //    XSSFCell cell1_22 = (XSSFCell)headerRow1.CreateCell(23);
        //    sheet.SetColumnWidth(23, 5000);
        //    cell0_22.CellStyle = fontOnlyStyle;
        //    cell1_22.CellStyle = fontAndBorderStyle;
        //    cell0_22.SetCellValue("COMMENTS");
        //    var cra22 = new NPOI.SS.Util.CellRangeAddress(0, 1, 23, 23);
        //    sheet.AddMergedRegion(cra22);

        //    XSSFCell cell0_23 = (XSSFCell)headerRow0_0.CreateCell(24);
        //    XSSFCell cell1_23 = (XSSFCell)headerRow1.CreateCell(24);
        //    sheet.SetColumnWidth(24, 5000);
        //    cell0_23.CellStyle = fontOnlyStyle;
        //    cell1_23.CellStyle = fontAndBorderStyle;
        //    cell0_23.SetCellValue("RELEASED/RECALLED BY");
        //    var cra23 = new NPOI.SS.Util.CellRangeAddress(0, 1, 24, 24);
        //    sheet.AddMergedRegion(cra23);

        //    XSSFCell cell0_24 = (XSSFCell)headerRow0_0.CreateCell(25);
        //    XSSFCell cell1_24 = (XSSFCell)headerRow1.CreateCell(25);
        //    sheet.SetColumnWidth(25, 5000);
        //    cell0_24.CellStyle = fontOnlyStyle;
        //    cell1_24.CellStyle = fontAndBorderStyle;
        //    cell0_24.SetCellValue("RELEASED/RECALLED DATE/TIME");
        //    var cra24 = new NPOI.SS.Util.CellRangeAddress(0, 1, 25, 25);
        //    sheet.AddMergedRegion(cra24);

        //    XSSFCell cell0_25 = (XSSFCell)headerRow0_0.CreateCell(26);
        //    cell0_25.CellStyle = fontOnlyStyle;
        //    cell0_25.SetCellValue("RELEASED/RECALLED RESOURCES");
        //    var cra0_25 = new NPOI.SS.Util.CellRangeAddress(0, 0, 26, 31);
        //    sheet.AddMergedRegion(cra0_25);

        //    XSSFCell cell1_25 = (XSSFCell)headerRow1.CreateCell(26);
        //    sheet.SetColumnWidth(26, 2500);
        //    cell1_25.CellStyle = fontAndBorderStyle;
        //    cell1_25.SetCellValue("DIST.");

        //    XSSFCell cell1_26 = (XSSFCell)headerRow1.CreateCell(27);
        //    sheet.SetColumnWidth(27, 2500);
        //    cell1_26.CellStyle = fontAndBorderStyle;
        //    cell1_26.SetCellValue("TRANS.");

        //    XSSFCell cell1_27 = (XSSFCell)headerRow1.CreateCell(28);
        //    sheet.SetColumnWidth(28, 2500);
        //    cell1_27.CellStyle = fontAndBorderStyle;
        //    cell1_27.SetCellValue("DAMAGE");

        //    XSSFCell cell1_28 = (XSSFCell)headerRow1.CreateCell(29);
        //    sheet.SetColumnWidth(29, 2500);
        //    cell1_28.CellStyle = fontAndBorderStyle;
        //    cell1_28.SetCellValue("TREE");

        //    XSSFCell cell1_29 = (XSSFCell)headerRow1.CreateCell(30);
        //    sheet.SetColumnWidth(30, 2500);
        //    cell1_29.CellStyle = fontAndBorderStyle;
        //    cell1_29.SetCellValue("SUBST.");

        //    XSSFCell cell1_30 = (XSSFCell)headerRow1.CreateCell(31);
        //    sheet.SetColumnWidth(31, 2500);
        //    cell1_30.CellStyle = fontAndBorderStyle;
        //    cell1_30.SetCellValue("NET UG");

        //    #endregion

        //    //Set freeze columns
        //    sheet.CreateFreezePane(5, 0);
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        MATCHING_LOGBL matchLogHandler = new MATCHING_LOGBL();
        //        List<MATCHING_LOGDC> matchLogs = matchLogHandler.GetMatchLogForExport(data.IDs);

        //        #region Populate Data
        //        NPOI.SS.UserModel.ICellStyle numberStyle = CreateExcelNumberStyle(sheet);
        //        NPOI.SS.UserModel.ICell cell;
        //        int rowIndex = 2;
        //        foreach (MATCHING_LOGDC _matchLog in matchLogs)
        //        {
        //            NPOI.SS.UserModel.IRow row = sheet.CreateRow(rowIndex);
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchLog.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchLog.EVENT_TIME_ZONE_NAME);
        //            row.CreateCell(0).SetCellValue(_matchLog.REQUEST_RMAG_NAME);
        //            row.CreateCell(1).SetCellValue(_matchLog.REQUEST_COMPANY_NAME);
        //            row.CreateCell(2).SetCellValue(_matchLog.REQUEST_COMPANY_CONTACT);
        //            row.CreateCell(3).SetCellValue(_matchLog.REQUEST_COMPANY_EMAIL);
        //            row.CreateCell(4).SetCellValue(_matchLog.REQUEST_COMPANY_CELLPHONE);
        //            row.CreateCell(5).SetCellValue(_matchLog.RESPONSEING_COMPANY_NAME);
        //            row.CreateCell(6).SetCellValue(_matchLog.RESPONSE_COMPANY_NAME);
        //            row.CreateCell(7).SetCellValue(_matchLog.RESPONSE_COMPANY_CONTACT);
        //            row.CreateCell(8).SetCellValue(_matchLog.RESPONSE_COMPANY_EMAIL);
        //            row.CreateCell(9).SetCellValue(_matchLog.RESPONSE_COMPANY_CELLPHONE);
        //            cell = row.CreateCell(10); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.DISTRIBUTION == null ? "" : _matchLog.DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(11); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.TRANSMISSION == null ? "" : _matchLog.TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(12); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.DAMAGE_ASSESSMENT == null ? "" : _matchLog.DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(13); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.TREE == null ? "" : _matchLog.TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(14); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.SUBSTATION == null ? "" : _matchLog.SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(15); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.NET_UG == null ? "" : _matchLog.NET_UG.Value.ToString("#,##0"));
        //            row.CreateCell(16).SetCellValue(_matchLog.ASSIGNED_BY);
        //            row.CreateCell(17).SetCellValue(_matchLog.ASSIGNED_ON == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.ASSIGNED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.CreateCell(18).SetCellValue(_matchLog.MATCH_TYPE);
        //            row.CreateCell(19).SetCellValue(_matchLog.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.CreateCell(20).SetCellValue(_matchLog.MATCHING_STATUS == "D" ? "Deleted" : (_matchLog.MATCHING_COMPLETE.Value ? "Matching Completed" : ((_matchLog.MATCH_TYPE == "RMAG" && _matchLog.ALLOCATION_COMPLETE.Value) ? "Allocation Completed" : "")));
        //            row.CreateCell(21).SetCellValue(_matchLog.MATCHING_STATUS == "L" ? "Released" : (_matchLog.MATCHING_STATUS == "C" ? "Recalled" : ""));
        //            row.CreateCell(22).SetCellValue(_matchLog.RELEASE_RECALL_REASON);
        //            row.CreateCell(23).SetCellValue(_matchLog.RELEASE_RECALL_COMMENTS);
        //            row.CreateCell(24).SetCellValue(_matchLog.RELEASE_RECALL_BY);
        //            row.CreateCell(25).SetCellValue(_matchLog.RELEASE_RECALL_ON == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.RELEASE_RECALL_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            cell = row.CreateCell(26); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_DISTRIBUTION == null ? "" : _matchLog.RELEASE_RECALL_DISTRIBUTION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(27); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_TRANSMISSION == null ? "" : _matchLog.RELEASE_RECALL_TRANSMISSION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(28); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_DAMAGE_ASSESSMENT == null ? "" : _matchLog.RELEASE_RECALL_DAMAGE_ASSESSMENT.Value.ToString("#,##0"));
        //            cell = row.CreateCell(29); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_TREE == null ? "" : _matchLog.RELEASE_RECALL_TREE.Value.ToString("#,##0"));
        //            cell = row.CreateCell(30); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_SUBSTATION == null ? "" : _matchLog.RELEASE_RECALL_SUBSTATION.Value.ToString("#,##0"));
        //            cell = row.CreateCell(31); cell.CellStyle = numberStyle; cell.SetCellValue(_matchLog.RELEASE_RECALL_NET_UG == null ? "" : _matchLog.RELEASE_RECALL_NET_UG.Value.ToString("#,##0"));
        //            rowIndex++;
        //        }

        //        #endregion
        //    }
        //}

        ///// <summary>
        ///// Export to PDF
        ///// </summary>
        ///// <param name="table"></param>
        ///// <param name="data"></param>
        //public static void ExportMatchLog(ref Table table, StandardExportData data)
        //{
        //    Unit width, height;
        //    PageSetup.GetPageSize(PageFormat.A4, out width, out height);
        //    width = Unit.FromMillimeter(1180);
        //    table.Section.PageSetup.PageWidth = width;
        //    table.Section.PageSetup.PageHeight = height;

        //    #region Build Header

        //    Column column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(3.0));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.0));
        //    column = table.AddColumn(Unit.FromInch(2.0));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(1.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(2.5));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));
        //    column = table.AddColumn(Unit.FromInch(1));

        //    Row headerRow0_0 = table.AddRow();
        //    Row headerRow1 = table.AddRow();

        //    headerRow0_0.Cells[0].MergeRight = 4;
        //    Paragraph p = headerRow0_0.Cells[0].AddParagraph();
        //    p.AddFormattedText("REQUESTING COMPANY", TextFormat.Bold);

        //    p = headerRow1.Cells[0].AddParagraph();
        //    p.AddFormattedText("REQUESTING RMAG", TextFormat.Bold);

        //    p = headerRow1.Cells[1].AddParagraph();
        //    p.AddFormattedText("CLIENT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[2].AddParagraph();
        //    p.AddFormattedText("CONTACT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[3].AddParagraph();
        //    p.AddFormattedText("CONTACT EMAIL", TextFormat.Bold);

        //    p = headerRow1.Cells[4].AddParagraph();
        //    p.AddFormattedText("CLIENT PHONE #", TextFormat.Bold);

        //    headerRow0_0.Cells[5].MergeRight = 4;
        //    p = headerRow0_0.Cells[5].AddParagraph();
        //    p.AddFormattedText("RESPONDING COMPANY", TextFormat.Bold);

        //    p = headerRow1.Cells[5].AddParagraph();
        //    p.AddFormattedText("RESPONDING COMPANY", TextFormat.Bold);

        //    p = headerRow1.Cells[6].AddParagraph();
        //    p.AddFormattedText("CLIENT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[7].AddParagraph();
        //    p.AddFormattedText("CONTACT NAME", TextFormat.Bold);

        //    p = headerRow1.Cells[8].AddParagraph();
        //    p.AddFormattedText("CONTACT EMAIL", TextFormat.Bold);

        //    p = headerRow1.Cells[9].AddParagraph();
        //    p.AddFormattedText("CLIENT PHONE #", TextFormat.Bold);

        //    headerRow0_0.Cells[10].MergeRight = 5;
        //    p = headerRow0_0.Cells[9].AddParagraph();
        //    p.AddFormattedText("MATCHED RESOURCES", TextFormat.Bold);

        //    p = headerRow1.Cells[10].AddParagraph();
        //    p.AddFormattedText("DIST.", TextFormat.Bold);

        //    p = headerRow1.Cells[11].AddParagraph();
        //    p.AddFormattedText("TRANS.", TextFormat.Bold);

        //    p = headerRow1.Cells[12].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[13].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[14].AddParagraph();
        //    p.AddFormattedText("SUBST.", TextFormat.Bold);

        //    p = headerRow1.Cells[15].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    headerRow0_0.Cells[16].MergeDown = 1;
        //    p = headerRow0_0.Cells[16].AddParagraph();
        //    p.AddFormattedText("ASSIGNED BY", TextFormat.Bold);

        //    headerRow0_0.Cells[17].MergeDown = 1;
        //    p = headerRow0_0.Cells[17].AddParagraph();
        //    p.AddFormattedText("ASSIGNED DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[18].MergeDown = 1;
        //    p = headerRow0_0.Cells[18].AddParagraph();
        //    p.AddFormattedText("MATCH TYPE", TextFormat.Bold);

        //    headerRow0_0.Cells[19].MergeDown = 1;
        //    p = headerRow0_0.Cells[19].AddParagraph();
        //    p.AddFormattedText("CALCULATION RUN", TextFormat.Bold);

        //    headerRow0_0.Cells[20].MergeDown = 1;
        //    p = headerRow0_0.Cells[20].AddParagraph();
        //    p.AddFormattedText("MATCHING STATUS", TextFormat.Bold);

        //    headerRow0_0.Cells[21].MergeDown = 1;
        //    p = headerRow0_0.Cells[21].AddParagraph();
        //    p.AddFormattedText("RELEASED/RECALLED STATUS", TextFormat.Bold);

        //    headerRow0_0.Cells[22].MergeDown = 1;
        //    p = headerRow0_0.Cells[22].AddParagraph();
        //    p.AddFormattedText("REASON", TextFormat.Bold);

        //    headerRow0_0.Cells[23].MergeDown = 1;
        //    p = headerRow0_0.Cells[23].AddParagraph();
        //    p.AddFormattedText("COMMENTS", TextFormat.Bold);

        //    headerRow0_0.Cells[24].MergeDown = 1;
        //    p = headerRow0_0.Cells[24].AddParagraph();
        //    p.AddFormattedText("RELEASED/RECALLED BY", TextFormat.Bold);

        //    headerRow0_0.Cells[25].MergeDown = 1;
        //    p = headerRow0_0.Cells[25].AddParagraph();
        //    p.AddFormattedText("RELEASED/RECALLED DATE/TIME", TextFormat.Bold);

        //    headerRow0_0.Cells[26].MergeRight = 5;
        //    p = headerRow0_0.Cells[26].AddParagraph();
        //    p.AddFormattedText("RELEASED/RECALLED RESOURCES", TextFormat.Bold);

        //    p = headerRow1.Cells[26].AddParagraph();
        //    p.AddFormattedText("DIST.", TextFormat.Bold);

        //    p = headerRow1.Cells[27].AddParagraph();
        //    p.AddFormattedText("TRANS.", TextFormat.Bold);

        //    p = headerRow1.Cells[28].AddParagraph();
        //    p.AddFormattedText("DAMAGE", TextFormat.Bold);

        //    p = headerRow1.Cells[29].AddParagraph();
        //    p.AddFormattedText("TREE", TextFormat.Bold);

        //    p = headerRow1.Cells[30].AddParagraph();
        //    p.AddFormattedText("SUBST.", TextFormat.Bold);

        //    p = headerRow1.Cells[31].AddParagraph();
        //    p.AddFormattedText("NET UG", TextFormat.Bold);

        //    #endregion
        //    if (!string.IsNullOrEmpty(data.IDs))
        //    {
        //        //Get data from DB
        //        MATCHING_LOGBL matchLogHandler = new MATCHING_LOGBL();
        //        List<MATCHING_LOGDC> matchLogs = matchLogHandler.GetMatchLogForExport(data.IDs);

        //        #region Populate Data

        //        foreach (MATCHING_LOGDC _matchLog in matchLogs)
        //        {
        //            Row row = table.AddRow();
        //            TimeZoneInfo eventZone = TimeZoneInfo.FindSystemTimeZoneById(_matchLog.EVENT_TIME_ZONE_NAME + " Standard Time");
        //            string eventZoneSuffix = Utility.GetTimeZoneSuffix(_matchLog.EVENT_TIME_ZONE_NAME);
        //            row.Cells[0].AddParagraph(_matchLog.REQUEST_RMAG_NAME);
        //            row.Cells[1].AddParagraph(_matchLog.REQUEST_COMPANY_NAME);
        //            row.Cells[2].AddParagraph(_matchLog.REQUEST_COMPANY_CONTACT);
        //            row.Cells[3].AddParagraph(_matchLog.REQUEST_COMPANY_EMAIL);
        //            row.Cells[4].AddParagraph(_matchLog.REQUEST_COMPANY_CELLPHONE);
        //            row.Cells[5].AddParagraph(_matchLog.RESPONSEING_COMPANY_NAME);
        //            row.Cells[6].AddParagraph(_matchLog.RESPONSE_COMPANY_NAME);
        //            row.Cells[7].AddParagraph(_matchLog.RESPONSE_COMPANY_CONTACT);
        //            row.Cells[8].AddParagraph(_matchLog.RESPONSE_COMPANY_EMAIL);
        //            row.Cells[9].AddParagraph(_matchLog.RESPONSE_COMPANY_CELLPHONE);
        //            row.Cells[10].AddParagraph(_matchLog.DISTRIBUTION == null ? "" : _matchLog.DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[11].AddParagraph(_matchLog.TRANSMISSION == null ? "" : _matchLog.TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[12].AddParagraph(_matchLog.DAMAGE_ASSESSMENT == null ? "" : _matchLog.DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[13].AddParagraph(_matchLog.TREE == null ? "" : _matchLog.TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[14].AddParagraph(_matchLog.SUBSTATION == null ? "" : _matchLog.SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[15].AddParagraph(_matchLog.NET_UG == null ? "" : _matchLog.NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[16].AddParagraph(_matchLog.ASSIGNED_BY);
        //            row.Cells[17].AddParagraph(_matchLog.ASSIGNED_ON == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.ASSIGNED_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[18].AddParagraph(_matchLog.MATCH_TYPE);
        //            row.Cells[19].AddParagraph(_matchLog.CALCULATION_RUN == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.CALCULATION_RUN.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[20].AddParagraph(_matchLog.MATCHING_STATUS == "D" ? "Deleted" : (_matchLog.MATCHING_COMPLETE.Value ? "Matching Completed" : ((_matchLog.MATCH_TYPE == "RMAG" && _matchLog.ALLOCATION_COMPLETE.Value) ? "Allocation Completed" : "")));
        //            row.Cells[21].AddParagraph(_matchLog.MATCHING_STATUS == "L" ? "Released" : (_matchLog.MATCHING_STATUS == "C" ? "Recalled" : ""));
        //            row.Cells[22].AddParagraph(_matchLog.RELEASE_RECALL_REASON);
        //            row.Cells[23].AddParagraph(_matchLog.RELEASE_RECALL_COMMENTS);
        //            row.Cells[24].AddParagraph(_matchLog.RELEASE_RECALL_BY);
        //            row.Cells[25].AddParagraph(_matchLog.RELEASE_RECALL_ON == null ? "" : TimeZoneInfo.ConvertTimeFromUtc(_matchLog.RELEASE_RECALL_ON.Value, eventZone).ToString("MM/dd/yyyy hh:mm") + " " + eventZoneSuffix);
        //            row.Cells[26].AddParagraph(_matchLog.RELEASE_RECALL_DISTRIBUTION == null ? "" : _matchLog.RELEASE_RECALL_DISTRIBUTION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[27].AddParagraph(_matchLog.RELEASE_RECALL_TRANSMISSION == null ? "" : _matchLog.RELEASE_RECALL_TRANSMISSION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[28].AddParagraph(_matchLog.RELEASE_RECALL_DAMAGE_ASSESSMENT == null ? "" : _matchLog.RELEASE_RECALL_DAMAGE_ASSESSMENT.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[29].AddParagraph(_matchLog.RELEASE_RECALL_TREE == null ? "" : _matchLog.RELEASE_RECALL_TREE.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[30].AddParagraph(_matchLog.RELEASE_RECALL_SUBSTATION == null ? "" : _matchLog.RELEASE_RECALL_SUBSTATION.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //            row.Cells[31].AddParagraph(_matchLog.RELEASE_RECALL_NET_UG == null ? "" : _matchLog.RELEASE_RECALL_NET_UG.Value.ToString("#,##0")).Format.Alignment = ParagraphAlignment.Right;
        //        }

        //        #endregion
        //    }
        //}

        public static void AdhocReport(XSSFSheet sheet, AdhocReportData data)
        {

            if (!string.IsNullOrEmpty(data.QUERY))
            {
                AdhocReportBL AdhocHandler = new AdhocReportBL();
                System.Data.DataTable dtAdhoc = new System.Data.DataTable();
                dtAdhoc = AdhocHandler.GetAdhocTable(data.QUERY);
                #region Build Header

                XSSFRow headerRow = (XSSFRow)sheet.CreateRow(0);
                NPOI.SS.UserModel.ICellStyle fontAndBorderStyle = sheet.Workbook.CreateCellStyle();
                fontAndBorderStyle.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thick;
                NPOI.SS.UserModel.IFont font = sheet.Workbook.CreateFont();
                font.Boldweight = (short)NPOI.SS.UserModel.FontBoldWeight.Bold;
                fontAndBorderStyle.SetFont(font);
                for (int intCol = 0; intCol < dtAdhoc.Columns.Count; intCol++)
                {
                    XSSFCell cell = (XSSFCell)headerRow.CreateCell(intCol);
                    cell.CellStyle = fontAndBorderStyle;
                    sheet.SetColumnWidth(intCol, 5000);
                    cell.SetCellValue(dtAdhoc.Columns[intCol].ColumnName);

                }


                #endregion

                if (dtAdhoc.Rows.Count > 0)
                {
                    #region Populate Data


                    for (int intRow = 0; intRow < dtAdhoc.Rows.Count; intRow++)
                    {
                        NPOI.SS.UserModel.IRow row = sheet.CreateRow(intRow + 1);
                        for (int intCol = 0; intCol < dtAdhoc.Columns.Count; intCol++)
                        {

                            if (dtAdhoc.Columns[intCol].DataType.ToString() == "DateTime")
                            {
                                row.CreateCell(intCol).SetCellValue(Convert.ToDateTime(dtAdhoc.Rows[intRow][intCol].ToString()).ToString("MM/dd/yyyy hh:mm"));
                            }
                            else
                            {
                                row.CreateCell(intCol).SetCellValue(dtAdhoc.Rows[intRow][intCol].ToString());
                            }
                        }

                    }

                    #endregion
                }
            }

        }

        public static void AdhocReport(ref Table table, AdhocReportData data)
        {
            Unit width, height;
            PageSetup.GetPageSize(PageFormat.A4, out width, out height);
            width = Unit.FromMillimeter(1180);
            table.Section.PageSetup.PageWidth = width;
            table.Section.PageSetup.PageHeight = height;

            if (!string.IsNullOrEmpty(data.QUERY))
            {
                AdhocReportBL AdhocHandler = new AdhocReportBL();
                System.Data.DataTable dtAdhoc = new System.Data.DataTable();
                dtAdhoc = AdhocHandler.GetAdhocTable(data.QUERY);

                #region Build Header
                Column column;
                for (int intCol = 0; intCol < dtAdhoc.Columns.Count; intCol++)
                {
                    column = table.AddColumn(Unit.FromInch(1.5));
                }

                Row headerRow = table.AddRow();
                for (int intCol = 0; intCol < dtAdhoc.Columns.Count; intCol++)
                {
                    Paragraph p = headerRow.Cells[intCol].AddParagraph();
                    p.AddFormattedText(dtAdhoc.Columns[intCol].ColumnName, TextFormat.Bold);
                }



                #endregion

                if (dtAdhoc.Rows.Count > 0)
                {
                    #region Populate Data

                    for (int intRow = 0; intRow < dtAdhoc.Rows.Count; intRow++)
                    {
                        Row row = table.AddRow();
                        for (int intCol = 0; intCol < dtAdhoc.Columns.Count; intCol++)
                        {
                            row.Cells[intCol].AddParagraph(dtAdhoc.Rows[intRow][intCol].ToString());
                        }
                    }



                    #endregion
                }

            }

        }

        private static NPOI.SS.UserModel.ICellStyle CreateExcelNumberStyle(XSSFSheet sheet)
        {
            NPOI.SS.UserModel.ICellStyle style = sheet.Workbook.CreateCellStyle();
            style.DataFormat = sheet.Workbook.CreateDataFormat().GetFormat("#,##0");
            style.Alignment = NPOI.SS.UserModel.HorizontalAlignment.Right;
            return style;
        }

    }
}
