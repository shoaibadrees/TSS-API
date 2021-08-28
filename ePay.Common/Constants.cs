using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EPay.Common
{
    public class Constants
    {
        //In Minutes, Default
        public const int FormsAuthenticationTimeoutDefault = 60;
        public const string DefaultCulture = "en-US";
        public const string DefaultDirection = "LTR";
        public const string TextLinkFormat = "TEXT ( visit LINK )";
        public const string LongDateFormat = "MM/dd/yyyy hh:mm";
        public const int DefaultMaxLength = 200;
        public static string SelectedEventID = string.Empty;
        public static string ConcurrencyMessageSingleRow = "Record(s) could not be updated since it has been " +
            "edited by another user. Data has been refreshed.";
        public const string GoogleMapAPIURL = "GoogleMapAPIURL";
        public const string ProxyAddress = "ProxyAddress";
        public const string ProxyUserName = "ProxyUserName";
        public const string ProxyPassword = "ProxyPassword";
        public const int AdminUserID = 147;
        public class Status
        {
            public const string Active = "Y";
            public const string InActive = "N";
        }
        public enum DataType
        {
            String = 1,
            Date = 2,
            Number = 3,
            Lookup = 4
        }
        public enum ReportType
        {
            OUTAGE_NUMBERS = 1,
            OUTAGE_CASES = 2
        }
        public class ContactFieldNames
        {
            public const string FirstName = "FirstName";
            public const string MiddleName = "MiddleName";
            public const string LastName = "LastName";
            public const string Organization = "Organization";
            public const string Address1 = "Address1";
            public const string Address2 = "Address2";
            public const string City = "City";
            public const string ZipCode = "ZipCode";
            public const string Phone = "Phone";
            public const string SecondaryPhone = "SecondaryPhone";
            public const string Fax = "Fax";
            public const string Email = "Email";
            public const string Website = "Website";
        }
        public enum CustomObjectType
        {
            Event,
            Contact,
        }
        public class Previliges
        {
            public const string Campaigns = "Campaigns";
            public const string Contacts = "Contacts";
            public const string Contents = "Contents";
            public const string Reports = "Reports";
            public const string Admin = "Admin";
        }
        //They need to be synched to Database Table
        //EMS_EmailFormats_LKP
        public enum EmailFormats
        {
            Html = 1,
            Text = 2
        };
        public class LogTypes
        {
            public const string Error = "E";
            public const string Information = "I";
        }
        public enum StatusType
        {
            Error,
            Information
        };
        public class LogSources
        {
            public const string ImportRemotelyMakeQuery = "Import Remote - Make Query";
        }
        public class Messages
        {
            public static class LogMessages
            {
                public const string InvalidEmailAddress = "Invalid Email Address '{0}'";
            }
        }
        public enum MenuSetEnum
        {
            Compaigns = 0,
            Contacts = 1,
            Reports = 2,
            Admin = 3
        };
        public enum SubMenuSetEnum
        {
            None = 0,
            CompaignEvents = 1,
            UserManager = 2
        };
        //Should only be used when connecting to remote database
        public enum ServerType
        {
            SQLServer,
            Oracle,
        };
        public enum Screen
        {
            Campaigns,
            CampaignEventContSegment,
            CampaignEvents,
            CampaignEventSummary,
            Contents,
            ContentHTML,
            ContentPlainText,
            ContentUsage,
            ContentAttachments,
            Segments,
            SegmentUsage,
            ReportClickThrough,
            ReportOpenEmail,
            Clients,
            Roles,
            RemoteConnection,
            Contacts,
            ProfileFields,
            ReportCampaignSummary,
            Lists,
            ListContacts,
            Users,
            ClientAssociation,
            RoleAssociation,
            ClientPrograms
        };
        public class EmailStatus
        {
            public const string Sent = "Sent";
            public const string NotSent = "Not Sent";
            public const string EmailAddressNotExists = "Not Sent";
            public const string ReceipentMailBoxFull = "The recipient's mailbox is full";
            public const string SameMailAddress = "Recipients have the same e-mail address";
            public const string SizeLimitation = "The message that was sent exceeded the size limitation allowed by the recipient’s mailbox";
            public const string MessageLoop = "The message loop has occurred";
            public const string TooManyReciepents = "The message has too many recipients";

        };
        public class CampaignEventStatus
        {
            public const string New = "New";
            public const string Running = "Running";
            public const string Reset = "Reset";
            public const string Stop = "Stopped";
            public const string Waiting = "Waiting";
            public const string Completed = "Completed";

        };
        public class CampaignEventAccessStatus
        {
            public const string New = "New";
            public const string Running = "Running";
            public const string Stopped = "Stopped";
            public const string Reset = "Reset";
        };
        public class HtmlAttributes
        {
            public const string Class = "class";
            public const string onClick = "onClick";
        }
        public class CssSelectors
        {
            public const string tablefton = "tablefton";
            public const string tabrighton = "tabrighton";
            public const string tabon = "tabon";
            public const string tableftoff = "tableftoff";
            public const string tabrightoff = "tabrightoff";
            public const string taboff = "taboff";

            public const string tab2lefton = "tab2lefton";
            public const string tab2righton = "tab2righton";
            public const string tab2on = "tab2on";
            public const string tab2leftoff = "tab2leftoff";
            public const string tab2rightoff = "tab2rightoff";
            public const string tab2off = "tab2off";

            public const string sidenavselected = "sidenavselected";
            public const string sidenav = "sidenav";
        }
        public class CacheKeys
        {
            public const string ForgotPasswordTemplate = "ForgotPasswordTemplate";
        }
        public class ConfigurationKeys
        {
            public const string SystemEmailAddress = "SystemEmailAddress";
            public const string FormsAuthenticationTimeout = "FormsAuthenticationTimeout";
        }
        public class SessionKeys
        {
            public const string RolesSearchOpenedKey = "RSO";
            public const string RolesAddOpenedKey = "RAO";
            public const string ClientsSearchOpenedKey = "CLIS";
            public const string ClientsAddOpenedKey = "CLIA";
            public const string UserSearchOpenedKey = "USO";
            public const string UsersAddOpenedKey = "UAO";
            public const string ClientProgramsSearchOpenedKey = "CLPSO";
            public const string ClientProgramsAddOpenedKey = "CLPAO";
            public const string RemoteConnSearchOpenedKey = "RCSO";
            public const string RemoteConnAddOpenedKey = "RCAO";
            public const string ContentsSearchOpenedKey = "CSO";
            public const string ContentsAddOpenedKey = "CAO";
            public const string ContentsAttachSearchOpenedKey = "CATSO";
            public const string ContentsAttachAddOpenedKey = "CATAO";
            public const string ContentsHTMLSearchOpenedKey = "CHTMSO";
            public const string ContentsTEXTSearchOpenedKey = "CTEXTSO";
            public const string ContentsUrlSearchOpenedKey = "CURLSO";
            public const string CampaignAddOpenedKey = "CAMPAO";
            public const string CampaignSearchOpenedKey = "CAMPSO";
            public const string ProfileFieldAddOpenedKey = "PFA";
            public const string ProfileFieldSearchOpenedKey = "PFS";
            public const string CampaignEventAddOpenedKey = "CEAO";
            public const string CampaignEventSearchOpenedKey = "CESO";
            public const string CampaignEventSummarySearchOpenedKey = "CESSO";
            public const string SegmentationAddOpendKey = "SAO";
            public const string SegmentationSearchOpenedKey = "SSO";

            public const string UserRowState = "URS";
            public const string ClientRowState = "CRS";
            public const string CampaignRowState = "CAMRS";
            public const string RoleRowState = "RRS";
            public const string RConnRowState = "RCRS";
            public const string ListRowState = "LSTRS";
            public const string ContentRowState = "CORS";
            public const string ClientProgramsRowState = "CPRS";
            public const string ContentAttachRowState = "CATRS";
            public const string ContentsUsageSearchOpenedKey = "CUSO";
            public const string SegmentUsageSearchOpenedKey = "SUSO";
            public const string ProfileFieldRowState = "PFRS";
            public const string CampaignEventRowState = "CERS";
            public const string SegmentationRowState = "SRS";

            public const string UserIDKey = "UserID";
            public const string RoleIDKey = "RoleID";
            public const string ClientIDKey = "ClientID";
            public const string ClientNameKey = "ClientName";
            public const string UserFullNameKey = "UserFullName";
            /****ZF:*****************/
            public const string UserRoleKey = "UserRole";
            public const string ClientSmtpKey = "ClientSmtp";
            public const string UserEmailKey = "UserEmail";
            public const string UserSMTPKey = "UserSMTP";
            public const string UserContact1Key = "UserContact1";
            public const string UserContact2Key = "UserContact2";
            public const string UserHomeHQ = "UserHomeHQ";
            public const string UserContact3Key = "UserContact3";
            /*********************/
            public const string RolePrivilegesKey = "RolePrivileges";
            public const string RoleSearchKey = "ManageRoleSearch";
            public const string ProtectiveDeviceGroupSearchKey = "ProtectiveDeviceGroupSearch";
            public const string RoleScreenColumnPrivilegesKey = "RoleScreenColumnPrivileges";
            public const string ScreenLabelConfigurationKey = "ScreenLabelConfigurationKey";
        }
        public class CookieKeys
        {
            public const string Language = "EMS.Lang";
        }
        public class ExceptionKeys
        {
            public const string Concurrency = "Concurrency,{0}";
        }
        public class ConnectionStringFormats
        {
            public const string SQLServer = "server={0};database={1};UID={2};PWD={3}";
        }
        public class CampaignExecution
        {
            public const string EmailSenderServicePorgram = "EmailSenderService.Program.cs";
            public const string EMSCampaignExecutionProgram = "EMS.CampaignExecution.Program.cs";
            public const string ArgumnentNotSpecified = "Arguments not specified";
        }

        public class AODClients
        {
            public const string StormServices = "Storm Services";
        }

        public static Dictionary<int, string> dicAssessmentTypes = new Dictionary<int, string>();
        
        #region Grid Options    (Imran Aslam)
        public static class GridOptions
        {
            public static int SmallPageSize = 5;
            public static int PageSize = 10;
            public static int LargePageSize = 20;
        }

        public static class LookUp_Option
        {
            public const string TicketStatus = "TICKET_STATUS";
            public const string FacilityType = "FACILITY_TYPE";
        }

        public static class WebConfigAppSettings
        {
            //public static string PlaceholderImageFileExtensions = System.Web.Configuration.WebConfigurationManager.AppSettings["ImageFileExtensions"].Trim();
            //public static string ClientRepository = System.Web.Configuration.WebConfigurationManager.AppSettings["ClientRepository"].Trim();
            //public static string TemplateFolderTemp = System.Web.Configuration.WebConfigurationManager.AppSettings["TemplateFolderTemp"].Trim();
            //public static string TemplateFolderExcel = System.Web.Configuration.WebConfigurationManager.AppSettings["TemplateFolderExcel"].Trim();
            //public static string ExcelConnectionString = System.Web.Configuration.WebConfigurationManager.AppSettings["ExcelConnectionString"].Trim();
        }

        #endregion

        public enum TicketStatus
        {
            //UnassignedOpen = 1,
            //AssignedOpen = 2,
            //AssignedClosed = 3,
            //InProgress = 4

            Unassigned = 1,
            Assigned = 2,
            //Closed = 3,
            //Completed = 3,
            Complete = 3,
            InProgress = 4,
            FeederComplete = 5
        };

        public enum Priority
        {
            //High = 1,
            //Medium = 2,
            //Low = 3
            Ten_Percent = 1,
            Back_Bone = 2,
            Outage_Ticket = 3,
            Lateral = 4,
            Complete_Walkdown = 5,
            Vegetation_Patrol = 6
        };
        //Dashboad Default Fiters
        public enum DefaultFilters
        {
            Ticket_Events = 1,
            Ticket_Priority = 2,
            Ticket_Status = 3,
            Ticket_State = 4,
            Assessor_Role = 5,
            Assessor_Availability = 6
        };

        public struct HylanTasksType {
            public const int CONTINUITY_ZERO = 1,
            FOUNDATION_WORK = 2,
            POLE_WORK = 3,
            FIBER_DIG = 4,
            POWER_DIG = 5,
            UG_MISC = 6,
            FIBER_PULL = 7,
            FIBER_SPLICE = 8,
            AC_POWER_POLE = 9,
            SHROUD_ANTENA = 10,
            PIM_SWEEP = 11;
        }
    }
       
}