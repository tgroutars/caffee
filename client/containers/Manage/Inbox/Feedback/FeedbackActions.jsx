import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import AddAction from './Actions/Add';
import ArchiveAction from './Actions/Archive';
import CreateAction from './Actions/Create';

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ListItem = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;

class FeedbackActions extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
  };

  render() {
    const { feedback } = this.props;
    const isUnprocessed = !feedback.roadmapItemId && !feedback.archivedAt;
    return (
      <div>
        <List>
          {isUnprocessed ? (
            <ListItem>
              <AddAction feedback={feedback} />
            </ListItem>
          ) : null}
          {isUnprocessed ? (
            <ListItem>
              <CreateAction feedback={feedback} />
            </ListItem>
          ) : null}
          {isUnprocessed ? (
            <ListItem>
              <ArchiveAction feedback={feedback} />
            </ListItem>
          ) : null}
        </List>
      </div>
    );
  }
}

export default connect()(FeedbackActions);
