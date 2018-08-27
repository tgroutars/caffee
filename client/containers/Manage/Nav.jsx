import React from 'react';
import { Menu, Icon } from 'antd';
import styled from 'styled-components';
import { Link, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isCurrentProductAdminSelector } from '../../selectors/product';

const StyledMenu = styled(Menu)`
  line-height: 64px;
`;
const HomeButton = styled(Menu.Item)`
  width: 64px;
  padding-left: 20px;
  padding-right: 20px;
`;
const HomeIcon = styled(Icon)`
  line-height: 64px;
  font-size: 24px;
`;
const SettingsMenuItem = styled(Menu.Item)`
  && {
    float: right;
  }
`;

const Nav = ({ pathname, isUserAdmin }) => {
  const match = matchPath(pathname, { path: '/manage/:productId/:section?' });
  const { section, productId } = match.params;
  return (
    <StyledMenu
      theme="dark"
      mode="horizontal"
      selectedKeys={[section, section]}
    >
      <HomeButton key={null}>
        <Link to="/">
          <HomeIcon type="home" />
        </Link>
      </HomeButton>
      {/* <Menu.Item key="inbox">
        <Link to={`/manage/${productId}/inbox`}>Inbox</Link>
      </Menu.Item>
      <Menu.Item key="roadmap">
        <Link to={`/manage/${productId}/roadmap`}>Roadmap</Link>
      </Menu.Item> */}
      {isUserAdmin ? (
        <SettingsMenuItem key="settings">
          <Link to={`/manage/${productId}/settings`}>
            <Icon type="setting" />Settings
          </Link>
        </SettingsMenuItem>
      ) : null}
    </StyledMenu>
  );
};

Nav.propTypes = {
  pathname: PropTypes.string.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  isUserAdmin: isCurrentProductAdminSelector(state),
});

export default connect(mapStateToProps)(Nav);
