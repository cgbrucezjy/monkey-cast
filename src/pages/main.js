import React, { Component } from 'react'
import { confirmComplex ,addSeries} from '../utils/confirm';
import {Button,Badge,Navbar,Form,FormGroup,FormControl } from 'react-bootstrap'
import * as firebase from 'firebase';
import MovieCard from '../component/movieCard'
import { Link } from 'react-router'
import LazyLoad from 'react-lazyload';
class Main extends Component {

  constructor(props) {
    super(props)
    this.state={
      filter:null
    }
  }

  componentDidMount() {

  }
  watchMovie(m){
      
      this.props.history.push({
            pathname: '/videoPage/'+m.key
          })
  }
  gotoSeries(s){
      this.props.history.push({
            pathname: '/seriesPage/'+s.key
          })
  }
  search(e)
  {
    console.log(e.target.value)
    this.setState({filter:e.target.value})
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
      var newRef=firebase.database().ref('movies').push() 
      newMovie.key=newRef.key
      newRef.set(newMovie)
    }, () => {
      console.log('cancel!');
    });
  }
  addSeries(){
    addSeries({ message: 'Please Enter Information About This Series' }).then(({ name }) => {
      console.log(name);
      var movieName =  name
      var newRef=firebase.database().ref('series').push() 
      newRef.set({seriesName:movieName,key:newRef.key})
    }, () => {
      console.log('cancel!');
    });
  }
  renderMovie()
  {
      return (
            this.props.currState.movies
            .map(s=>{
              s.views=s.views?s.views:0
              return s
            })
            .filter(s=>this.state.filter?JSON.stringify(s).includes(this.state.filter):true)
            .sort((a,b)=>b.views-a.views)
            .map((m,i)=>{
                return (
                  <LazyLoad key={i} >
                    <MovieCard  movie={m} watchMovie={this.watchMovie.bind(this,m)}/>
                  </LazyLoad>
                )
            })
      )
  }
  renderSeries()
  {
      return (
            this.props.currState.series
            .map(s=>{
              s.views=s.views?s.views:0
              return s
            })
            .filter(s=>this.state.filter?JSON.stringify(s).includes(this.state.filter):true)
            .sort((a,b)=>b.views-a.views)
            .map((s,i)=>{
                return (
                  <LazyLoad key={i} >
                    <MovieCard series={s} gotoSeries={this.gotoSeries.bind(this,s)}/>
                  </LazyLoad>
                )
            })
      )
  }
  renderSearchBar()
  {
    return (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              
              <a href="#">Find</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl type="text" placeholder="name,genre,and stuff" onChange={this.search.bind(this)}/>
              </FormGroup>
              {'   '}
              <Badge className="bright">NEW</Badge>
            </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
    )
  }
  render()
  {
    return (
    <div>
          {this.renderSearchBar()}
          <div className="add-movie">
            {/* <Button className="btn btn-secondary" onClick={this.addDuonaoMovie}>Add Duonao Movie</Button> */}
            {/* <Button className="btn btn-secondary" onClick={this.addSeries}>Add Series</Button> */}
             <Link to="/request">Request a Movie or Series</Link> 
        </div>
        <h1>Movie list</h1>
          <div className='card-deck'>
              {this.renderMovie()}
          </div>
        <h1>Series list</h1>
        <div className='card-deck'>
            {this.renderSeries()}
        </div>


    </div>)
  }

}


export default Main
