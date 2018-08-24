import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Loading from '../components/Loading';
import { checkAuth } from '../actions/auth';
import Login from './Auth/Login';

class Root extends React.Component {
  static propTypes = {
    checkAuth: PropTypes.func.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    isWaiting: PropTypes.bool.isRequired,
  };

  async componentDidMount() {
    await this.props.checkAuth();
  }

  render() {
    const { isWaiting, isAuthed } = this.props;
    if (isWaiting) {
      return <Loading />;
    }
    if (!isAuthed) {
      return <Login />;
    }
    return <div>App</div>;
  }
}

const mapStateToProps = state => ({
  isWaiting: state.auth.isWaiting,
  isAuthed: state.auth.isAuthed,
});

const mapDispatchToProps = {
  checkAuth,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
