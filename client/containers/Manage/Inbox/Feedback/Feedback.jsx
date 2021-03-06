import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import styled from 'styled-components';
import moment from 'moment';

import { currentFeedbackSelector } from '../../../../selectors/feedback';
import { fetchFeedback } from '../../../../actions/feedbacks';
import FeedbackComments from './FeedbackComments';
import NewFeedbackComment from './NewFeedbackComment';
import FeedbackActions from './FeedbackActions';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
  display: flex;
`;
const ConversationWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
const MessagesWrapper = styled.div`
  overflow-y: scroll;
  position: relative;
`;
const ActionsWrapper = styled.div`
  width: 200px;
  padding-left: 24px;
  flex-shrink: 0;
`;
const FeedbackMessage = styled.div`
  word-wrap: break-word;
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
const Timestamp = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
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
        <ConversationWrapper>
          <MessagesWrapper>
            <FeedbackMessage>
              <Author>
                <Avatar size="small" src={author.image} />
                {author.name}
                <Timestamp> - {moment(feedback.createdAt).fromNow()}</Timestamp>
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
            <FeedbackComments feedback={feedback} />
          </MessagesWrapper>
          <NewFeedbackComment feedback={feedback} />
        </ConversationWrapper>
        <ActionsWrapper>
          <FeedbackActions feedback={feedback} />
        </ActionsWrapper>
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
