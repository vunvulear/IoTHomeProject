process.env["AZURE_STORAGE_ACCOUNT"] = "vunvuleariotstorage";
process.env["AZURE_STORAGE_ACCESS_KEY"] = "@@@";
process.env["AZURE_STORAGE_CONNECTION_STRING "] = "@@@";


module.exports = function (context, myQueueItem) {
    var azure = require('azure-storage');
    var tableSvc = azure.createTableService();
    tableSvc.createTableIfNotExists('systemstatus', function (error, result, response) {
        if (!error) {
            var entityToUpdate = new Object();
            entityToUpdate.PartitionKey = "system";
            entityToUpdate.RowKey = "currenttemperature";
            entityToUpdate.Status = myQueueItem.avgtemp;

            tableSvc.insertOrReplaceEntity('systemstatus', entityToUpdate, function (error, result, response) {
                if (!error) {
                    context.log('Avg. temp: ', myQueueItem.avgtemp);
                }
            });
        };
    });

    context.done();
};
