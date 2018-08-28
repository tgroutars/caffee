import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { listFeedbacks } from '../../../actions/feedbacks';
import { currentProductIdSelector } from '../../../selectors/product';
import { currentInboxSelector } from '../../../selectors/feedback';
import FeedbacksList from './FeedbacksList';
import Nav from './Nav';
import Feedback from './Feedback';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  background: #fff;
`;
const StyledContent = styled(Content)`
  background: #fff;
  background: rgba(0, 0, 0, 0);
  display: grid;
  grid-template-columns: 500px auto;
  grid-template-rows: auto;
  overflow-x: scroll !important;
`;
const FeedbacksListWrapper = styled.div`
  padding: 24px;
`;
const FeedbackWrapper = styled.div`
  padding: 24px;
  min-width: 500px;
`;

class Inbox extends React.Component {
  static propTypes = {
    listFeedbacks: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
  };

  async componentDidMount() {
    const { productId, inbox } = this.props;
    if (inbox) {
      await this.props.listFeedbacks(productId);
    }
  }

  async componentDidUpdate(prevProps) {
    const { productId, inbox } = this.props;
    if (inbox && inbox !== prevProps.inbox) {
      await this.props.listFeedbacks(productId);
    }
  }

  render() {
    return (
      <StyledLayout>
        <Nav />
        <StyledContent>
          <FeedbacksListWrapper>
            <Switch>
              <Redirect
                exact
                from="/manage/:productId/inbox/"
                to="/manage/:productId/inbox/unprocessed"
              />
              <Route
                path="/manage/:productId/inbox/:inbox"
                component={FeedbacksList}
              />
            </Switch>
          </FeedbacksListWrapper>
          <FeedbackWrapper>
            <Route
              path="/manage/:productId/inbox/:inbox/:feedbackId"
              component={Feedback}
            />
          </FeedbackWrapper>
        </StyledContent>
      </StyledLayout>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
  inbox: currentInboxSelector(state),
});

const mapDispatchToProps = {
  listFeedbacks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inbox);
