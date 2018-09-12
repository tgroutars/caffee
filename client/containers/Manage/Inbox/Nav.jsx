import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Layout, Icon } from 'antd';
import { Link, matchPath } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  currentFeedbackIdSelector,
  nbUnprocessedFeedbacksSelector,
} from '../../../selectors/feedback';

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  height: 100%;
  .ant-layout-sider-children {
    height: 100%;
    background: #f0f2f5;
  }
  height: calc(100vh - 128px);
`;
const StyledMenu = styled(Menu)`
  margin-top: 20px;
  background: #f0f2f5;
  border: none;
`;
const StyledMenuItem = styled(Menu.Item)`
  && {
    transition: all 0.1s;
    &.ant-menu-item-active {
      background: rgba(0, 0, 0, 0);
    }
    &.ant-menu-item-selected {
      background: #f0f2f5;
      a {
        font-size: 16px;
      }
      border-left: 3px solid #1890ff;
    }
  }
`;

const Nav = ({ pathname, currentFeedbackId, nbUnprocessed }) => {
  const match = matchPath(pathname, {
    path: '/manage/:productId/inbox/:box?',
    exact: false,
  });
  const { productId, box } = match.params;

  return (
    <StyledSider>
      <StyledMenu mode="vertical" selectedKeys={[box || 'unprocessed']}>
        <StyledMenuItem key="unprocessed">
          <Link
            to={`/manage/${productId}/inbox/unprocessed${
              currentFeedbackId ? `/${currentFeedbackId}` : ''
            }`}
          >
            <Icon type="inbox" />Inbox ({nbUnprocessed})
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="processed">
          <Link
            to={`/manage/${productId}/inbox/processed${
              currentFeedbackId ? `/${currentFeedbackId}` : ''
            }`}
          >
            <Icon type="check" />Processed
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="archived">
          <Link
            to={`/manage/${productId}/inbox/archived${
              currentFeedbackId ? `/${currentFeedbackId}` : ''
            }`}
          >
            <Icon type="delete" />Archived
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </StyledSider>
  );
};

Nav.propTypes = {
  pathname: PropTypes.string.isRequired,
  currentFeedbackId: PropTypes.string,
  nbUnprocessed: PropTypes.number.isRequired,
};

Nav.defaultProps = {
  currentFeedbackId: null,
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  currentFeedbackId: currentFeedbackIdSelector(state),
  nbUnprocessed: nbUnprocessedFeedbacksSelector(state),
});

export default connect(mapStateToProps)(Nav);
