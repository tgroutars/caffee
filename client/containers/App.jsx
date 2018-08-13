import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Loading from '../components/Loading';
import Layout, { Header, Content } from '../components/Layout';
import UserMenu from './UserMenu';
import ProductMenu from './ProductMenu';
import ProductRoute from './ProductRoute';
import { checkAuth } from '../actions/auth';

class App extends React.Component {
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
      return <div>Not authed</div>;
    }
    return (
      <Layout>
        <Header>
          <Route path="/p/:productId" component={ProductMenu} />
          <UserMenu />
        </Header>
        <Content>
          <Switch>
            <Route path="/p/:productId" component={ProductRoute} />
          </Switch>
        </Content>
      </Layout>
    );
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
