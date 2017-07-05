import React, { Component } from 'react';

import {
 ListGroup,ListGroupItem
} from 'react-bootstrap';

class HowTo extends Component {


    
    render () {
        return (
            
            <div >
 
  <p> **First, you have to use chrome... no shit..it's Chrome cast? To add movie you have to use a computer, to play/cast, you can just use mobile</p>
  <ListGroup>
    <ListGroupItem>duonao movie url: http://www.dnvod.tv/Movie/List.aspx?CID=0,1,3</ListGroupItem>
    <ListGroupItem>duonao anime url: http://www.dnvod.tv/Movie/List.aspx?CID=0,1,6</ListGroupItem>
    <ListGroupItem>duonao drama url: http://www.dnvod.tv/Movie/List.aspx?CID=0,1,4</ListGroupItem>
  </ListGroup>

  <ul>
    <li>
  1. Go to into a movie page that has media palyer in it.
    </li>
    <li>
  2. right click on an empty space in the page then choose "inspect" option     
    </li>
    <li>
  3. A developer console will be brought up, click on the "Network" tag (if you cant find it, then look harder, look for >> expension sign)
    </li>
    <li>
   4. choose "XHR" option on top of network tab, so we only filter xhr request     
    </li>
    <li>
  5. refresh the page and see the new XHR calls being made under the network tab
    </li>
    <li>
   6. look for "GetResource_blah_blah" and left click on it     
    </li>
    <li>
  7. you will see a new block with "header" "preview" "response" etc.
    </li>
    <li>
   8. choose response tab and copy everything under it looks something like: {"{blah blah blah}"}     
    </li>
    <li>
   9. Go back to monkey-cast and click on "Add duonao Movie", fill in all the information (this is really important for everyone) paste the xhr response you just copied in response text field then you should be good to go (obviously you need to push that play button  
    </li>
  </ul>

            </div>
        );
    }
}

export default HowTo;