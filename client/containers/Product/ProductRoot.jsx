import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import Loading from '../../components/Loading';
import ProductSettings from './Settings/ProductSettings';

const ProductRoot = ({ isWaiting }) => {
  if (isWaiting) {
    return <Loading />;
  }
  return (
    <Switch>
      <Redirect
        exact
        from="/p/:productId"
        to="/p/:productId/settings/feedback"
      />
      <Route
        path="/p/:productId/settings/:settings"
        component={ProductSettings}
      />
    </Switch>
  );
};

ProductRoot.propTypes = {
  isWaiting: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isWaiting: state.product.isWaiting,
});

export default withRouter(connect(mapStateToProps)(ProductRoot));
