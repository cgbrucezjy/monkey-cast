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
    var seriesRef=admin.database().ref('/series');
    var postKey=seriesRef.push().key
    update.key=postKey
    var updates = {}
    updates[postKey] = update;
    seriesRef.update(updates).then((ref)=>{
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
                        console.log(u.description)
                        var postKey=seriesRef.child(update.key+'/movies').push().key
                        u.key=postKey
                        var um = {}
                        um[postKey] = u;
                        seriesRef.child(update.key+'/movies').update(um);
                    })
                }

            });
        })
    })
   
});

