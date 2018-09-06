import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Layout } from 'antd';
import { Link, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  height: 100%;
  .ant-layout-sider-children {
    height: 100%;
    background: #f0f2f5;
  }#f0f2f5
`;
const StyledMenu = styled(Menu)`
  margin-top: 20px;
  background: #f0f2f5;
  border: none;
`;
const StyledMenuItem = styled(Menu.Item)`
  && {
    &.ant-menu-item-selected {
      background: #f0f2f5;
      ${'' /* background: white; */} a {
        transition: all 0.1s;
        font-size: 16px;
      }
      border-left: 3px solid #1890ff;
    }
  }
`;

const Nav = ({ pathname }) => {
  const match = matchPath(pathname, {
    path: '/manage/:productId/settings/:setting?',
    exact: false,
  });
  const { productId, setting } = match.params;

  return (
    <StyledSider>
      <StyledMenu mode="vertical" selectedKeys={[setting]}>
        <StyledMenuItem key="users">
          <Link to={`/manage/${productId}/settings/users`}>Users</Link>
        </StyledMenuItem>
        <StyledMenuItem key="feedback">
          <Link to={`/manage/${productId}/settings/feedback`}>
            Feedback form
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="scopes">
          <Link to={`/manage/${productId}/settings/scopes`}>Scopes</Link>
        </StyledMenuItem>
        <StyledMenuItem key="trello">
          <Link to={`/manage/${productId}/settings/trello`}>Trello</Link>
        </StyledMenuItem>
        <StyledMenuItem key="slack">
          <Link to={`/manage/${productId}/settings/slack`}>Slack</Link>
        </StyledMenuItem>
      </StyledMenu>
    </StyledSider>
  );
};

Nav.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
});

export default connect(mapStateToProps)(Nav);
