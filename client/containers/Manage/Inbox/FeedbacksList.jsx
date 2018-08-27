import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Avatar as AntAvatar } from 'antd';
import styled from 'styled-components';

import { currentFeedbacksSelector } from '../../../selectors/feedback';
import IconText from '../../../components/IconText';

const Avatar = styled(AntAvatar)`
  margin-right: 4px;
`;
const ListItem = styled(List.Item)`
  border: 1px solid #e8e8e8 !important;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
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

const FeedbackItem = ({ feedback }) => (
  <ListItem
    actions={[<IconText type="link" text={feedback.attachments.length} />]}
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
};

const FeedbacksList = ({ feedbacks }) => (
  <List
    itemLayout="vertical"
    size="large"
    dataSource={feedbacks}
    renderItem={feedback => (
      <FeedbackItem key={feedback.id} feedback={feedback} />
    )}
  />
);

FeedbacksList.propTypes = {
  feedbacks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = state => ({
  feedbacks: currentFeedbacksSelector(state),
});

export default connect(mapStateToProps)(FeedbacksList);
