using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Web.Security;
using System.Web.Configuration;
using System.Net.Http;
using System.Net;
using System.Xml.Linq;
using System.Globalization;
using System.IO;
using System.Web;

namespace EPay.Common
{
    public static class Utility
    {

        private static T CreateObject<T>(DataRow row)
        {
            T obj = default(T);
            if (row != null)
            {
                obj = Activator.CreateInstance<T>();

                foreach (DataColumn column in row.Table.Columns)
                {
                    PropertyInfo prop = obj.GetType().GetProperty(column.ColumnName);
                    try
                    {
                        prop.SetValue(obj, row.IsNull(prop.Name) ? null : row[prop.Name], null);
                    }
                    catch (Exception)
                    { }
                }
            }
            return obj;
        }
        private static DataTable CreateDataTable<T>()
        {
            Type entityType = typeof(T);
            DataTable table = new DataTable(entityType.Name);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);
            foreach (PropertyDescriptor prop in properties)
            {
                table.Columns.Add(prop.Name, prop.PropertyType);
            }
            return table;
        }
        public static DataTable ConvertToDataTable<T>(IList<T> list)
        {
            DataTable table = CreateDataTable<T>();
            Type entityType = typeof(T);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (T obj in list)
            {
                DataRow row = table.NewRow();

                foreach (PropertyDescriptor prop in properties)
                {
                    row[prop.Name] = prop.GetValue(obj);
                }

                table.Rows.Add(row);
            }

            return table;
        }
        public static List<T> ConvertToObjects<T>(DataTable dataTable)
        {
            List<T> list = null;
            if (dataTable != null)
            {
                list = new List<T>();

                foreach (DataRow row in dataTable.Rows)
                {
                    T item = CreateObject<T>(row);
                    list.Add(item);
                }
            }
            return list;
        }
        public static T ConvertToObject<T>(DataTable dataTable) where T : class, new()
        {
            T item = new T();
            if (dataTable != null && dataTable.Rows.Count > 0)
            {
                item = CreateObject<T>(dataTable.Rows[0]);
            }
            return item;
        }
        public static DataTable CreateIDsTable(int[] ids)
        {
            DataTable dtIds = new DataTable();
            dtIds.Columns.Add("ID", typeof(int));
            foreach (int id in ids)
            {
                dtIds.Rows.Add(id);
            }
            return dtIds;
        }

        public static int[] FillArray(string strObjects)
        {
            int[] objects = new int[0];
            if (strObjects != "")
            {
                int index = 0;
                string[] arrObjects = strObjects.Split(',');
                objects = new int[arrObjects.Length];
                foreach (string obj in arrObjects)
                {
                    objects[index] = Convert.ToInt32(obj);
                    index++;
                }

            }
            return objects;
        }
        public static int GetTicketTimeoutInMinutes()
        {
            int defaultTimeout = 60;
            AuthenticationSection objAuthenticationSection
            = (AuthenticationSection)ConfigurationManager.GetSection("system.web/authentication");

            if (objAuthenticationSection != null && objAuthenticationSection.Mode == AuthenticationMode.Forms)
            {
                defaultTimeout = Convert.ToInt32(objAuthenticationSection.Forms.Timeout.TotalMinutes);
            }

            return defaultTimeout;
        }
        public static bool IsDayTimeSavingEffective(DateTime day, String strTimezone)
        {
            String strTimeZoneName = "";
            switch (strTimezone)
            {
                case "Eastern":
                case "EST":
                    strTimeZoneName = "Eastern Standard Time";
                    break;
                case "Central":
                case "CST":
                    strTimeZoneName = "Central Standard Time";
                    break;
                case "Pacific":
                case "PST":
                    strTimeZoneName = "Pacific Standard Time";
                    break;
                case "Mountain":
                case "MST":
                    strTimeZoneName = "Mountain Standard Time";
                    break;
            }
            bool isDaylight = false;
            if (strTimeZoneName != "")
            {
                TimeZoneInfo tst = TimeZoneInfo.FindSystemTimeZoneById(strTimeZoneName);

                isDaylight = tst.IsDaylightSavingTime(day);
            }
            return isDaylight;
        }

