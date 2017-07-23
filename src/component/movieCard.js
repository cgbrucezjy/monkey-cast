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
      <div className="wrapper" onClick={this.props.gotoSeries}>
        <div className="product-img">
          {imgURL?<img className="card-img-top" src={imgURL} alt={"img not displayed"} />:<div></div>}
        </div>
        <div className="product-info">
          <div className="product-text">
            <h4 className="card-title">{seriesName}</h4>
            {/* <p className="card-text">{tags}</p> */}
            <p className="card-text">Views:{views?views:0}</p>  
          </div>
          <div className="product-price-btn">
            <Button type='button' className="btn btn-primary">Explore</Button>
          </div>
        </div>

      </div>
    )   
  }
  renderMovie(){
    const {title,contentType,source,description,views,imgURL} = this.props.movie
    return (
      <div className="wrapper" onClick={this.props.watchMovie}>
        <div className="product-img">
          {imgURL?<img className="card-img-top" src={imgURL} alt={"img not displayed"} />:<div></div>}
        </div>
        <div className="product-info">
          <div className="product-text">
            <h4>{title}</h4>
            <p>{description}</p>
            <p>Views:{views?views:0}</p>
            
          </div>
          <div className="product-price-btn">
            <Button type='button' className="btn btn-primary">Watch</Button>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return this.props.series ? this.renderSeries() : this.renderMovie()
  }
}

export default MovieCard;