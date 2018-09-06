import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../vendor/intercom';

import { authedUserSelector } from '../selectors/user';

export const shutdownIntercom = () => async () => {};

class Intercom extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { user } = this.props;
    window.Intercom('boot', {
      app_id: process.env.INTERCOM_APP_ID,
      name: user.name,
      email: user.email,
    });
  }

  componentWillUnmount() {
    window.Intercom('shutdown');
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  user: authedUserSelector(state),
});

export default connect(mapStateToProps)(Intercom);
