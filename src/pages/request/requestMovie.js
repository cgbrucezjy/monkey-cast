import React, { Component } from 'react'
import ReactDOM  from "react-dom"
import {FormGroup,ControlLabel,FormControl,Button,ListGroup,ListGroupItem,ButtonGroup,Badge } from 'react-bootstrap'
import WishListService from "../../service/WishListService"
import ReactGA from 'react-ga';
import {formatDate} from "../../utils/util"
import './requestMovie.css'
class RequestMovie extends Component {

  constructor(props) {
    super(props)
    this.state={
        wishList:[]
    }
  }

  componentWillMount() {
    WishListService.watchWishList().on('child_added',(data)=>{
        this.setState({wishList:this.state.wishList.concat(data.val())})
    })
    ReactGA.event({
        category: 'wish list',
        action: 'go to wishlist',
        label: 'go to wishlist'
    });
  }
  post(e){
      e.preventDefault()
    ReactGA.event({
        category: 'wish list',
        action: 'adds to wishlist',
        label: 'adds to wishlist'
    });
      console.log(ReactDOM.findDOMNode(this.refs.inputMovie).value)
      var item={
          name:ReactDOM.findDOMNode(this.refs.inputMovie).value,
          resolved:false,
          votes:0
      }
    WishListService.addToWishList(item).then(data=>{
        console.log("movie added",data)
        ReactDOM.findDOMNode(this.refs.inputMovie).value="";
    })
  }
  renderForm() {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
        >
          <ControlLabel>I want to watch: </ControlLabel>
          <FormControl
            type="text"
            
            placeholder="Enter Movie/Series Name"
            ref = "inputMovie"
          />
        </FormGroup>
        <Button type="submit" className="pull-right" onClick={this.post.bind(this)}>
            Post
        </Button>
      </form>
    );
  }
  renderList()
  {
      return (
        <ListGroup>
            {this.state.wishList
            .sort((a,b)=>b.timestamp-a.timestamp)
            .map((item,i)=>{
                return (
                    <ListGroupItem key={i}>
                        <div>
                            {item.name}
                            <Badge pullRight className={item.resolved?"bright":""}>{item.resolved?"added":"waiting"}</Badge>
                        </div>
                        <p>{formatDate(new Date(item.timesteamp))}</p>
                    </ListGroupItem>
                )
            })}
        </ListGroup>
      )
  }

  render()
  {
      return (<div>

          {this.renderForm()}
          {this.renderList()}
      </div>)
  }

}


export default RequestMovie
