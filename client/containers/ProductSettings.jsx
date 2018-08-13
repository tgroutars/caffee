import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Layout } from 'antd';
import { Route, Link, Switch } from 'react-router-dom';

import ProductSettingsFeedbacks from './ProductSettingsFeedbacks';

const { Sider, Content } = Layout;
const MenuItem = Menu.Item;

const StyledLayout = styled(Layout)`
  margin-left: 128px;
  margin-right: 128px;
  margin-top: 32px;
  background: #fff;
  max-height: calc(100vh - 128px);
`;
const StyledSider = styled(Sider)`
  background: #fff;
  .ant-layout-sider-children {
    max-height: calc(100vh - 128px);
  }
`;
const StyledContent = styled(Content)`
  background: #fff;
  padding-left: 32px;
  padding-right: 32px;
`;

const ProductSettings = ({ match }) => {
  const { settings, productId } = match.params;
  return (
    <StyledLayout>
      <StyledSider>
        <Menu mode="vertical" selectedKeys={[settings]}>
          <MenuItem key="feedback">
            <Link to={`/p/${productId}/settings/feedback`}>Feedback Form</Link>
          </MenuItem>
          <MenuItem key="users">
            <Link to={`/p/${productId}/settings/users`}>Users</Link>
          </MenuItem>
        </Menu>
      </StyledSider>
      <StyledContent>
        <Switch>
          <Route
            path="/p/:productId/settings/feedback"
            component={ProductSettingsFeedbacks}
          />
        </Switch>
      </StyledContent>
    </StyledLayout>
  );
};

ProductSettings.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      settings: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ProductSettings;
