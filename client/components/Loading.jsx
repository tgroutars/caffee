import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Item = styled.div`
  flex-basis: auto;
`;

const Loading = () => (
  <Container>
    <Item>
      <Spin size="large" />
    </Item>
  </Container>
);

export default Loading;
