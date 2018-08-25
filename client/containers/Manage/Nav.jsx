import React from 'react';
import { Menu, Icon } from 'antd';
import styled from 'styled-components';
import { Link, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

const Nav = ({ productId, pathname }) => {
  const match = matchPath(pathname, { path: '/manage/:productId/:section?' });
  const { section } = match.params;
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
      <Menu.Item key="inbox">
        <Link to={`/manage/${productId}/inbox`}>Inbox</Link>
      </Menu.Item>
      <Menu.Item key="roadmap">
        <Link to={`/manage/${productId}/roadmap`}>Roadmap</Link>
      </Menu.Item>
    </StyledMenu>
  );
};

Nav.propTypes = {
  productId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  productId: state.product.productId,
  pathname: state.router.location.pathname,
});

export default connect(mapStateToProps)(Nav);
