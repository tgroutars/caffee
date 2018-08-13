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
  height: 64px;
  padding-left: 24px;
  font-size: 24px;
`;

const Placeholder = styled.div`
  background: rgb(240, 242, 245);
  height: 32px;
  width: 128px;
`;

const ProductName = styled.span`
  margin-left: 16px;
`;

const ProductMenu = ({ product, isWaiting }) => {
  if (isWaiting) {
    return (
      <Container>
        <Placeholder />
      </Container>
    );
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
