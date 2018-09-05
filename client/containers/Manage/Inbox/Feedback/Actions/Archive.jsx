import React from 'react';
import styled from 'styled-components';
import {
  Button as AntButton,
  Input,
  Popover as AntPopover,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { archiveFeedback } from '../../../../../actions/feedbacks';

const { TextArea } = Input;

const Button = styled(AntButton)`
  width: 100%;
`;
const Popover = styled(AntPopover)``;
const ConfirmButton = styled(AntButton)`
  margin-top: 10px;
  margin-right: 4px;
`;

class Archive extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
    archiveFeedback: PropTypes.func.isRequired,
  };

  state = {
    reason: '',
  };

  componentDidUpdate(prevProps) {
    const { feedback } = this.props;
    if (feedback.id !== prevProps.feedback.id) {
      this.setState({ reason: '' });
    }
  }

  textAreaRef = React.createRef();

  handleCancel = () => {
    this.setState({});
  };

  handleReasonChange = evt => {
    const reason = evt.target.value;
    this.setState({ reason });
  };

  handlePopoverVisibilityChange = isVisible => {
    if (isVisible && this.textAreaRef.current) {
      setTimeout(() => this.textAreaRef.current.input.focus());
    }
  };

  handleConfirm = async () => {
    const { feedback } = this.props;
    const { reason } = this.state;
    await this.props.archiveFeedback(feedback.id, { archiveReason: reason });
    message.success('Feedback archived!');
  };

  renderPopoverContent = () => {
    const { reason } = this.state;
    return (
      <div>
        <TextArea
          placeholder="Give a reason for archiving this feedback"
          ref={this.textAreaRef}
          autoFocus
          onChange={this.handleReasonChange}
          value={reason}
        />
        <ConfirmButton onClick={this.handleConfirm} type="primary">
          Confirm
        </ConfirmButton>
      </div>
    );
  };

  render() {
    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        onVisibleChange={this.handlePopoverVisibilityChange}
        content={this.renderPopoverContent()}
      >
        <Button type="danger" onClick={this.openModal}>
          Archive
        </Button>
      </Popover>
    );
  }
}

const mapDispatchToProps = {
  archiveFeedback,
};

export default connect(
  null,
  mapDispatchToProps,
)(Archive);
