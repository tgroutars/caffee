import React from 'react';
import { Layout as AntLayoutComponent } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const AntLayout = styled(AntLayoutComponent)`
  height: 100vh;
`;
const Header = styled(AntLayoutComponent.Header)`
  background: #fff;
`;
const Content = styled(AntLayoutComponent.Content)`
  background: #fff;
`;

const Layout = ({ children }) => (
  <div>
    <AntLayout>
      <Header />
      <Content>{children}</Content>
    </AntLayout>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
