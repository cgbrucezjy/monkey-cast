import {
  Col,
  Row,
  Button
} from 'react-bootstrap';
import React, { Component } from 'react';



class MovieCard extends Component {

  renderSeries(){
     const {seriesName,imgURL,tags,views} = this.props.series
     //console.log(this.props.series);
    return (
      <div className="card mb-3" onClick={this.props.gotoSeries}>
        <img className="card-img-top" src={imgURL} alt={"img not displayed"} />
        <div className="card-block">
          <h2 className="card-title">{seriesName}</h2>
          <h5 className="card-text">{tags}</h5>
          <h5 className="card-text">Views:{views?views:0}</h5>
          <Button type='button' className="btn btn-primary">Explore</Button>
        </div>
      </div>
    )   
  }
  renderMovie(){
    const {title,contentType,source,description,views,imgURL} = this.props.movie
    return (
      <div className="card mb-3" onClick={this.props.watchMovie}>
        <img className="card-img-top" src={imgURL} alt={"img not displayed"} />
        <div className="card-block">
          <h4 className="card-title">{title}</h4>
          <p className="card-text">{description}</p>
          <h5 className="card-text">Views:{views?views:0}</h5>
          <Button type='button' className="btn btn-primary">Watch</Button>
        </div>
      </div>
    )
  }
  render() {
    return this.props.series ? this.renderSeries() : this.renderMovie()
  }
}

export default MovieCard;