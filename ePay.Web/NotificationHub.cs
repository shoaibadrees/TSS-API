using Microsoft.AspNet.SignalR; 
using Microsoft.AspNet.SignalR.Hubs; 
using System; 
using System.Collections.Generic; 
using System.Linq; 
using System.Threading.Tasks; 
using System.Web; 

namespace Hylan.Web
{
    public class NotificationHub : Hub
    {
        public void Send()
        {
            // Call the broadcastMessage method to update clients.
          Clients.All.broadcastMessage();
        }

    }  
}