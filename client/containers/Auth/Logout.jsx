import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Loading from '../../components/Loading';
import { logout } from '../../actions/auth';

class Logout extends React.Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    isWaitingAuth: PropTypes.bool.isRequired,
  };

  async componentDidMount() {
    const { isAuthed } = this.props;
    if (isAuthed) {
      await this.props.logout();
    }
  }

  render() {
    const { isAuthed, isWaitingAuth } = this.props;
    if (!isWaitingAuth && !isAuthed) {
      return <Redirect to="/" />;
    }
    return <Loading />;
  }
}

const mapStateToProps = state => ({
  isAuthed: state.auth.isAuthed,
  isWaitingAuth: state.auth.isWaiting,
});

const mapDispatchToProps = {
  logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logout);
