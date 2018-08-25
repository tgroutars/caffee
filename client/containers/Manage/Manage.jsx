import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { Layout as AntLayout } from 'antd';

import { fetchProduct } from '../../actions/products';
import Inbox from './Inbox/Inbox';
import Settings from './Settings/Settings';
import Nav from './Nav';

const { Content: AntContent, Header: AntHeader } = AntLayout;

const Layout = styled(AntLayout)``;
const Header = styled(AntHeader)`
  padding-left: 0;
  height: 64px;
`;
const Content = styled(AntContent)`
  height: calc(100vh - 64px);
  padding: 32px;
`;

class Manage extends React.Component {
  static propTypes = {
    fetchProduct: PropTypes.func.isRequired,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        productId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = { isWaiting: true };

  async componentDidMount() {
    const { productId } = this.props.match.params;
    await this.props.fetchProduct(productId);
    this.setState({ isWaiting: false });
  }

  render() {
    const { isWaiting } = this.state;
    const { url } = this.props.match;
    return (
      <Layout>
        <Header>
          <Nav />
        </Header>
        <Content>
          {!isWaiting ? (
            <Switch>
              <Redirect exact from={url} to={`${url}/settings`} />
              <Route path={`${url}/inbox`} component={Inbox} />
              <Route path={`${url}/settings`} component={Settings} />
            </Switch>
          ) : null}
        </Content>
      </Layout>
    );
  }
}

const mapDispatchToProps = {
  fetchProduct,
};

export default connect(
  null,
  mapDispatchToProps,
)(Manage);
