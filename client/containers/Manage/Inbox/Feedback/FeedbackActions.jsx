import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import AddAction from './Actions/Add';
import ArchiveAction from './Actions/Archive';
import CreateAction from './Actions/Create';
import IconText from '../../../../components/IconText';

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ListItem = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;
const ArchivedMessage = styled(IconText)`
  color: #f5222d;
`;
const Link = styled.a`
  &:focus {
    text-decoration: none;
  }
`;

class FeedbackActions extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
  };

  render() {
    const { feedback } = this.props;
    const isArchived = !!feedback.archivedAt;
    const isProcessed = !!feedback.roadmapItemId;
    const isUnprocessed = !isProcessed && !isArchived;
    return (
      <div>
        <List>
          {isProcessed ? (
            <div>
              <div>Associated roadmap item:</div>
              <Link href={feedback.roadmapItem.trelloCardURL} target="_blank">
                {feedback.roadmapItem.title}
              </Link>
            </div>
          ) : null}
          {isArchived ? (
            <ArchivedMessage type="delete" text="This feedback is archived" />
          ) : null}
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
