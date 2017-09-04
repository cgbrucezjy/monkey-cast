import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { EventEmitter } from 'events'
import * as firebase from 'firebase';
import {FireBaseConfig} from './config/config';
import Main from './pages/main'
import VideoPage from './pages/videoPage/videoPage'
import SeriesPage from './pages/series/seriesPage'
import RequestMovie from './pages/request/requestMovie'
import HowTo from './pages/howto/howto'
import MovieService from './service/MovieService'
import update from 'react-addons-update';
import ReactGA from 'react-ga';
import {extractNumber} from "./utils/util"
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
        currMovie:{},
        currSeries:{},
        movies:[],
        series:[],
        ip:""
    }
  }
  
  componentWillMount() {
    
    this.eventEmitter = new EventEmitter()
    MovieService.getMovieChangedStream(this.eventEmitter).subscribe(data=>{
        console.log('movie changed',data)
        this.setState({currMovie:data})
        var newUrl=""
        if(data.source)
        {
          var unix_timestamp = '2'+data.source.substring(data.source.indexOf('&start=')+8,data.source.indexOf('&custom='))
          newUrl = data.source.substring(0,data.source.indexOf('&start=')+7)+unix_timestamp+data.source.substring(data.source.indexOf('&custom='))
        }
          
        console.log(newUrl,data.title)
        document.getElementById('_source').value=newUrl
        document.getElementById('_title').value=data.title || data.description
        document.getElementById('_description').value=data.description
        document.getElementById('_contentType').value=data.contentType
        document.getElementById('movieTitle').innerHTML=data.title || data.description

    })
    MovieService.getSeriesChangedStream(this.eventEmitter).subscribe(data=>{
      console.log(data)
        this.setState({currSeries:data})
        if(this.state.currMovie && this.state.currSeries.movies)
        {
          console.log(this.state.currSeries.movies)
          var sortedMoviesKeys=Object.keys(this.state.currSeries.movies)
          .sort((a,b)=>parseInt(extractNumber(this.state.currSeries.movies[a].description))-parseInt(extractNumber(this.state.currSeries.movies[b].description)))
          var queueingItems = sortedMoviesKeys.slice(sortedMoviesKeys.indexOf(this.state.currMovie.key))
          console.log(queueingItems)
          queueingItems = queueingItems
          .map(key=>this.state.currSeries.movies[key])
          .map(movies=>{
            var newUrl=""
            if(movies.source)
            {
              var unix_timestamp = '2'+movies.source.substring(movies.source.indexOf('&start=')+8,movies.source.indexOf('&custom='))
              newUrl = movies.source.substring(0,movies.source.indexOf('&start=')+7)+unix_timestamp+movies.source.substring(movies.source.indexOf('&custom='))
            }      
            movies.source=newUrl  
            return movies       
          })
          console.log(queueingItems)
          document.getElementById('_next').innerHTML=JSON.stringify(queueingItems)

        }
    })
    MovieService.getRefreshURLStream(this.eventEmitter).subscribe(data=>{
      console.log("url refresh",data.val())
      this.setState({currMovie:data.val()})
    })
    firebase.database().ref('movies').on('child_added',(snap)=>{
        this.setState({movies:this.state.movies.concat(snap.val())})

    })
    firebase.database().ref('movies').on('child_changed',(snap)=>{
      var newMoviews=this.state.movies.slice(0)
      var index=-1
      this.state.movies.map(s=>s.key)
      .forEach((k,i)=>{
        if(k===snap.key)
        {
          index=i
        }
      });
      newMoviews[index]=update(newMoviews[index],{views:{$set:snap.val().views}})
      this.setState({movies:newMoviews})
    })
    firebase.database().ref('series').on('child_added',(snap)=>{
        var newSeries = snap.val()
        
        newSeries.key=snap.key
        this.setState({series:this.state.series.concat(newSeries)})
    })
    firebase.database().ref('series').on("child_changed", function(snapshot) {
      var index=-1
      var changedPost = snapshot.val();
      console.log(changedPost);
      this.state.series.map(s=>s.key)
      .forEach((k,i)=>{
        if(k===snapshot.key)
        {
          index=i
        }
      });
      var newStateSeries =  this.state.series.slice(0)
      firebase.database().ref('series/'+this.state.currSeries.key+'/movies').once('value',snapChild=>{
          newStateSeries[index]=update(newStateSeries[index],{movies:{$set:snapChild.val()},views:{$set:changedPost.views}})
          this.setState({series:newStateSeries,currSeries:newStateSeries[index]})
        }) 
      }.bind(this));
  }


  render() {
    return (
      <div className="content">
        <div className="app-wrapper">
          
          <div className="main-content">
            {React.cloneElement(this.props.children, {
              eventEmitter: this.eventEmitter,
              currState:{...this.state},
            })}
          </div>
        </div>

      </div>
    )
  }

}
firebase.initializeApp(FireBaseConfig);
const messaging = firebase.messaging();
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM.
  // ...
  return messaging.getToken()
})
.then(token=>{
  console.log(token)
  firebase.database().ref('tokens').update({[token]:true})
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log(refreshedToken,'Token refreshed.');
    
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(message=>{
  console.log(message)
})
ReactGA.initialize('UA-101866371-1');
function fireTracking() {
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
}
ReactDOM.render(
  <Router history={hashHistory} onUpdate={fireTracking}>
    <Route path="/" component={App}>
      <IndexRoute component={Main} />
      <Route path="/videoPage/:movieKey" component={VideoPage} />
      <Route path="/seriesPage/:seriesKey" component={SeriesPage} />
      
      <Route path="/seriesPage/:seriesKey/:movieKey" component={VideoPage} />
      <Route path="/howTo" component={HowTo} />
      <Route path="/request" component={RequestMovie} />
      
    </Route>
  </Router>,
  document.getElementById('root')
);
