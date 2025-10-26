import React, {Component} from 'react';
import {Modal} from 'react-native';

class ReusableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  setModalVisibility = isModalVisible => {
    this.setState({isModalVisible});
  };

  render() {
    const {children} = this.props;
    const {isModalVisible} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => this.setModalVisibility(false)}>
        {children}
      </Modal>
    );
  }
}

export default ReusableModal;
