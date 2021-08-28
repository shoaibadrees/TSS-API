using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Hylan.Web.Controllers
{
    [Authorize]
    public class UsersController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult UserRoles()
        {
            return View();
        }

        public ActionResult UserRoleDetails(string id)
        {
            int _id = -1;
            if (Int32.TryParse(id, out _id) == true)
            {
                return View("UserRoleDetails");
            }
            else
            {
                return RedirectToAction("UserRoles");
            }
        }

        public ActionResult UserProfile()
        {
            return View();
        }
	}
}