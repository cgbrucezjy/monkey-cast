import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { EventEmitter } from 'events'
import * as firebase from 'firebase';
import {FireBaseConfig} from './config/config';
import Main from './pages/main'
import VideoPage from './pages/videoPage/videoPage'
import SeriesPage from './pages/series/seriesPage'
import HowTo from './pages/howto/howto'
import MovieService from './service/MovieService'
import update from 'react-addons-update';
import ReactGA from 'react-ga';
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
        document.getElementById('_source').value=data.source
        document.getElementById('_title').value=JSON.stringify(data.title)
        document.getElementById('_description').value=data.description
        document.getElementById('_contentType').value=data.contentType
        document.getElementById('movieTitle').innerHTML=JSON.stringify(data.title)
    })
    MovieService.getSeriesChangedStream(this.eventEmitter).subscribe(data=>{
      console.log(data)
        this.setState({currSeries:data})
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
ReactGA.initialize('UA-101866371-1');
function fireTracking() {
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
}
ReactDOM.render(
  <Router history={browserHistory} onUpdate={fireTracking}>
    <Route path="/" component={App}>
      <IndexRoute component={Main} />
      <Route path="/videoPage/:movieKey" component={VideoPage} />
      <Route path="/seriesPage/:seriesKey" component={SeriesPage} />
      <Route path="/seriesPage/:seriesKey/:movieKey" component={VideoPage} />
      <Route path="/howTo" component={HowTo} />
    </Route>
  </Router>,
  document.getElementById('root')
);
