import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import dynamicImport from '../hoc/dynamicImport';
import Loading from '../components/Loading';
import Home from './Home/Home';
import Intercom from './Intercom';

const Manage = dynamicImport(() => import('./Manage/Manage'));

const App = ({ isAuthed, isWaitingAuth }) => {
  if (isWaitingAuth) {
    return <Loading />;
  }
  if (!isAuthed) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Intercom />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/manage/:productId" component={Manage} />
      </Switch>
    </div>
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
