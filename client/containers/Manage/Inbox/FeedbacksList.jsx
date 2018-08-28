import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Avatar as AntAvatar } from 'antd';
import styled from 'styled-components';
import { push } from 'connected-react-router';

import {
  currentFeedbacksSelector,
  currentInboxSelector,
} from '../../../selectors/feedback';
import { currentProductIdSelector } from '../../../selectors/product';
import IconText from '../../../components/IconText';
import { manageFeedback } from '../../../lib/routes';

const Avatar = styled(AntAvatar)`
  margin-right: 4px;
`;
const ListItem = styled(List.Item)`
  border: 1px solid #e8e8e8 !important;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
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

const FeedbackItem = ({ feedback, onClick }) => (
  <ListItem
    actions={[<IconText type="link" text={feedback.attachments.length} />]}
    onClick={onClick}
  >
    <ListItemMeta
      title={
        <span>
          <Avatar size="small" src={feedback.author.image} />
          {feedback.author.name}
        </span>
      }
      description={feedback.description}
    />
  </ListItem>
);

FeedbackItem.propTypes = {
  feedback: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};

class FeedbacksList extends React.Component {
  handleNavigateFeedback = feedbackId => {
    const { productId, inbox } = this.props;
    this.props.push(manageFeedback({ productId, inbox, feedbackId }));
  };

  render() {
    const { feedbacks } = this.props;
    return (
      <List
        itemLayout="vertical"
        size="large"
        dataSource={feedbacks}
        renderItem={feedback => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            onClick={() => this.handleNavigateFeedback(feedback.id)}
          />
        )}
      />
    );
  }
}

FeedbacksList.propTypes = {
  feedbacks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  inbox: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  feedbacks: currentFeedbacksSelector(state),
  productId: currentProductIdSelector(state),
  inbox: currentInboxSelector(state),
});

const mapDispatchToProps = {
  push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbacksList);
