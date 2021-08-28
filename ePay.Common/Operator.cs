using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EMS.Common
{
    [Serializable]
    public class Operator
    {
        public string Caption { get; set; }
        public string Symbol { get; set; }
        public Operator(string caption, string symbol)
        {
            Caption = caption;
            Symbol = symbol;
        }
    }
    public class Operators
    {
        private Operator equals = new Operator("Equals", "EQUAL");
        private Operator like = new Operator("Contains", "LIKE");
        private Operator startsWith = new Operator("Starts With", "sLIKE");
        private Operator endsWith = new Operator("Ends With", "LIKEs");
        private Operator lessThan = new Operator("Is Less than", "LT");
        private Operator lessThanOrEqual = new Operator("Is Less than or equal", "LTE");
        private Operator greaterThan = new Operator("Is Greater than", "GT");
        private Operator greaterThanOrEqual = new Operator("Is Greater than or equal", "GTE");

        public List<Operator> TextOperators
        {
            get {
                List<Operator> operators = new List<Operator>();
                operators.Add(equals);
                operators.Add(startsWith);
                operators.Add(endsWith);
                operators.Add(like);
                return operators;
            }
        }
        public List<Operator> NumberOperators
        {
            get
            {
                List<Operator> operators = new List<Operator>();
                operators.Add(equals);
                operators.Add(lessThan);
                operators.Add(lessThanOrEqual);
                operators.Add(greaterThan);
                operators.Add(greaterThanOrEqual);
                return operators;
            }
        }
        public List<Operator> DateTimeOperators
        {
            get
            {
                List<Operator> operators = new List<Operator>();
                operators.Add(equals);
                operators.Add(lessThan);
                operators.Add(lessThanOrEqual);
                operators.Add(greaterThan);
                operators.Add(greaterThanOrEqual);
                return operators;
            }
        }
        public List<Operator> GetOperatorList(string dbType, out string WorkingType)
        {
            WorkingType = "";
            dbType = dbType.ToLower();
            Operators opList = new Operators();
            if (dbType.Contains("text")
                || dbType.Contains("varchar")
                || dbType.Contains("char")
                || dbType.ToLower().Contains("string")
                )
            {
                WorkingType = "text";
                return opList.TextOperators;
            }
            if (dbType.Contains("int")
                || dbType.Contains("money")
                || dbType.Contains("numeric")
                || dbType.Contains("number")
                || dbType.Contains("decimal"))
            {
                WorkingType = "number";
                return opList.NumberOperators;
            }
            if (dbType.Contains("date"))
            {
                WorkingType = "date";
                return opList.DateTimeOperators;
            }
            return null;
        }        
    }
}
