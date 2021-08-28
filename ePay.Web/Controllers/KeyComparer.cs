using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Hylan.Web.Controllers
{
    public class KeyComparer : IEqualityComparer<KeyValuePair<string, string>>
    {

        public bool Equals(KeyValuePair<string, string> x, KeyValuePair<string, string> y)
        {
            return x.Key.Equals(y.Key);
        }

        public int GetHashCode(KeyValuePair<string, string> obj)
        {
            return obj.Key.GetHashCode();
        }
    }
}
