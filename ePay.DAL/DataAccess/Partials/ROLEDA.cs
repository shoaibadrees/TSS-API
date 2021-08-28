using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.Common;
using System.Data;

namespace EPay.DataAccess
{
    public partial class ROLEDA
    {
        public ROLEDC LoadRoleDetails(DBConnection Connection, int ROLE_ID)
        {
            ROLEDC objROLE = new ROLEDC();
            StringBuilder sql = new StringBuilder();
            sql.Append("proc_ROLESLoadRoleDetails");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);
            dbCommandWrapper.AddInParameter("p_ROLE_ID", DbType.Int32, ROLE_ID);

            DataSet dsRoleDetails;

            if (Connection.Transaction != null)
                dsRoleDetails = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                dsRoleDetails = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            if (dsRoleDetails.Tables[0].Rows.Count > 0)
            {
                objROLE = FillObject(dsRoleDetails.Tables[0].Rows[0]);

                if (dsRoleDetails.Tables[1].Rows.Count > 0)
                {
                    ROLES_PERMISSIONDA rolesPermissionsDA = new ROLES_PERMISSIONDA();
                    foreach(DataRow dr in dsRoleDetails.Tables[1].Rows)
                    {
                        ROLES_PERMISSIONDC objRolePermission =  rolesPermissionsDA.FillObject(dr);
                        objROLE.PERMISSIONS.Add(objRolePermission);
                    }
                }
            }            

            return objROLE;
        }
    }
}