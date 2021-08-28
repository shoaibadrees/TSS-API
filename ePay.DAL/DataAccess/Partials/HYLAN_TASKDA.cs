using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using EPay.DataAccess;
using System.Configuration;
using EPay.Common;

namespace EPay.DataAccess
{
    public static class HylanTaskDAFactory
    {
        public static HYLAN_TASKDA Create(int TASK_TITLE_ID)
        {
            HYLAN_TASKDA HYLAN_TASKDA = null;
            switch (TASK_TITLE_ID)
            {
                case Constants.HylanTasksType.CONTINUITY_ZERO: HYLAN_TASKDA = new TASK_CONTINUITY_ZERODA(); break;
                case Constants.HylanTasksType.FOUNDATION_WORK: HYLAN_TASKDA = new TASK_FOUNDATION_POLE_WORKDA(); break;
                case Constants.HylanTasksType.POLE_WORK: HYLAN_TASKDA = new TASK_FOUNDATION_POLE_WORKDA(); break;
                case Constants.HylanTasksType.FIBER_DIG: HYLAN_TASKDA = new TASK_FIBER_POWER_DIGDA(); break;
                case Constants.HylanTasksType.POWER_DIG: HYLAN_TASKDA = new TASK_FIBER_POWER_DIGDA(); break;
                case Constants.HylanTasksType.UG_MISC: HYLAN_TASKDA = new TASK_MISC_AC_POWERDA(); break;
                case Constants.HylanTasksType.FIBER_PULL: HYLAN_TASKDA = new TASK_FIBER_PULL_SPLICEDA(); break;
                case Constants.HylanTasksType.FIBER_SPLICE: HYLAN_TASKDA = new TASK_FIBER_PULL_SPLICEDA(); break;
                case Constants.HylanTasksType.AC_POWER_POLE: HYLAN_TASKDA = new TASK_MISC_AC_POWERDA(); break;
                case Constants.HylanTasksType.SHROUD_ANTENA: HYLAN_TASKDA = new TASK_SHROUD_ANTENADA(); break;
                case Constants.HylanTasksType.PIM_SWEEP: HYLAN_TASKDA = new TASK_PIM_SWEEPDA(); break;
                default: throw new Exception("UKNOWN TASK"); 
            }

            return HYLAN_TASKDA;
        }
    }
    public abstract class HYLAN_TASKDA
    {
        public abstract List<HYLAN_TASKDC> LoadAll(DBConnection Connection, int TASK_TITLE_ID);
        public abstract HYLAN_TASKDC LoadByPrimaryKey(DBConnection Connection, int TASK_TITLE_ID, int TASK_ID);
        public abstract int Update(DBConnection Connection, List<HYLAN_TASKDC> hylanTaskDCList);
        public abstract int Insert(DBConnection Connection, List<HYLAN_TASKDC> hylanTaskDCList);
        public abstract int Delete(DBConnection Connection, List<HYLAN_TASKDC> hylanTaskDCList);

        
    }
}
