import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class DeleteModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onAccept: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired,
    isLoading: PropTypes.bool
  };

  renderHeader() {
    if (!this.props.title) return false;
    return (
      <ModalHeader>
        <ModalClose onClick={this.props.onClose}/>
        <ModalTitle>{this.props.title}</ModalTitle>
      </ModalHeader>
    );
  }

  renderBody() {
    return (
      <ModalBody>
        <p className="m-n">{this.props.description || ''}<br/>
          <small className="text-danger">{this.getError()}</small>
        </p>
      </ModalBody>
    )
  }

  getError() {
    const {errors} = this.props;
    if (errors.length > 0)
      return errors[0];
    return false;
  }

  renderFooter() {
    return (
      <ModalFooter>
        <button onClick={this.props.onClose}
                className="btn btn-w-m btn-default">Cancel
        </button>
        <button disabled={this.props.isLoading}
                onClick={this.props.onAccept}
                className="btn btn-w-m btn-primary">Delete
        </button>
      </ModalFooter>
    )
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Modal>
    );
  }
}

export default DeleteModal;
