import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import styled from 'styled-components';

import { currentFeedbackSelector } from '../../../../selectors/feedback';
import { fetchFeedback } from '../../../../actions/feedbacks';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
`;
const FeedbackMessage = styled.div`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.05);
  white-space: pre-wrap;
`;
const Author = styled.div`
  font-size: 16px;
  font-weight: bold;
  .ant-avatar {
    margin-right: 6px;
  }
`;
const Description = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;
const Attachments = styled.div`
  display: flex;
  overflow-x: scroll;
  height: 100px;
  margin-top: 8px;
`;
const Attachment = styled.a`
  display: block;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin: 0 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  img {
    height: 100%;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;
const AttachmentText = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  line-height: 100px;
`;

class Feedback extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}),
    fetchFeedback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    feedback: null,
  };

  async componentDidMount() {
    const { feedback } = this.props;
    if (feedback) {
      await this.props.fetchFeedback(feedback.id);
    }
  }

  async componentDidUpdate(prevProps) {
    const { feedback } = this.props;
    const feedbackId = feedback && feedback.id;
    const { feedback: prevFeedback } = prevProps;
    const prevFeedbackId = prevFeedback && prevFeedback.id;
    if (feedbackId && feedbackId !== prevFeedbackId) {
      await this.props.fetchFeedback(feedbackId);
    }
  }

  render() {
    const { feedback } = this.props;
    if (!feedback) {
      return <div>Loading...</div>;
    }

    const { attachments, author, description } = feedback;
    return (
      <Wrapper>
        <FeedbackMessage>
          <Author>
            <Avatar size="small" src={author.image} />
            {author.name}
          </Author>
          <Description>{description}</Description>
          {feedback.attachments.length ? (
            <Attachments>
              {attachments.map(({ key, url, mimetype }) => (
                <Attachment key={key} href={url} target="blank">
                  {mimetype && mimetype.startsWith('image/') ? (
                    <img src={url} alt="" />
                  ) : (
                    <AttachmentText>No preview</AttachmentText>
                  )}
                </Attachment>
              ))}
            </Attachments>
          ) : null}
        </FeedbackMessage>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  feedback: currentFeedbackSelector(state),
});
const mapDispatchToProps = { fetchFeedback };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feedback);
