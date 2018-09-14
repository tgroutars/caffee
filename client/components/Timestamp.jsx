import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

class TimeStamp extends React.Component {
  static propTypes = {
    time: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { time, className } = this.props;
    return <span className={className}>{moment(time).fromNow()}</span>;
  }
}

export default TimeStamp;
