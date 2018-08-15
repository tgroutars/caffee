import React from 'react';
import styled from 'styled-components';

const Logo = styled.div`
  position: absolute;
  left: 50%;
  font-size: 32px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
`;

const ProductMenu = () => <Logo>Caffee</Logo>;

export default ProductMenu;
