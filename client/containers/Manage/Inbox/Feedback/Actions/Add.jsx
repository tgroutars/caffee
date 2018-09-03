import React from 'react';
import styled from 'styled-components';
import { Button as AntButton, Modal, Input } from 'antd';
import debounce from 'lodash/debounce';

// import { searchRoadmapItems } from '../../../../../actions/roadmapItems';

const Button = styled(AntButton)`
  width: 100%;
`;

class Add extends React.Component {
  state = {
    isModalVisible: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isModalVisible === false &&
      this.state.isModalVisible === true &&
      this.inputRef.current
    ) {
      this.inputRef.current.input.focus();
    }
  }

  inputRef = React.createRef();

  handleQueryChange = evt => {
    this.searchRoadmapItems(evt.target.value);
  };

  searchRoadmapItems = debounce(searchQuery => {
    // TODO
  }, 500);

  openModal = () => {
    this.setState({ isModalVisible: true });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { isModalVisible } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.openModal}>
          Add to roadmap item
        </Button>
        <Modal
          closable={false}
          visible={isModalVisible}
          footer={null}
          onCancel={this.closeModal}
        >
          <Input
            placeholder="Search roadmap items"
            ref={this.inputRef}
            autoFocus
            onChange={this.handleQueryChange}
          />
        </Modal>
      </div>
    );
  }
}

export default Add;
