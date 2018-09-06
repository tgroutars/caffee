import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Avatar, Select, Icon, Popconfirm } from 'antd';
import styled from 'styled-components';

import { listProductUsers, removeUser } from '../../../../actions/productUsers';
import {
  productUsersSelector,
  authedUserIdSelector,
} from '../../../../selectors/user';
import { currentProductIdSelector } from '../../../../selectors/product';
import AddUser from './AddUser';

const ListContainer = styled.div`
  max-width: 700px;
`;

class Users extends React.Component {
  static propTypes = {
    listProductUsers: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    productId: PropTypes.string.isRequired,
    authedUserId: PropTypes.string.isRequired,
  };

  state = { isLoading: true };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.listProductUsers(productId);
    this.setState({ isLoading: false });
  }

  handleRoleChange = async () => {
    // TODO
  };

  removeUser = async userId => {
    const { productId } = this.props;
    await this.props.removeUser(productId, userId);
  };

  renderUserItem = user => {
    const { authedUserId } = this.props;
    const isAuthedUser = user.id === authedUserId;
    const actions = [
      <Select
        value={user.role}
        onChange={role => this.handleRoleChange(user, role)}
        disabled={isAuthedUser}
      >
        <Select.Option value="author">Author</Select.Option>
        <Select.Option value="user">PM</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>,
    ];
    if (!isAuthedUser) {
      actions.push(
        <Popconfirm
          title="Remove this user?"
          onConfirm={() => this.removeUser(user.id)}
          okText="Yes"
          cancelText="No"
        >
          <Icon type="delete" />
        </Popconfirm>,
      );
    }
    return (
      <List.Item actions={actions}>
        <List.Item.Meta
          avatar={
            user.image ? <Avatar src={user.image} /> : <Avatar icon="user" />
          }
          title={user.name}
        />
      </List.Item>
    );
  };

  render() {
    const { users, productId } = this.props;
    const { isLoading } = this.state;
    return (
      <div>
        <h1>Users &amp; permissions</h1>
        <p>
          Configure who can report a feedback on your product, and who can edit
          the roadmap
        </p>
        <AddUser productId={productId} />
        <ListContainer>
          <List
            loading={isLoading}
            dataSource={users}
            renderItem={this.renderUserItem}
          />
        </ListContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  productId: currentProductIdSelector(state),
  users: productUsersSelector(state),
  authedUserId: authedUserIdSelector(state),
});
const mapDispatchToProps = {
  listProductUsers,
  removeUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Users);
