import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  fetchScopes,
  saveName,
  createScope,
  archiveScope,
  setResponsible,
} from '../../../../actions/scopes';
import { listProductUsers } from '../../../../actions/productUsers';
import { scopesTreeSelector } from '../../../../selectors/scope';
import { pmsSelector } from '../../../../selectors/user';
import ScopesComponent from './Component';

const ScopesWrapper = styled.div`
  max-width: 700px;
  padding-left: 16px;
  margin-top: 16px;
`;

class Scopes extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    setResponsible: PropTypes.func.isRequired,
    fetchScopes: PropTypes.func.isRequired,
    createScope: PropTypes.func.isRequired,
    archiveScope: PropTypes.func.isRequired,
    saveName: PropTypes.func.isRequired,
    listProductUsers: PropTypes.func.isRequired,
    scopesTree: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    pms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.fetchScopes(productId);
    await this.props.listProductUsers(productId);
  }

  setResponsible = async (scopeId, userId) => {
    await this.props.setResponsible(scopeId, userId);
  };

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
    await this.props.archiveScope(scope);
  };

  render() {
    const { scopesTree, pms } = this.props;

    return (
      <div>
        <h1>Scopes</h1>
        <p>
          Customize the scopes of your product to classify feedback and assign
          it to the right PM
        </p>
        <ScopesWrapper>
          <ScopesComponent
            pms={pms}
            scopes={scopesTree}
            onSave={this.handleSave}
            onArchive={this.handleArchive}
            setResponsible={this.setResponsible}
          />
        </ScopesWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  productId: state.product.productId,
  scopesTree: scopesTreeSelector(state),
  pms: pmsSelector(state),
});

const mapDispatchToProps = {
  fetchScopes,
  saveName,
  createScope,
  archiveScope,
  listProductUsers,
  setResponsible,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scopes);
