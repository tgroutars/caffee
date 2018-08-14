import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Avatar } from 'antd';

import { currentProductSelector } from '../selectors/product';

const Container = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 0;
  height: 48px;
  margin-left: 24px;
  margin-top: 8px;
  font-size: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 7px;
  padding-right: 16px;
  user-select: none;
`;

const Placeholder = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 0;
  height: 48px;
  width: 128px;
  margin-left: 24px;
  margin-top: 8px;
  font-size: 20px;
  border-radius: 4px;
  background: rgb(240, 242, 245);
`;

const ProductName = styled.span`
  margin-left: 16px;
`;

const ProductMenu = ({ product, isWaiting }) => {
  if (isWaiting) {
    return <Placeholder />;
  }
  return (
    <Container>
      <Avatar src={product.image} shape="square" />
      <ProductName>{product.name}</ProductName>
    </Container>
  );
};

ProductMenu.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
  isWaiting: PropTypes.bool.isRequired,
};

ProductMenu.defaultProps = {
  product: null,
};

const mapStateToProps = state => ({
  product: currentProductSelector(state),
  isWaiting: state.product.isWaiting,
});

export default connect(mapStateToProps)(ProductMenu);
