import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';

import Nav from './Nav';
import Feedback from './Feedback';

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
          to="/manage/:productId/settings/feedback"
        />
        <Route
          path="/manage/:productId/settings/feedback"
          component={Feedback}
        />
      </Switch>
    </StyledContent>
  </StyledLayout>
);

export default ProductSettings;
