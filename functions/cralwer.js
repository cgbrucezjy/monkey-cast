var Crawler = require("simplecrawler");
var admin = require("firebase-admin");
var fs = require("fs")
var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://monkey-cast.firebaseio.com"
});
var duonaoURL = 'https://www.dnvod.tv'
var cheerio = require("cheerio")
var crawler = new Crawler("https://www.dnvod.tv/Movie/play.aspx?id=FGtifyAF5HI%3d");

var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var cookies=JSON.parse(fs.readFileSync("./cookies.json"))
//console.log(cookies)
var moviesRef=admin.database().ref('/test');
    var postKey=moviesRef.push().key
    var updates = {}
var result=[]
var imgURL = ""
var searchURL = "https://www.dnvod.tv/Movie/detail.aspx?id=eSMBkJyyrx0%3d"
var title=""
nightmare
  .goto(searchURL)
  .evaluate(()=>{
      return document.querySelector('.p-r ul h1').innerHTML
  })
  .then(t=>{
      title=t
      nightmare
        .goto("https://www.google.com/imghp")
        .type('form[action="https://www.google.com/search"]',t)
        .click('button#_fZl.sbico-c')
        .wait('.rg_di .rg_meta')
        .evaluate(function () {
            var links = document.querySelectorAll('.rg_di .rg_meta');
            const asString = links[0].innerHTML
            const asObject = JSON.parse(asString)
            return asObject.tu
        })
        .then(img=>{
            console.log(img)
            nightmare
            .goto(duonaoURL)
            .cookies.set(cookies)
            .goto(searchURL)
            .then(function() {
                nightmare
                .goto('https://www.dnvod.tv/Movie/detail.aspx?id=eSMBkJyyrx0%3d')
                .evaluate(function () {
                     var update={}

                    var tags = []
                    document.querySelectorAll('.p-r ul li a').forEach((e)=>{
                        tags.push(e.innerHTML)
                    })
                    update.seriesName=document.title.replace(' - 多瑙影院','')
                    update.tags=tags.toString()
                    
                    var links = document.querySelectorAll('li .bfan-v a');
                    update.links = Array.prototype.map.call(links, function(e) {
                        return e.getAttribute('href');
                    });
                    return update
                })
                .then(function(update) {
                    update.imgURL=img
                    console.log(update)
                    update.links.forEach(function(l) {
                        nightmare
                        .goto(duonaoURL+l)
                        .wait('video')
                        .wait(200)
                        .evaluate(function () {
                           return document.querySelector('video').src
                        })
                        .then(src=>{
                            
                            console.log(src)
                        })
                        
                    });
                })
            })
        })
  })


//   .wait('video')
//   .evaluate(function () {
//     return document.querySelector('video').src
//   })
//   .end()
//   .then(function(link) {
//     console.log(link)
//     done();
//   })


// crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
//     // console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
//     console.log("It was a resource of type %s", response.headers['content-type']);
//         var $ = cheerio.load(responseBuffer.toString("utf8"));


// });
// crawler.on("discoverycomplete", function(queueItem, responseBuffer, response) {
//     //console.log("discoverycomplete", queueItem);
//     var $ = cheerio.load(responseBuffer.toString("utf8"));
//     console.log($.html());
// });

// crawler.discoverResources = function(buffer, queueItem) {
//     var $ = cheerio.load(buffer.toString("utf8"));
//  console.log($.html());
//     return $("video[src]").map(function () {
//         return $(this).attr("src");
//     }).get();
// };

// crawler.start();