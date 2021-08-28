using EPay.DataClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DAL.DataClasses
{
    public class DailyDTO
    {
        public DAILYDC DAILYDC { get; set; }
        public List<MAN_POWERDC> listMAN_POWERDC { get; set; }
        public List<VEHICLEDC> listVEHICLEDC { get; set; }
        public List<MATERIALDC> listMATERIALDC { get; set; }
        public List<LABORDC> listLABORDC { get; set; }
        public List<WORK_DETAILDC> listWORK_DETAILDC { get; set; }

        public List<MATERIALDC> listLaborItemDC { get; set; }
        public List<MATERIALDC> listAerialDC { get; set; }
        public List<MATERIALDC> listMDUDC { get; set; }

        public bool Repeat { get; set; }
        public int LU_ID_LABOR { get; set; }
        public int LU_ID_AERIAL { get; set; }
        public int LU_ID_MDU { get; set; }
    }
}
