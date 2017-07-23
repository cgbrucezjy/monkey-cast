//var functions = require('firebase-functions');
var fs = require('fs');
//
var system = require('system')
var searchURL = "https://www.dnvod.tv/Movie/detail.aspx?id=dGviywhPVQI%3d"
//system.args[system.args.length-1]

console.log(searchURL)
var duonaoURL = 'https://www.dnvod.tv'
var skip =0

var search="bruce"
var update={}
var episodesArray = []
var casper = require('casper').create();

var webpage = require('webpage').create();
webpage.captureContent = [ /js/]
webpage.viewportSize = { width: 1480, height: 1800 };

Array.prototype.forEach.call(JSON.parse(fs.read("./cookies.json")), function(x){
        phantom.addCookie(x);
    });
function episodes() {
    var links = document.querySelectorAll('li .bfan-v a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start(searchURL, function() {
    var title=casper.evaluate(function(f){  
      return document.querySelector('.p-r ul h1').innerHTML
    });
    search=title
    console.log(search)
}).viewport(1600,1000);

casper.thenOpen("https://www.google.com/imghp",function(){
   console.log("Wait for the page to be loaded")
   this.waitForSelector('form[action="https://www.google.com/search"]');
})

casper.then(function() {
   console.log("search for "+search+" from google form")
   this.fill('form[action="https://www.google.com/search"]', { q: search+" 电影" }, true);
});

casper.then(function() {
   console.log("wait for image to load")
   this.waitForSelector('img');
});
casper.then(function() {
    console.log("aggregate results for the  "+search+" search")
    update.imgURL = this.evaluate(getLink);
    console.log(links)
});

casper.thenOpen(searchURL,function() {
  this.waitForSelector('.p-r ul li a');
});
casper.then(function() {
    console.log('success')
    
    var tagsEl = casper.evaluate(function(){  
      var tags = []
      document.querySelectorAll('.p-r ul li a').forEach((e)=>{
        tags.push(e.innerHTML)
      })
      return tags
    });

    episodesArray=casper.evaluate(episodes);
    console.log(episodesArray[0])
    update.seriesName=search
    update.tags=tagsEl.toString()
    update.url=searchURL
    console.log(JSON.stringify(update))
    fs.write('series.json', JSON.stringify(update), 'w');
    if(skip==0)
      deleteFolderRecursive('./movies')
    fs.write('links.json',JSON.stringify(episodesArray), 'w')
    webpage.open(duonaoURL,()=>{
            if(skip>0)
            {
              next_page(duonaoURL+episodesArray[skip],skip)
            }
            else
            {
              next_page(duonaoURL+episodesArray[0],0)
            }
    })

    this.wait(600000)
});

casper.run();



webpage.onResourceReceived = function(res) {
      if(res.url.includes("GetResource"))
      {
        if(res.body)
        {
          var duonao=JSON.parse(res.body);
          var url=duonao.http.provider
          var contentType=duonao.http.resourcetype;
          var episode = url.split('-')[url.split('-').length-1].substring(0,url.split('-')[url.split('-').length-1].indexOf('.'))
          //var episode = url.split('-')[url.split('-').length-1].substring(0,url.split('-')[url.split('-').length-1].indexOf('.'))
          console.log(episode)
          //episode = url.split('-')[url.split('-').length-2]
          var numberPattern = /\d+/;
          if(episode.match( numberPattern ))
          {

          }
          else
          {
            
            var episode = url.split('-')[url.split('-').length-3]
            
          }
          var m={
            contentType,
            source:url,
            description:"Episode : "+episode
          }
          console.log('epeisode',episode)
          fs.write('movies/ep_'+episode+'.json',JSON.stringify(m), 'w');
          console.log('Response  ',JSON.stringify(url));
        }
      }
  };
  function next_page(url,index){
      console.log("next page",url);
      if(url)
      {
        handle_page(url,index);
      }
      else
      {
        console.log('done')
          slimer.exit();
          casper.exit();
      }
  }
  function handle_page(url,index){
    console.log("page opened",url,index);
    webpage.open(url, function(status){
        

        var input=webpage.evaluate(function(){  
          return document.querySelectorAll('li .bfan-v a')
        });
        if(index>=input.length){
          
        }
        else
        {
          //console.log(input[index])
          slimer.wait(500)
          next_page(input[index+1],index+1);
        }

        
        
    });
  }

  function getLink() {
    console.log("getlink")
    var links = document.querySelectorAll('img');
    console.log(links[0].getAttribute('src'))
    return links[0].getAttribute('src')
}

function deleteFolderRecursive(path) {
  console.log("delete folder")
  if( fs.exists(path) ) {
    console.log('exist folder')
    fs.list(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      console.log("delete path",curPath)
      fs.remove(curPath);

    });

  }
};