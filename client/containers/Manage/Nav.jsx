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
const StyleMenuItem = styled(Menu.Item)`
  float: left;
`;
const IconButton = styled(Menu.Item)`
  width: 64px;
  padding-left: 20px;
  padding-right: 20px;
  float: left;
`;
const NavIcon = styled(Icon)`
  svg {
    height: 64px;
    font-size: 24px;
  }
`;
const SettingsMenuItem = styled(IconButton)`
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
      <IconButton key={null}>
        <Link to="/">
          <NavIcon type="home" />
        </Link>
      </IconButton>
      <StyleMenuItem key="inbox">
        <Link to={`/manage/${productId}/inbox/unprocessed`}>Inbox</Link>
      </StyleMenuItem>
      <StyleMenuItem key="updates">
        <Link to={`/manage/${productId}/updates/pending`}>Updates</Link>
      </StyleMenuItem>
      {isUserAdmin ? (
        <SettingsMenuItem key="settings">
          <Link to={`/manage/${productId}/settings`}>
            <NavIcon type="setting" />
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
