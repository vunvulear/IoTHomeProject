using Microsoft.WindowsAzure.Storage.Table;

namespace vunvulea_iot_core
{
    public class SystemStatusEntity : TableEntity
    {
        public const string PartitionKeyValue = "system"; 

        public SystemStatusEntity(string name)
        {
            PartitionKey = PartitionKeyValue;
            RowKey = name;
            Name = name;
        }

        public SystemStatusEntity() { }

        public string Name { get; set; }

        public string Status { get; set; }
    }
}
