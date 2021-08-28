using System.Net.Http;

namespace EPay.API.Helpers
{
    interface IHostBufferPolicySelector
    {
        bool UseBufferedInputStream(object hostContext);
        bool UseBufferedOutputStream(HttpResponseMessage response);
    }
}

