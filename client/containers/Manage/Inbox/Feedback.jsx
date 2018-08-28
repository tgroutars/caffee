import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { currentFeedbackSelector } from '../../../selectors/feedback';

class Feedback extends React.Component {
  static propTypes = {
    feedback: PropTypes.shape({}).isRequired,
  };

  render() {
    const { feedback } = this.props;
    return <div>{feedback && feedback.description}</div>;
  }
}

const mapStateToProps = state => ({
  feedback: currentFeedbackSelector(state),
});

export default connect(mapStateToProps)(Feedback);
