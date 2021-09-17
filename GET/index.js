const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();


var tableName = "RationCardHolders";


exports.handler = (event, context, callback) => {
    console.log(event.RationNumber)
    
    var params = {
        TableName :tableName,
        
        Key:{
            "RationNumber" :event.RationNumber
        }
    }
    
    docClient.get(params, function(err, data){
        callback(err, data);
    })
}