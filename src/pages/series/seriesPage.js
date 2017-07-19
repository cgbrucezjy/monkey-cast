import React, { Component } from 'react'
import { confirmComplex ,addSeries} from '../../utils/confirm';
import {Button } from 'react-bootstrap'
import * as firebase from 'firebase';
import MovieCard from '../../component/movieCard'
import { Link } from 'react-router'
import {extractNumber} from '../../utils/util'
class Main extends Component {

  constructor(props) {
    super(props)

  }

  componentWillMount() {
    console.log(this.props.params.seriesKey)

    this.props.eventEmitter.emit("seriesChanged", {seriesKey:this.props.params.seriesKey})
  }
  watchMovie(m){
      this.props.history.push({
            pathname: '/seriesPage/'+this.props.currState.currSeries.key+'/'+m.key
          })
  }

  addDuonaoMovie()
  {
    confirmComplex({ message: 'Please paste it into the input field' }).then(({ title,source,contentType,description }) => {
      console.log(title,source,contentType,description);
      var newMovie=  {
            source,
            title,
            contentType,
            description
        }  
      var newRef=firebase.database().ref('series/'+this.props.currState.currSeries.key+"/movies").push() 
      newMovie.key=newRef.key
      newRef.set(newMovie)
    }, () => {
      console.log('cancel!');
    });
  }

  renderMovie()
  {
      return (
            Object.keys(this.props.currState.currSeries.movies)
            .sort((a,b)=>parseInt(extractNumber(this.props.currState.currSeries.movies[a].description))-parseInt(extractNumber(this.props.currState.currSeries.movies[b].description)))
            .map((key,i)=>{
                var m=this.props.currState.currSeries.movies[key]
                return (
                    <MovieCard key={i} movie={m} watchMovie={this.watchMovie.bind(this,m)}/>
                    )
            })
      )
  }

  render()
  {
      if(this.props.currState.currSeries.seriesName)
      {
        return (
        <div>
            <h1>Movie list</h1>
            <div className='card-deck'>
                {this.props.currState.currSeries.movies ? this.renderMovie() : <div>no movies have been added yet</div>}
            </div>
            <div className="add-movie">
                <Button className="btn btn-secondary" onClick={this.addDuonaoMovie.bind(this)}>Add more</Button>
            </div>

        </div>)
      }
      else
      {
          return (<div>loading...</div>)
      }

  }

}


export default Main
