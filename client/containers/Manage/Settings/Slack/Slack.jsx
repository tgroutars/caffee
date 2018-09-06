import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Avatar } from 'antd';
import styled from 'styled-components';

import ChannelSelect from './ChannelSelect';
import { listSlackInstalls } from '../../../../actions/slackInstalls';
import { currentProductIdSelector } from '../../../../selectors/product';
import { slackInstallsSelector } from '../../../../selectors/slackInstall';

const InstallsList = styled(List)`
  max-width: 800px;
  .ant-list-item-meta-title {
    font-size: 24px;
    line-height: 32px;
  }
`;

class Slack extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    slackInstalls: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    listSlackInstalls: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.listSlackInstalls(productId);
  }

  renderSlackInstall = slackInstall => (
    <List.Item actions={[<ChannelSelect slackInstall={slackInstall} />]}>
      <List.Item.Meta
        avatar={<Avatar size={32} shape="square" src={slackInstall.image} />}
        title={slackInstall.name}
      />
    </List.Item>
  );

  render() {
    const { slackInstalls } = this.props;
    return (
      <div>
        <h1>Slack</h1>
        <p>Configure the Slack integration</p>
        <h2>Your workspace</h2>
        <InstallsList
          dataSource={slackInstalls}
          renderItem={this.renderSlackInstall}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
  slackInstalls: slackInstallsSelector(state),
});
const mapDispatchToProps = {
  listSlackInstalls,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Slack);
