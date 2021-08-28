using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPay.DataClasses;
using System.Data;


namespace EPay.DataAccess
{
   public partial class NOTEDA
    {
        public List<NOTEDC> LoadByPrimaryKey(DBConnection Connection, int SCREEN_ID, int SCREEN_RECORD_ID)
        {
            List<NOTEDC> objNOTE = new List<NOTEDC>();
            StringBuilder sql = new StringBuilder();
            switch (SCREEN_ID)
            {
                case 2:
                    sql.Append("proc_PROJECTNOTESLoadByPrimaryKey");
                    break;
                case 3:
                    sql.Append("proc_JOBNOTESLoadByPrimaryKey");
                    break;
                case 4:
                    sql.Append("proc_TASKNOTESLoadByPrimaryKey");
                    break;
                case 5:
                    sql.Append("proc_PERMITNOTESLoadByPrimaryKey");
                    break;
                case 6:
                    sql.Append("proc_DIALIASNOTESLoadByPrimaryKey");
                    break;
                case 7:
                    sql.Append("proc_EXECUTIVEDASHBOARDNOTESLoadByPrimaryKey");
                    break;
                case 8:
                    sql.Append("proc_JOBMAPNOTESLoadByPrimaryKey");
                    break;
                default:
                    break;


            }
            

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);

            dbCommandWrapper.AddInParameter("p_SCREEN_ID", DbType.Int32, SCREEN_ID);
            dbCommandWrapper.AddInParameter("p_SCREEN_RECORD_ID", DbType.Int32, SCREEN_RECORD_ID);


            DataSet ds = new DataSet();

            if (Connection.Transaction != null)
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                ds = Connection.dataBase.ExecuteDataSet(dbCommandWrapper.DBCommand);

            foreach (DataRow drRow in ds.Tables[0].Rows)
            {
                objNOTE.Add(FillObject(drRow));
            }

            return objNOTE;
        }
        private int Insert(DBConnection Connection, NOTEDC objNOTE)
        {
            int insertCount = 0;

            StringBuilder sql = new StringBuilder();
            sql.Append("proc_NOTESInsert");

            DBCommandWarpper dbCommandWrapper = new DBCommandWarpper(Connection.dataBase.GetStoredProcCommand(sql.ToString()), Connection);


            dbCommandWrapper.AddInParameter("p_NOTE_ID", DbType.Int32, objNOTE.NOTE_ID);
            dbCommandWrapper.AddInParameter("p_NOTES", DbType.String, objNOTE.NOTES);
            dbCommandWrapper.AddInParameter("p_NOTES_TYPE", DbType.String, objNOTE.NOTES_TYPE);
            dbCommandWrapper.AddInParameter("p_LOCK_COUNTER", DbType.Int32, objNOTE.LOCK_COUNTER);
            dbCommandWrapper.AddInParameter("p_SCREEN_ID", DbType.Int32, objNOTE.SCREEN_ID);
            dbCommandWrapper.AddInParameter("p_CREATED_BY", DbType.Int32, objNOTE.CREATED_BY);
            dbCommandWrapper.AddInParameter("p_CREATED_ON", DbType.DateTime, objNOTE.CREATED_ON);
            dbCommandWrapper.AddInParameter("p_MODIFIED_BY", DbType.Int32, objNOTE.MODIFIED_BY);
            dbCommandWrapper.AddInParameter("p_MODIFIED_ON", DbType.DateTime, objNOTE.MODIFIED_ON);
            dbCommandWrapper.AddInParameter("p_SCREEN_RECORD_ID", DbType.Int32, objNOTE.SCREEN_RECORD_ID);

            if (Connection.Transaction != null)
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand, Connection.Transaction);
            else
                insertCount = Connection.dataBase.ExecuteNonQuery(dbCommandWrapper.DBCommand);

            return insertCount;
        }

    }
}
