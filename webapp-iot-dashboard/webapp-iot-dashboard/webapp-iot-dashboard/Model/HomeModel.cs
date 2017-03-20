using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace webapp_iot_dashboard.Model
{
    public class HomeModel
    {
        public string MinimumTemperature { get; set; }
        public string CurrentTemperature { get; set; }

        public bool IsHeatingSystemRunning => Convert.ToDecimal(MinimumTemperature) <= Convert.ToDecimal(CurrentTemperature);

        public bool AlarmStatus { get; set; }
    }
}
