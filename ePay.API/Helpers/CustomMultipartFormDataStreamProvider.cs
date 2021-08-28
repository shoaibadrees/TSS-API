using System.Net.Http;

namespace EPay.API.Helpers
{
    public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public CustomMultipartFormDataStreamProvider(string path) : base(path)
        { }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            string originalFileName = headers.ContentDisposition.FileName.Trim('\"');
            return originalFileName;
            //return string.Concat(originalFileName, ".zip");
        }
    }

    //public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    //{
    //    public CustomMultipartFormDataStreamProvider(string path) : base(path)
    //    { }

    //    public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
    //    {
    //        var name = !string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName) ? headers.ContentDisposition.FileName : "NoName";
    //        return name;
    //        //return name.Replace("",string.Empty); //this is here because Chrome submits files in quotation marks which get treated as part of the filename and get escaped
    //    }
    //}
}