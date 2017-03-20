process.env["AZURE_STORAGE_ACCOUNT"] = "@@@";
process.env["AZURE_STORAGE_ACCESS_KEY"] = "@@@";
process.env["AZURE_STORAGE_CONNECTION_STRING "] = "@@@"; 
 

module.exports = function (context, mySbMsg) {
     context.log('Message:', mySbMsg);
    var azure = require('azure-storage');
    var tableSvc = azure.createTableService();
    tableSvc.createTableIfNotExists('systemstatus', function(error, result, response){
        if(!error){
                var motiondetectoron = "false";
                if(mySbMsg.avgdistance < 10)
                {
                    motiondetectoron = "true";
                }
                var entityToUpdate = new Object();
                entityToUpdate.PartitionKey= "system";
                entityToUpdate.RowKey = "motiondetectoron";
                entityToUpdate.Status = motiondetectoron;

                tableSvc.insertOrReplaceEntity ('systemstatus', entityToUpdate, function(error, result, response){
                    if(!error) {
                        context.log('motiondetectoron: ', mySbMsg.avgdistance);
                    }
                });
                               
            };
    });
   
    context.done();
};
