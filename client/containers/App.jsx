import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from '../components/Loading';
import Home from './Home/Home';

const App = ({ isAuthed, isWaitingAuth }) => {
  if (isWaitingAuth) {
    return <Loading />;
  }
  if (!isAuthed) {
    return <Redirect to="/login" />;
  }
  return (
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  );
};

App.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  isWaitingAuth: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isWaitingAuth: state.auth.isWaiting,
  isAuthed: state.auth.isAuthed,
});

export default connect(mapStateToProps)(App);
