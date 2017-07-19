import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import { confirmable } from 'react-confirm';
class ComplexConfirmation extends React.Component {

  refCallback(ref) {
    this.inputRef = ref;
  }

  handleOnClick(index) {
    const proceed = this.props.proceed;
    var duonao
    var url
    var contentType
    var description
    return () => {
      try{
        duonao=JSON.parse(this.refs.inputJson.value);
        url=duonao.http.provider
        contentType=duonao.http.resourcetype
        description="Episode "+this.refs.description.value 
        console.log(url)
      }catch (e) {
          // Oh well, but whatever...
          console.log(e)
      }
      proceed({
        title: this.refs.title.value,
        source: url,
        contentType,
        description
      });
    }
  }

  render() {
    const {
      show,
      dismiss,
      cancel,
      message
    } = this.props;

    return (
      <div className="static-modal">
        <Modal show={show} onHide={dismiss} >
          <Modal.Header>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
            <div>
              <h3>Title : </h3><input ref="title" type='text' />
              <h4>Episode : </h4><input ref="description" type='text' />
              <h4>Response : </h4><input ref="inputJson" type='text' />
              
            </div>
            
          </Modal.Body>
          <Modal.Footer>
            
            <Button onClick={cancel}>Cancel</Button>
            <Button className='button-l' bsStyle="default" onClick={this.handleOnClick(1)}>Add</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}


export default confirmable(ComplexConfirmation);