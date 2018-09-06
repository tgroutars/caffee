import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select as AntSelect, message } from 'antd';
import styled from 'styled-components';

import { listChannels, setChannel } from '../../../../actions/slackInstalls';

const Select = styled(AntSelect)`
  margin-left: 6px;
  width: 200px;
`;

class ChannelSelect extends React.Component {
  static propTypes = {
    slackInstall: PropTypes.shape({}).isRequired,
    listChannels: PropTypes.func.isRequired,
    setChannel: PropTypes.func.isRequired,
  };

  state = { channels: [], isLoading: true };

  async componentDidMount() {
    const { slackInstall } = this.props;
    const channels = await this.props.listChannels(slackInstall.id);
    this.setState({
      channels: channels.sort((c1, c2) => (c1.name > c2.name ? 1 : -1)),
      isLoading: false,
    });
  }

  handleSelect = async channel => {
    const { slackInstall } = this.props;
    await this.props.setChannel(slackInstall.id, channel);
    message.success('Slack channel updated');
  };

  render() {
    const { slackInstall } = this.props;
    const { channels, isLoading } = this.state;
    if (isLoading) {
      return null;
    }
    return (
      <div>
        Post updates in:
        <Select value={slackInstall.channel} onSelect={this.handleSelect}>
          {channels.map(channel => (
            <Select.Option key={channel.id} value={channel.id}>
              #{channel.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }
}

const mapDispatchToProps = {
  listChannels,
  setChannel,
};

export default connect(
  null,
  mapDispatchToProps,
)(ChannelSelect);
