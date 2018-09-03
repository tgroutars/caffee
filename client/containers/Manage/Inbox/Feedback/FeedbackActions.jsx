import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button as AntButton, Modal, Input } from 'antd';
import PropTypes from 'prop-types';

import AddAction from './Actions/Add';

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ListItem = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;
const Button = styled(AntButton)`
  width: 100%;
`;

class FeedbackActions extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
  };

  state = {
    currentModal: null,
  };

  getAddAction = () => {
    const { currentModal } = this.state;
    return (
      <div>
        <Button
          type="primary"
          onClick={() => this.setState({ currentModal: 'add' })}
        >
          Add to roadmap item
        </Button>
        <Modal
          closable={false}
          visible={currentModal === 'add'}
          footer={null}
          onCancel={this.closeModal}
        >
          <Input placeholder="Search roadmap items" autoFocus />
        </Modal>
      </div>
    );
  };

  getActions = () => {
    const { feedback } = this.props;
    const actions = [];
    if (!feedback.roadmapItemId && !feedback.isArchived) {
      actions.push(<AddAction />);
      actions.push(<Button type="primary">Create roadmap item</Button>);
      actions.push(<Button type="danger">Archive</Button>);
    }
    return actions;
  };

  closeModal = () => {
    this.setState({ currentModal: null });
  };

  render() {
    return (
      <div>
        <h3>Actions</h3>
        <List>
          {this.getActions().map(action => <ListItem>{action}</ListItem>)}
        </List>
      </div>
    );
  }
}

export default connect()(FeedbackActions);
