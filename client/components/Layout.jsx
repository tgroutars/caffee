import { Layout as AntLayoutComponent } from 'antd';
import styled from 'styled-components';

const Layout = styled(AntLayoutComponent)`
  height: 100vh;
`;
export const Header = styled(AntLayoutComponent.Header)`
  background: #fff;
`;
export const Content = styled(AntLayoutComponent.Content)`
  background: #fff;
`;

export default Layout;
