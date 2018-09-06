import React from 'react';
import { connect } from 'react-redux';
import { Select as AntSelect, Avatar as AntAvatar } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getSuggestedUsers, addUser } from '../../../../actions/productUsers';

const Select = styled(AntSelect)`
  min-width: 300px;
`;
const Avatar = styled(AntAvatar)`
  margin-right: 6px;
`;

class AddUser extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    getSuggestedUsers: PropTypes.func.isRequired,
    addUser: PropTypes.func.isRequired,
  };

  state = {
    users: [],
    isLoading: false,
  };

  async componentDidMount() {
    await this.reloadSuggestions();
    this.setState({ isLoading: false });
  }

  reloadSuggestions = async () => {
    const { productId } = this.props;
    const users = await this.props.getSuggestedUsers(productId);
    this.setState({ users });
  };

  handleSelect = async userId => {
    const { productId } = this.props;
    this.setState({ isLoading: true });
    await this.props.addUser(productId, userId);
    await this.reloadSuggestions();
    this.setState({ isLoading: false });
  };

  handleFocus = async () => {
    this.setState({ isLoading: true });
    await this.reloadSuggestions();
    this.setState({ isLoading: false });
  };

  render() {
    const { users, isLoading } = this.state;
    return (
      <Select
        placeholder="Add a user"
        showSearch
        showArrow={false}
        value={undefined}
        disabled={isLoading}
        onSelect={this.handleSelect}
        optionFilterProp="title"
        onFocus={this.handleFocus}
      >
        {users.map(user => (
          <Select.Option key={user.id} title={user.name}>
            <Avatar src={user.image} size="small" />
            {user.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

const mapDispatchToProps = {
  getSuggestedUsers,
  addUser,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddUser);
