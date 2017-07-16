import Rx from "rxjs/Rx";
import 'whatwg-fetch';
import * as firebase from 'firebase';
import update from 'react-addons-update';
import ReactGA from 'react-ga';
class MovieService {
  getOption(){
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  }
  getRefreshURLStream(eventEmitter)
  {
    return Rx.Observable.fromEvent(eventEmitter,'refresh')
    .do(data=>{
      console.log(data.url)
      firebase.database().ref(data.url).transaction(s=>{
        console.log(s)
        var unix_timestamp = '3'+s.source.substring(s.source.indexOf('&start=')+8,s.source.indexOf('&custom='))
        
        var newUrl = s.source.substring(0,s.source.indexOf('&start=')+7)+unix_timestamp+s.source.substring(s.source.indexOf('&custom='))
        s.source = newUrl
        return s
      })
    })
    .flatMap(data=>{
      return Rx.Observable.fromPromise(firebase.database().ref(data.url).once('value'))
    })
  }
  getMovieChangedStream(eventEmitter)
  {
    var movieChanged$ = Rx.Observable.fromEvent(eventEmitter, 'movieChanged')
    .flatMap(key=>{
      console.log(key.path)
      return Rx.Observable.fromPromise(firebase.database().ref(key.path).once('value'))
    })
    //.do(snap=>console.log(snap.val()))
    .map(snap=>snap.val())
    .do(snap=>firebase.database().ref('movies/'+snap.key).transaction(s=>{
      
      console.log(s)

      if(s)
      {
        ReactGA.event({
            category: 'Movie',
            action: 'Movie watched',
            label: s.title
        });
        if(s.views)
        {
          
          s.views++
          return s;
        }
        else
        {
          s.views=1;
          return s;
        }
      }
      return s
    }))
    .startWith({});
    return movieChanged$
  }
  getSeriesChangedStream(eventEmitter)
  {
    var seriesChanged$ = Rx.Observable.fromEvent(eventEmitter, 'seriesChanged')
    .do(key=>firebase.database().ref('series/'+key.seriesKey).once('value').then(n=>console.log(n.val())))
    .flatMap(key=>{
      return Rx.Observable.fromPromise(firebase.database().ref('series/'+key.seriesKey).once('value'))
    })
    //.do(snap=>console.log(snap.val()))
    .map(snap=>snap.val())
    .do(snap=>firebase.database().ref('series/'+snap.key).transaction(s=>{
      
      console.log(s)
      if(s)
      {
        ReactGA.event({
            category: 'Series',
            action: 'Series watched',
            label: s.seriesName
        });
        if(s.views)
        {
          
          s.views++
          return s;
        }
        else
        {
          s.views=1;
          return s;
        }
      }

    }))
    .startWith({});
    return seriesChanged$
  }
  getImage(url)
  {
    let options=this.getOption();
    return fetch(url,options)
  }

  getIP()
  {
    console.log("getting ip")
    let options=this.getOption();
    //options.headers["Content-Type"]="text/plain; charset=UTF-8"
    return fetch("https://api.ipify.org?format=json",options).then(res=>res.json())
  }
}

export default new MovieService()
