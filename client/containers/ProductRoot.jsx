import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { currentProductSelector } from '../selectors/product';
import Loading from '../components/Loading';

const ProductRoot = ({ product, isWaiting }) => {
  if (isWaiting) {
    return <Loading />;
  }
  return <div>{product.name}</div>;
};

ProductRoot.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  isWaiting: PropTypes.bool.isRequired,
};

ProductRoot.defaultProps = {
  product: null,
};

const mapStateToProps = state => ({
  product: currentProductSelector(state),
  isWaiting: state.product.isWaiting,
});

export default connect(mapStateToProps)(ProductRoot);
