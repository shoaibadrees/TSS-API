using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace EPay.Common
{
    public static class RestClient
    {
        public static async Task<HttpResponseMessage> Get(string baseUrl, string requestUrl)
        {
            string strResponse = string.Empty;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                try
                {
                    HttpResponseMessage response = await client.GetAsync(requestUrl);
                    response.EnsureSuccessStatusCode();
                    if (response.IsSuccessStatusCode)
                    {
                        return response;
                    }
                    else
                    {
                        HttpResponseMessage err = new HttpResponseMessage(response.StatusCode);
                        err.ReasonPhrase = "API_GET_REQUEST_FAIL";
                        return err;
                    }
                }
                catch (Exception ex)
                {
                    HttpResponseMessage err = new HttpResponseMessage(System.Net.HttpStatusCode.InternalServerError);
                    err.ReasonPhrase = "API_GET_REQUEST_FAIL: " + ex.Message;
                    return err;
                }
            }
        }
    }
}