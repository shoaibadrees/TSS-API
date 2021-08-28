using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;


namespace EPay.Common
{
    public class ExportUtility
    {
        public static HttpResponseMessage CreateExcelResponse(HttpRequestMessage request, HttpResponseMessage response, MemoryStream stream, string fileName)
        {
            try
            {
                response.Content = new ByteArrayContent(stream.ToArray());
                string saveAsFileName = fileName;
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
                response.Content.Headers.Add("x-filename", saveAsFileName);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = saveAsFileName;
            }
            catch (Exception ex)
            {
                return new HttpResponseMessage() { Content = new StringContent(ex.Message), RequestMessage = request };
            }
            return response;
        }
    }
   
}
