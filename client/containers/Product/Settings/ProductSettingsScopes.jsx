import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { fetchScopes, saveName } from '../../../actions/scopes';
import { scopesTreeSelector } from '../../../selectors/scope';
import Scopes from './Scopes';

const ScopesWrapper = styled.div`
  max-width: 700px;
  padding-left: 16px;
  margin-top: 16px;
`;

class ProductSettingsFeedbacks extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    fetchScopes: PropTypes.func.isRequired,
    saveName: PropTypes.func.isRequired,
    scopesTree: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.fetchScopes(productId);
  }

  saveName = async (scopeId, name) => {
    await this.props.saveName(scopeId, name);
  };

  render() {
    const { scopesTree } = this.props;

    return (
      <div>
        <h1>Scopes</h1>
        <p>
          Customize the scopes of your product to classify feedback and assign
          it to the right PM
        </p>
        <ScopesWrapper>
          <Scopes scopes={scopesTree} onChangeName={this.saveName} />
        </ScopesWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  productId: state.product.productId,
  scopesTree: scopesTreeSelector(state),
});

const mapDispatchToProps = {
  fetchScopes,
  saveName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductSettingsFeedbacks);
