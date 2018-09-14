import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import Nav from './Nav';
import UpdatesList from './UpdatesList';
import { listActivities } from '../../../actions/activities';
import { currentProductIdSelector } from '../../../selectors/product';
import { currentFilterSelector } from '../../../selectors/activity';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  background: #fff;
  max-height: 100%;
`;
const StyledContent = styled(Content)`
  background: #fff;
  background: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  overflow-x: scroll !important;
  overflow-y: hidden !important;
`;
const ListContainer = styled.div`
  padding: 24px;
  overflow-y: scroll;
`;

// TODO: extract layout in component
class Updates extends React.Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    listActivities: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.listActivities(productId);
  }

  async componentDidUpdate(prevProps) {
    const { productId, filter } = this.props;
    if (productId !== prevProps.productId || filter !== prevProps.filter)
      await this.props.listActivities(productId);
  }

  render() {
    return (
      <StyledLayout>
        <Nav />
        <StyledContent>
          <ListContainer>
            <h1>Updates</h1>
            <UpdatesList />
          </ListContainer>
        </StyledContent>
      </StyledLayout>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
  filter: currentFilterSelector(state),
});

const mapDispatchToProps = {
  listActivities,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Updates);
