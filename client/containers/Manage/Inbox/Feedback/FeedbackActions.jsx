import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import PropTypes from 'prop-types';

import AddAction from './Actions/Add';

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ListItem = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;
const Button = styled(AntButton)`
  width: 100%;
`;

class FeedbackActions extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
  };

  getActions = () => {
    const { feedback } = this.props;
    const actions = [];
    if (!feedback.roadmapItemId && !feedback.isArchived) {
      actions.push(<AddAction />);
      actions.push(<Button type="primary">Create roadmap item</Button>);
      actions.push(<Button type="danger">Archive</Button>);
    }
    return actions;
  };

  render() {
    const { feedback } = this.props;
    const isUnprocessed = !feedback.roadmapItemId && !feedback.isArchived;
    return (
      <div>
        <List>
          {isUnprocessed ? (
            <ListItem>
              <AddAction feedback={feedback} />
            </ListItem>
          ) : null}
        </List>
      </div>
    );
  }
}

export default connect()(FeedbackActions);
