import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changeCurrentProduct } from '../actions/product';
import ProductRoot from './ProductRoot';

class ProductRoute extends React.Component {
  static propTypes = {
    changeCurrentProduct: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        productId: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  static defaultProps = {};

  async componentDidMount() {
    const { productId } = this.props.match.params;
    if (productId) {
      await this.props.changeCurrentProduct(productId);
    }
  }

  async componentDidUpdate(prevProps) {
    const { productId } = this.props.match.params;
    const { productId: prevProductId } = prevProps.match.params;
    if (productId && productId !== prevProductId) {
      await this.props.changeCurrentProduct(productId);
    }
  }

  render() {
    return <ProductRoot />;
  }
}

const mapDispatchToProps = {
  changeCurrentProduct,
};

export default connect(
  null,
  mapDispatchToProps,
)(ProductRoute);
