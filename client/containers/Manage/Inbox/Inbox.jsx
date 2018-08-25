import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { matchPath } from 'react-router-dom';

import Nav from './Nav';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  background: #fff;
`;
const StyledContent = styled(Content)`
  background: #fff;
  background: rgba(0, 0, 0, 0);
  padding: 24px;
  padding-left: 32px;
`;

const Inbox = ({ pathname }) => {
  const match = matchPath(pathname, { path: '/manage/:productId/inbox/:box?' });
  const box = match.params.box || 'unprocessed';
  return (
    <StyledLayout>
      <Nav />
      <StyledContent>{box}</StyledContent>
    </StyledLayout>
  );
};

Inbox.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
});

export default connect(mapStateToProps)(Inbox);
