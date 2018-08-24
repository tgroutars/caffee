import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { checkAuth } from '../actions/auth';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import App from './App';

class Root extends React.Component {
  static propTypes = {
    checkAuth: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    await this.props.checkAuth();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route path="/" component={App} />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  checkAuth,
};

export default connect(
  null,
  mapDispatchToProps,
)(Root);
