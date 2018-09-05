import React from 'react';
import styled from 'styled-components';
import { Input as AntInput } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import trim from 'lodash/trim';

import { addComment } from '../../../../actions/feedbacks';

const Container = styled.div`
  width: 100%;
`;

const TextArea = styled(AntInput.TextArea)`
  resize: none;
`;

class NewFeedbackComment extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
    addComment: PropTypes.func.isRequired,
  };

  state = { comment: '', isSending: false };

  componentDidUpdate(prevProps) {
    const { feedback } = this.props;
    if (feedback.id !== prevProps.feedback.id) {
      this.setState({ comment: '' });
    }
  }

  handleCommentChange = evt => {
    this.setState({ comment: evt.target.value });
  };

  handleEnter = async evt => {
    const { isSending } = this.state;
    if (isSending) {
      return;
    }
    const { shiftKey, metaKey } = evt;
    if (shiftKey || metaKey) {
      evt.preventDefault();
      this.setState({ isSending: true });
      const { feedback } = this.props;
      const comment = trim(this.state.comment);
      if (!comment) {
        return;
      }
      await this.props.addComment(feedback.id, { text: comment });
      this.setState({ comment: '', isSending: false });
    }
  };

  render() {
    const { comment, isSending } = this.state;
    return (
      <Container>
        <TextArea
          disabled={isSending}
          onPressEnter={this.handleEnter}
          value={comment}
          onChange={this.handleCommentChange}
          placeholder="Write a new comment..."
          autosize={{ minRows: 2, maxRows: 4 }}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = {
  addComment,
};

export default connect(
  null,
  mapDispatchToProps,
)(NewFeedbackComment);
