using System.Data;
using System.Data.Common;
using Microsoft.Practices.EnterpriseLibrary.Data;
using EPay.Common;

namespace EPay.DataAccess
{    
	public class DBConnection
	{
		private DbConnection _Connection;
		private DbTransaction _Transaction;
		private Database _Database;

        public DbConnection Connection
		{			
			get 
				{
					return _Connection;
				}
		}
        public DbTransaction Transaction
		{
			get 
			{
				return _Transaction;
			}
		}
		public Database dataBase
		{
			get 
			{
				return _Database;
			}
		}

		public DBConnection()
		{
            //if (System.Web.HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"].Contains("192.168.10.22"))
            //{
            //    _Database = DatabaseFactory.CreateDatabase("nMartdb_backup");
            //}
            //else {
            //    _Database = DatabaseFactory.CreateDatabase();
            //}
            _Database = DatabaseFactory.CreateDatabase();
		}

        //Should only be used when connection to remote database
        //other than EMS database
        public DBConnection(string connectionString, Constants.ServerType serverType)
        {
            if (serverType == Constants.ServerType.SQLServer)
                _Database = new Microsoft.Practices.EnterpriseLibrary.Data.Sql.SqlDatabase(connectionString);
            else if (serverType == Constants.ServerType.Oracle)
                _Database = new Microsoft.Practices.EnterpriseLibrary.Data.Oracle.OracleDatabase(connectionString);
            _Connection = _Database.CreateConnection();
            if (_Connection.State == ConnectionState.Closed)
                _Connection.Open();
        }

		public void Open (bool openTransaction)
		{
			if (openTransaction)
			{
				_Connection = _Database.CreateConnection();
				if (_Connection.State == ConnectionState.Closed)
					_Connection.Open();
				_Transaction = _Connection.BeginTransaction();
			}
			else
			{
				_Connection = _Database.CreateConnection();
				_Transaction = null;
			}
            ////Only Run When Connection Info is Not Set
            //if (Utilities.isConnectionInfoSet == false)
            //{
            //    if (_Connection.GetType().ToString().ToLower().IndexOf("oracle") > -1)
            //    {
            //        Utilities.isOracle = true;
            //        Utilities.token = ":";
            //    }
            //    else
            //    {
            //        Utilities.isOracle = false;
            //        Utilities.token = "@";
            //    }
            //    Utilities.isConnectionInfoSet = true;
            //}
		}

		public void Commit ()
		{
			if (_Transaction != null)
				_Transaction.Commit();
		}

		public void Rollback ()
		{
			if (_Transaction != null)
				_Transaction.Rollback();
		}
		public void Close ()
		{
			if (_Connection != null)
				_Connection.Close();
		}

        public DataTable GetSchema(string collectionName)
        {
            return _Connection.GetSchema(collectionName);
        }
        public DataTable GetSchema(string collectionName, string[] restrictionValues)
        {
            return _Connection.GetSchema(collectionName, restrictionValues);
        }
	}
}
