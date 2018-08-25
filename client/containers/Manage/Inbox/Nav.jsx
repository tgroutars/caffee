import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Layout, Icon } from 'antd';
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
    path: '/manage/:productId/inbox/:box?',
    exact: false,
  });
  const { productId, box } = match.params;

  return (
    <StyledSider>
      <StyledMenu mode="vertical" selectedKeys={[box || 'unprocessed']}>
        <StyledMenuItem key="unprocessed">
          <Link to={`/manage/${productId}/inbox`}>
            <Icon type="inbox" />Inbox
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="processed">
          <Link to={`/manage/${productId}/inbox/processed`}>
            <Icon type="check" />Processed
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="archived">
          <Link to={`/manage/${productId}/inbox/archived`}>
            <Icon type="delete" />Archived
          </Link>
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
