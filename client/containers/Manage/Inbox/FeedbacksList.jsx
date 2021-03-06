import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Avatar as AntAvatar } from 'antd';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import moment from 'moment';

import {
  currentFeedbacksSelector,
  currentInboxSelector,
  currentFeedbackIdSelector,
} from '../../../selectors/feedback';
import { currentProductIdSelector } from '../../../selectors/product';
import IconText from '../../../components/IconText';
import { manageFeedback } from '../../../lib/routes';

const Avatar = styled(AntAvatar)`
  margin-right: 4px;
`;
const ListItem = styled(List.Item)`
  border: none !important;
  margin-bottom: 8px;
  padding: 16px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  border-left: ${({ selected }) =>
    selected ? '4px solid #1890ff !important' : '4px solid #e8e8e8 !important'};
`;
const ListItemMeta = styled(List.Item.Meta)`
  .ant-list-item-meta-content {
    max-width: 100%;
    .ant-list-item-meta-description {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
    }
  }
`;
const Timestamp = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`;

const FeedbackItem = ({ feedback, onClick, isSelected }) => (
  <ListItem
    actions={[
      <IconText type="message" text={feedback.commentsCount} />,
      <IconText type="link" text={feedback.attachments.length} />,
    ]}
    onClick={onClick}
    selected={isSelected}
  >
    <ListItemMeta
      title={
        <span>
          <Avatar size="small" src={feedback.author.image} />
          {feedback.author.name}
          <Timestamp> - {moment(feedback.createdAt).fromNow()}</Timestamp>
        </span>
      }
      description={feedback.description}
    />
  </ListItem>
);

FeedbackItem.propTypes = {
  feedback: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

class FeedbacksList extends React.Component {
  static propTypes = {
    currentFeedbackId: PropTypes.string,
    feedbacks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    inbox: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    currentFeedbackId: null,
  };

  handleNavigateFeedback = feedbackId => {
    const { productId, inbox } = this.props;
    this.props.push(manageFeedback({ productId, inbox, feedbackId }));
  };

  render() {
    const { feedbacks, currentFeedbackId } = this.props;
    return (
      <List
        locale={{ emptyText: 'No feedback in this list' }}
        itemLayout="vertical"
        size="large"
        dataSource={feedbacks}
        renderItem={feedback => (
          <FeedbackItem
            key={feedback.id}
            isSelected={feedback.id === currentFeedbackId}
            feedback={feedback}
            onClick={() => this.handleNavigateFeedback(feedback.id)}
          />
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  feedbacks: currentFeedbacksSelector(state),
  productId: currentProductIdSelector(state),
  inbox: currentInboxSelector(state),
  currentFeedbackId: currentFeedbackIdSelector(state),
});

const mapDispatchToProps = {
  push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbacksList);
