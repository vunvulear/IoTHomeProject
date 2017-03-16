using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vunvulea_iot_core;

namespace webapp_iot_dashboard.Controllers
{
    [Produces("application/json")]
    [Route("api/SystemStatus")]
    public class SystemStatusController : Controller
    {
        [HttpGet("{id}", Name = "Get")]
        public async Task<string> GetAsync(string id)
        {
            SystemStatus systemStatus = new SystemStatus();
            SystemStatusType systemStatysType = (SystemStatusType)Enum.Parse(typeof(SystemStatusType), id);
            string statusValue = await systemStatus.GetCurrentSystemStatusAsync(systemStatysType);

            return statusValue;
        }
    }
}