        public static string GetTimeZoneSuffix(string timeZone)
        {
            string suffix = "";
            switch (timeZone)
            {
                case "Eastern":
                    suffix = "EST";
                    break;
                case "Central":
                    suffix = "CEN";
                    break;
                case "Pacific":
                    suffix = "PAC";
                    break;
                case "Mountain":
                    suffix = "MNT";
                    break;
            }
            return suffix;
        }

        public static string GenerateRandomPassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }

        public static int GetUserID(HttpRequestMessage request)
        {
            string auth = Convert.ToString(request.Headers.Authorization);
            int id = 0;
            if (auth.Length > 0)
                id = Convert.ToInt32(auth.Substring(6, auth.Length - 6));
            return id;
        }
    }

    public class GMGeocoder
    {
        public static GeocoderLocation GoeCodeSync(string query)
        {
            GeocoderLocation geoLocation = null;
            try
            {
                String mapAPIURL = "http://maps.googleapis.com/maps/api/geocode/xml?sensor=false";
                if (!String.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.GoogleMapAPIURL]))
                    mapAPIURL = ConfigurationManager.AppSettings[Constants.GoogleMapAPIURL];

                WebRequest webRequest = WebRequest.Create(mapAPIURL + "&address=" + HttpUtility.UrlEncode(query));
                #region Proxy Settings
                if (!String.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.ProxyAddress]))
                {
                    WebProxy webProxy = new WebProxy(ConfigurationManager.AppSettings[Constants.ProxyAddress], false);
                    if (!String.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.ProxyUserName]) &&
                        !String.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.ProxyPassword]))
                    {
                        webProxy.Credentials = new NetworkCredential(ConfigurationManager.AppSettings[Constants.ProxyUserName],
                            ConfigurationManager.AppSettings[Constants.ProxyPassword]);
                    }
                    webRequest.Proxy = webProxy;
                }
                #endregion
                using (WebResponse webResponse = webRequest.GetResponse())
                {
                    using (Stream stream = webResponse.GetResponseStream())
                    {
                        XDocument document = XDocument.Load(new StreamReader(stream));

                        XElement longitudeElement = document.Descendants("lng").FirstOrDefault();
                        XElement latitudeElement = document.Descendants("lat").FirstOrDefault();

                        if (longitudeElement != null && latitudeElement != null)
                        {
                            geoLocation = new GeocoderLocation
                            {
                                Longitude = Double.Parse(longitudeElement.Value, CultureInfo.InvariantCulture),
                                Latitude = Double.Parse(latitudeElement.Value, CultureInfo.InvariantCulture)
                            };
                        }
                        XElement statusElement = document.Descendants("status").FirstOrDefault();
                        if (statusElement != null && !String.IsNullOrEmpty(statusElement.Value) && statusElement.Value.ToLower() != "ok")
                        {
                            //Utility.InsertIntoErrorLog("Utility.GoeCodeSync", Utility.PrepareStringForDB("GeoCoding Response for '" + query + "' is: ") + statusElement.Value, "Admin");
                        }
                    }
                }
            }
            catch (Exception exp)
            {
                //Utility.InsertIntoErrorLog(exp.Source, exp.Message + "\r\n" + exp.StackTrace, "Admin");
            }
            return geoLocation;
        }
        public static async Task<GeocoderLocation> GoeCodeAsync(string query)
        {
            GeocoderLocation geoLocation = null;
            await Task.Run(() => { geoLocation = GoeCodeSync(query); });
            return geoLocation;
        }

    }

    [Serializable]
    public class GeocoderLocation
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        public override string ToString()
        {
            return String.Format("{0}, {1}", Latitude, Longitude);
        }
    }
}
