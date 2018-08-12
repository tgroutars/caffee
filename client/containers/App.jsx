import React from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { checkAuth } from '../actions/auth';

class App extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    checkAuth: PropTypes.func.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    isWaiting: PropTypes.bool.isRequired,
  };

  async componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    const { authCode, userId } = query;
    await this.props.checkAuth({ userId, authCode });
  }

  render() {
    const { isWaiting, isAuthed } = this.props;
    if (isWaiting) {
      return <div>Loading</div>;
    }
    if (!isAuthed) {
      return <div>Not authed</div>;
    }
    return <div>Hi, I&apos;m Caffee 🤗</div>;
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
)(App);
