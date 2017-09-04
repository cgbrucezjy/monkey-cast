var admin = require("firebase-admin");
var fs = require("fs")
var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://monkey-cast.firebaseio.com"
});

fs.readFile('series.json', function (err, data) {
   if (err) {
      return console.error(err);
   }
    var update=JSON.parse(data)
    update.title=update.seriesName
    update.views=0
    delete update.seriesName
    var moviesRef=admin.database().ref('/movies');
    var tokensRef = admin.database().ref('/tokens');
    var postKey=moviesRef.push().key
    update.key=postKey
    var updates = {}
    var tokens=[]
    tokensRef.once('value',(snap)=>{
        
        snap.forEach(child=>{
            console.log(child.key)
            tokens.push(child.key)
        })
    })
    fs.readdir('./movies', (err, files) => {
        files.forEach(file => {
            console.log("reading file ",file)
            if(file=='.DS_Store')
            {

            }
            else
            {
                fs.readFile('./movies/'+file,"utf8",(err,da)=>{
                    
                    var u=JSON.parse(da)
                    update=Object.assign({}, update,u);
                    console.log(update)
                    updates[postKey] = update;
                    moviesRef.update(updates).then(data=>{
                        // This registration token comes from the client FCM SDKs.

                        
                        // See the "Defining the message payload" section below for details
                        // on how to define a message payload.
                        var payload = {
                            
                            "notification": {
                                    "click_action": "https://monkeecast.com",
                                    "title":"New Movie Uploaded",
                                    "body":update.title,
                                    icon:"monkey.png",
                                    "imageUrl": update.imgURL
                                },
                            "data": {
                                
                                "imageUrl": update.imgURL
                            }
                        };

                        // Send a message to the device corresponding to the provided
                        // registration token.
                        setTimeout(()=>{
                            var registrationToken = tokens;
                            console.log("=====",registrationToken)
                            admin.messaging().sendToDevice(registrationToken, payload)
                            .then(function(response) {
                                // See the MessagingDevicesResponse reference documentation for
                                // the contents of response.
                                console.log("Successfully sent message:", response);
                            })
                            .catch(function(error) {
                                console.log("Error sending message:", error);
                            });
                        },2000)

                    })
                })
            }

        });
    })

   
});
