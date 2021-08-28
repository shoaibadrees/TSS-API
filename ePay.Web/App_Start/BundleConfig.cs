using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace Hylan.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bootstrap styles
            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/scroll.css",
                      "~/Content/custom_index.css",
                      "~/Content/ngDialog.css",
                      //"~/Content/ngDialog-custom-width.css",
                      "~/Content/ngDialog-theme-default.css",
                      //"~/Content/ngDialog-theme-plain.css",
                      "~/Content/popup.css",
                      "~/Content/bootstrap-tagsinput.css"
                      ));
            //kendo styles
            bundles.Add(new StyleBundle("~/Content/kendo/css")
                    .Include("~/Content/kendo/kendo.common.min.css")
                   .Include("~/Content/kendo/kendo.default.min.css")
                   );
            //application styles
            bundles.Add(new StyleBundle("~/Content/css")
                    .Include("~/Content/custom.css")
                    .Include("~/Content/progress-wizard.min.css")
                    .Include("~/Content/cardstyle.css"));
            //vendor stripts
            bundles.Add(new ScriptBundle("~/Scripts/vendor_scripts").Include(
                "~/Scripts/jquery.js",
                "~/Scripts/jquery-ui.js",
                "~/Scripts/bootstrap.min.js",
                "~/Scripts/xlsx.core.min.js",
              //  "~/Scripts/jquery.signalR-2.2.0.min.js",
                "~/Scripts/lionbars.js",
                "~/Scripts/alasql.min.js",
                "~/Scripts/angular.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-ui-router.min.js",
                "~/Scripts/angular-resource.js",
                "~/Scripts/angular-cookies.js",
                "~/Scripts/angularjs-dropdown-multiselect.min.js",
                "~/Scripts/kendo.all.min.js",
                "~/Scripts/underscore-min.js",
                "~/Scripts/ngDialog.js",
                "~/Scripts/jszip.min.js",
                "~/Scripts/respond.js",
                "~/Scripts/moment.min.js",
                "~/Scripts/moment-timezone-data.js",
                "~/Scripts/js.cookie.js",
                "~/Scripts/common.js",
                "~/Scripts/vanilla-masker.min.js",
                "~/Scripts/crypto-hmac-sha256.min.js",
                "~/Scripts/crypto-enc-base64-min.js",
                "~/Scripts/modernizr-2.8.3.js",
                "~/Scripts/angular-messages.js",
                "~/Scripts/masonry.pkgd.min.js",
                "~/Scripts/ng-file-upload-all.js",
                "~/Scripts/ui-bootstrap-tpls.js",
                "~/Scripts/maskeddatepicker.js",
                "~/Scripts/spin.js"
                ));
            //application scripts
            bundles.Add(new ScriptBundle("~/Scripts/hylan_scripts").Include(
               "~/app/core/AppSettings.js",
               "~/app/core/globals.js",
                "~/app/core/common.js",
                "~/app/core/utility.js",
                "~/app/hylan.app.js",
                "~/app/hylan.app.config.js",
                "~/app/core/basecontroller.js",
                "~/app/core/datacontext.js",
                "~/app/core/services/validationservice.js",
                "~/app/core/services/cacheservice.js",
                "~/app/core/directives/attachmentcontrol.js", 
                "~/app/core/directives/servicemessages.js",
                "~/app/core/directives/formatamountinput.js",
                "~/app/core/directives/positivenumber.js",
                "~/app/account/services/loginservice.js",
                "~/app/account/controllers/logincontroller.js",
                "~/app/companies/services/companiesservice.js",
                "~/app/companies/controllers/companiescontroller.js",
                "~/app/users/services/usersservice.js",
                "~/app/users/controllers/userscontroller.js",
                "~/app/users/services/userprofileservice.js",
                "~/app/users/controllers/userprofilecontroller.js",
                "~/app/projects/services/projectsservice.js",
                "~/app/users/controllers/userrolescontroller.js",
                "~/app/users/controllers/userroledetailscontroller.js",
                "~/app/users/services/userrolesservice.js",
                "~/app/projects/controllers/projectscontroller.js",
                 "~/app/schedulers/controllers/messagescontroller.js",
                 "~/app/schedulers/services/messagesservice.js",
                 "~/app/maps/controllers/mapscontroller.js",
                 "~/app/maps/services/mapsservices.js",
                 "~/app/reports/services/preformattedreportsservice.js",
                 "~/app/reports/controllers/preformattedreportscontroller.js",
                 "~/app/reports/controllers/resourcereportcontroller.js",
                 "~/app/reports/services/adhocreportsservice.js",
                 "~/app/reports/controllers/adhocreportcontroller.js",
                 "~/app/projects/services/projectcrudservice.js",
                "~/app/projects/controllers/projectcrudcontroller.js",
                 "~/app/jobs/services/jobsservice.js",
                 "~/app/jobs/controllers/jobscontroller.js",
                 "~/app/jobs/services/jobcrudservice.js",
                 "~/app/jobs/controllers/jobcrudcontroller.js",
                  "~/app/Notes/services/Notesservice.js",
                 "~/app/Notes/controllers/Notescontroller.js",
                 "~/app/tasks/services/tasksservice.js",
                 "~/app/tasks/controllers/taskscontroller.js",
                 "~/app/tasks/services/tasksrosterservice.js",
                 "~/app/tasks/controllers/tasksrostercontroller.js",
                 "~/app/attachments/controllers/attachmentscontroller.js",
                 "~/app/attachments/controllers/attachmentscrudcontroller.js",
                 "~/app/attachments/services/attachmentservice.js",
                 "~/app/attachments/config/gridconfig.js",
                 "~/app/dailies/services/dailiesservice.js",
                 "~/app/dailies/controllers/dailiescontroller.js",
                 "~/app/dailies/services/dailiescrudservice.js",
                 "~/app/dailies/controllers/dailiescrudcontroller.js",
                "~/app/permits/services/permitservice.js",
                "~/app/permits/controllers/permitscontroller.js",
                "~/app/permits/services/permitcrudservice.js",
                "~/app/permits/controllers/permitdashoardcontroller.js",
                "~/app/permits/services/permitdashboardservice.js",
                "~/app/permits/controllers/permitcrudcontroller.js",
                 "~/app/tasks/services/tasksmatrixservice.js",
                 "~/app/tasks/controllers/tasksmatrixcontroller.js",
                 "~/app/tasks/services/tasksonholdservice.js",
                 "~/app/tasks/controllers/tasksonholdcontroller.js"

                ));


            BundleTable.EnableOptimizations = false;
            foreach (var bundle in bundles)
            {
                bundle.Transforms.Clear();
            }
        }
    }
}