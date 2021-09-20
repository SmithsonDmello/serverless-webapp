var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    console.log(event);
    
    var tableName = "RationCardHolders";
    
    var params = {
        TableName : tableName,
        Item : {
            "RationNumber" : event.RationNumber,
            "FirstName" : event.FirstName,
            "LastName" :  event.LastName,
            "AadharNumber" : event.AadharNumber,
            "MobileNumber" : event.MobileNumber,
            "EmailId" :  event.EmailId
        }
    };
    
    docClient.put(params, function(err, data){
            if(err){
                callback(err)
            }
            else{
                callback(null, "Successfully inserted data")
            }            
        });
    
    console.log("success ");

    if (!event.EmailId.match(/^[^@]+@[^@]+$/)) {
        console.log('Not sending: invalid email address', event);
        context.done(null, "Failed");
        return;
    }
    
    console.log("email right");

    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <p>Hi ${event.FirstName},</p><br>
        <p>Your Ration Data is saved successfully as below:<br>
    
    Ration Number : ${event.RationNumber},<br>
    First Name : ${event.FirstName},<br>
    Last Name : ${event.LastName},<br>
    Aadhar Number : ${event.AadharNumber},<br>
    Mobile Number : ${event.MobileNumber},<br>
    Email Id : ${event.EmailId}</p>
      </body>
    </html>
  `;
  const textBody = `
    Hi ${event.FirstName},
    
    Your data is saved successfully as below:
    
    Ration Number : ${event.RationNumber}
    First Name : ${event.FirstName},
    Last Name : ${event.LastName},
    Aadhar Number : ${event.AadharNumber},
    Mobile Number : ${event.MobileNumber},
    Email Id : ${event.EmailId},
    
  `;
  // Create sendEmail params
  const paramsEmail = {
    Destination: {
      ToAddresses: [event.EmailId]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your data is saved successfully in Government FCSD Records!"
      }
    },
    Source: "dmello.smithson03@gmail.com"
  };
console.log("Now sending mail");
  
  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01", region: "ap-south-1" })
    .sendEmail(paramsEmail)
    .promise();
  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(data => {
      console.log(data.MessageId);
      context.done(null, "Successfully sent the Email");
      console.log("sent mail");
    })
    .catch(err => {
      console.error(err, err.stack);
      context.done(null, "Failed sending email");
      console.log("failed mail");
    });
    
};