import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { listFeedbacks } from '../../../actions/feedbacks';
import { currentProductIdSelector } from '../../../selectors/product';
import FeedbacksList from './FeedbacksList';
import Nav from './Nav';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  background: #fff;
`;
const StyledContent = styled(Content)`
  background: #fff;
  background: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: 400px auto;
  grid-template-rows: auto;
  overflow-x: scroll !important;
`;
const FeedbacksListWrapper = styled.div`
  padding: 24px;
`;
const FeedbackWrapper = styled.div`
  padding: 24px;
`;

class Inbox extends React.Component {
  static propTypes = {
    listFeedbacks: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { productId } = this.props;
    this.props.listFeedbacks(productId);
  }

  render() {
    return (
      <StyledLayout>
        <Nav />
        <StyledContent>
          <FeedbacksListWrapper>
            <FeedbacksList />
          </FeedbacksListWrapper>
          <FeedbackWrapper style={{ minWidth: '500px' }}>
            coucou
          </FeedbackWrapper>
        </StyledContent>
      </StyledLayout>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
});

const mapDispatchToProps = {
  listFeedbacks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inbox);
