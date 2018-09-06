import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';

import Nav from './Nav';
import Feedback from './Feedback';
import Scopes from './Scopes/Scopes';
import Users from './Users/Users';
import Trello from './Trello';

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

const ProductSettings = () => (
  <StyledLayout>
    <Nav />
    <StyledContent>
      <Switch>
        <Redirect
          exact
          from="/manage/:productId/settings"
          to="/manage/:productId/settings/users"
        />
        <Route path="/manage/:productId/settings/users" component={Users} />
        <Route
          path="/manage/:productId/settings/feedback"
          component={Feedback}
        />
        <Route path="/manage/:productId/settings/scopes" component={Scopes} />
        <Route path="/manage/:productId/settings/trello" component={Trello} />
      </Switch>
    </StyledContent>
  </StyledLayout>
);

export default ProductSettings;
