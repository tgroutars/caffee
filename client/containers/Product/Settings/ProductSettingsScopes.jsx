import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  fetchScopes,
  saveName,
  createScope,
  archiveScope,
} from '../../../actions/scopes';
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
    createScope: PropTypes.func.isRequired,
    archiveScope: PropTypes.func.isRequired,
    saveName: PropTypes.func.isRequired,
    scopesTree: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.fetchScopes(productId);
  }

  handleSave = async (scope, name) => {
    const { productId } = this.props;
    if (scope.id) {
      await this.props.saveName(scope.id, name);
    } else {
      await this.props.createScope({
        name,
        productId,
        parentId: scope.parentId,
      });
    }
  };

  handleArchive = async scope => {
    await this.props.archiveScope(scope.id);
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
          <Scopes
            scopes={scopesTree}
            onSave={this.handleSave}
            onArchive={this.handleArchive}
          />
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
  createScope,
  archiveScope,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductSettingsFeedbacks);
