import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Loading from '../components/Loading';
import Layout, { Header, Content } from '../components/Layout';
import UserMenu from './UserMenu';
import { checkAuth } from '../actions/auth';

const Greater = styled.h1`
  text-align: center;
`;

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
          <UserMenu />
        </Header>
        <Content>
          <Greater>Hi, I&apos;m Caffee 🤗</Greater>
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