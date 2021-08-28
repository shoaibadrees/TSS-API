using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPay.DataClasses
{
    [Serializable]
    public abstract class AbstractDataClass
    {
        private String m_ErrorString = "";
        private Exception m_Error;

        public String ErrorString
        {
            get
            {
                return m_ErrorString;
            }
        }

        public Exception GetError()
        {
            return m_Error;
        }

        public void SetError(Exception error)
        {
            m_Error = error;
            m_ErrorString = m_Error.ToString();
        }

    }
}
