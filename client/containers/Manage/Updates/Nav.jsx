import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Layout, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  pendingActivitiesCountSelector,
  currentFilterSelector,
} from '../../../selectors/activity';
import { currentProductIdSelector } from '../../../selectors/product';

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
      a {
        transition: all 0.1s;
        font-size: 16px;
      }
      border-left: 3px solid #1890ff;
    }
  }
`;

// TODO: Extract this in component
class Nav extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    pendingActivitiesCount: PropTypes.number.isRequired,
  };

  render() {
    const { productId, pendingActivitiesCount, filter } = this.props;

    return (
      <StyledSider>
        <StyledMenu mode="vertical" selectedKeys={[filter || 'unprocessed']}>
          <StyledMenuItem key="pending">
            <Link to={`/manage/${productId}/updates/pending`}>
              <Icon type="warning" />Pending ({pendingActivitiesCount})
            </Link>
          </StyledMenuItem>
          <StyledMenuItem key="sent">
            <Link to={`/manage/${productId}/updates/sent`}>
              <Icon type="check" />Sent
            </Link>
          </StyledMenuItem>
          <StyledMenuItem key="discarded">
            <Link to={`/manage/${productId}/updates/discarded`}>
              <Icon type="delete" />Discarded
            </Link>
          </StyledMenuItem>
        </StyledMenu>
      </StyledSider>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
  filter: currentFilterSelector(state),
  pendingActivitiesCount: pendingActivitiesCountSelector(state),
});

export default connect(mapStateToProps)(Nav);
