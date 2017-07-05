import React,{Component} from 'react';
import { Modal, Button } from 'react-bootstrap'
import { confirmable } from 'react-confirm';
class AddSeries extends Component {


  handleOnClick(index) {
    const proceed = this.props.proceed;
    return () => {

      proceed({
        name: this.refs.name.value
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
              <h3>Series name : </h3><input ref="name" type='text' />
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


export default confirmable(AddSeries);