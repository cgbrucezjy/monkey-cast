var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");
var randomip = require('random-ip');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://monkey-cast.firebaseio.com"
});


var seriesRef=admin.database().ref('/series');
var movieRef=admin.database().ref('/movies');

movieRef.once('value',(data)=>{
    data.forEach(snap=>{
        var s = snap.val().source
        if(!s.includes('?'))
        {
            
            s=s+"?sourceIp=SOURCEIP&signature=033d18b0972a43ccbde83f6628936360.5e5fb49910fb6596e2c3bbafd0b33f3f&start=1498946461.00838&custom=0"
            console.log(s)
            movieRef.child(snap.key).update({"source":s})
            stop
        }
    })
})