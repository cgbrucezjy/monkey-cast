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
    var postKey=moviesRef.push().key
    update.key=postKey
    var updates = {}
    
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
                    moviesRef.update(updates)
                })
            }

        });
    })

   
});
