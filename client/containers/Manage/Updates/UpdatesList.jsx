import React from 'react';
import { connect } from 'react-redux';
import { List as AntList, Input, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Timestamp from '../../../components/Timestamp';
import IconText from '../../../components/IconText';
import { currentActivitiesSelector } from '../../../selectors/activity';

const Bold = styled.span`
  font-weight: bold;
`;
const List = styled(AntList)`
  max-width: 700px;
`;

class UpdatesList extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  renderActivityDescription({ activity, type }) {
    switch (type) {
      case 'moved':
        return (
          <span>
            Moved from <Bold>{activity.oldStage.name}</Bold> to{' '}
            <Bold>{activity.newStage.name}</Bold>
          </span>
        );
      case 'created':
        return (
          <span>
            Created in <Bold>{activity.stage.name}</Bold>
          </span>
        );
      case 'archived':
        return <span>Archived</span>;
      default:
        return null;
    }
  }

  render() {
    const { activities } = this.props;

    return (
      <List
        itemLayout="vertical"
        dataSource={activities}
        renderItem={activity => (
          <List.Item
            actions={[
              <Button type="primary">Send</Button>,
              <Button type="danger">Discard</Button>,
              <IconText
                type="user"
                text={activity.roadmapItem.followerCount}
              />,
            ]}
          >
            <List.Item.Meta
              title={activity.roadmapItem.title}
              description={
                <span>
                  {this.renderActivityDescription(activity)} -{' '}
                  <Timestamp time={activity.createdAt} />
                </span>
              }
            />
            <Input.TextArea placeholder="Add a custom comment for this update" />
          </List.Item>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  activities: currentActivitiesSelector(state),
});

export default connect(mapStateToProps)(UpdatesList);
