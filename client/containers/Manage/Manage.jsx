import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Loading from '../../components/Loading';
import { fetchProduct } from '../../actions/products';
import Inbox from './Inbox';

class Manage extends React.Component {
  static propTypes = {
    fetchProduct: PropTypes.func.isRequired,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        productId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  state = { isWaiting: true };

  async componentDidMount() {
    const { productId } = this.props.match.params;
    await this.props.fetchProduct(productId);
    this.setState({ isWaiting: false });
  }

  render() {
    const { isWaiting } = this.state;
    if (isWaiting) {
      return <Loading />;
    }
    const { url } = this.props.match;
    return (
      <Switch>
        <Redirect exact from={url} to={`${url}/inbox`} />
        <Route path={`${url}/inbox`} component={Inbox} />
      </Switch>
    );
  }
}

const mapDispatchToProps = {
  fetchProduct,
};

export default connect(
  null,
  mapDispatchToProps,
)(Manage);
