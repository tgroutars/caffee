import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Avatar } from 'antd';

import { authedUserSelector } from '../selectors/user';

const Container = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  right: 0;
  height: 64px;
  width: 64px;
`;

const UserMenu = ({ user }) => {
  const avatar = user ? <Avatar src={user.image} /> : <Avatar icon="user" />;
  return <Container>{avatar}</Container>;
};

UserMenu.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
};

UserMenu.defaultProps = {
  user: null,
};

const mapStateToProps = state => ({
  user: authedUserSelector(state),
});

export default connect(mapStateToProps)(UserMenu);
