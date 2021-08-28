using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// Summary description for UserLog
/// </summary>
public class UserLog
{
    private String _LoginId;
    private String _FirstName;
    private String _LastName;
    private String _IPAddress;
    private DateTime _LoginTime;
    private DateTime _LastRequestTime;

    public String LoginId
    {
        get { return _LoginId; }
        set { _LoginId = value; }
    }
    public String FirstName
    {
        get { return _FirstName; }
        set { _FirstName = value; }
    }
    public String LastName
    {
        get { return _LastName; }
        set { _LastName = value; }
    }
    public String IPAddress
    {
        get { return _IPAddress; }
        set { _IPAddress = value; }
    }
    public DateTime LoginTime
    {
        get { return _LoginTime; }
        set { _LoginTime = value; }
    }
    public DateTime LastRequestTime
    {
        get { return _LastRequestTime; }
        set { _LastRequestTime = value; }
    }
}
