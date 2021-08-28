using System.Data;
using System.Data.Common;

namespace EPay.DataAccess
{
    public class DBCommandWarpper
    {
        private DbCommand _dbCommand;
        private DBConnection _dbConnection;
        
        public DbCommand DBCommand
        {
            get
            {
                return _dbCommand;
            }
        }
        public DBCommandWarpper(DbCommand dbCommand, DBConnection dbConnection)
        {
            _dbCommand = dbCommand;
            _dbConnection = dbConnection;
        }
        public void AddInParameter(string ParameterName, DbType ParameterType, object ParameterValue)
        {
            _dbConnection.dataBase.AddInParameter(_dbCommand, ParameterName, ParameterType, ParameterValue);
        }
        public void AddOutParameter(string ParameterName, DbType ParameterType, int Size)
        {
            _dbConnection.dataBase.AddOutParameter(_dbCommand, ParameterName, ParameterType, Size);
        }
    }
}
