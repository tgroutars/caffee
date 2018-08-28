import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Avatar, List } from 'antd';

import { listProducts } from '../../actions/products';
import { productsSelector } from '../../selectors/product';
import { authedUserSelector } from '../../selectors/user';

const Layout = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 100px auto 100px;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  line-height: 100px;
  font-size: 32px;
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: auto 300px auto;
`;
const ProductList = styled(List)`
  grid-column-start: 2;
`;
const ProductListItem = styled(List.Item)``;
const Product = styled(List.Item.Meta)`
  .ant-list-item-meta-title {
    font-size: 24px;
  }
`;
const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 30px;
`;

class Home extends React.Component {
  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    listProducts: PropTypes.func.isRequired,
    user: PropTypes.shape({}).isRequired,
  };

  state = { isWaiting: true };

  async componentDidMount() {
    await this.props.listProducts();
    this.setState({ isWaiting: false });
  }

  renderProducts = () => {
    const { isWaiting } = this.state;
    const products = isWaiting ? [null] : this.props.products;
    return (
      <ProductList
        bordered
        size="large"
        itemLayout="vertical"
        dataSource={products}
        renderItem={product => {
          if (!product) {
            return (
              <ProductListItem
                extra={<Avatar shape="square" size={60} src="" />}
              >
                <Product title="-" />
              </ProductListItem>
            );
          }
          return (
            <ProductListItem
              extra={<Avatar shape="square" size={60} src={product.image} />}
            >
              <Product
                title={
                  <Link to={`/manage/${product.id}/inbox/unprocessed`}>
                    {product.name}
                  </Link>
                }
              />
            </ProductListItem>
          );
        }}
      />
    );
  };

  render() {
    const { user } = this.props;
    return (
      <Layout>
        <Header>Select a product</Header>
        <Content>{this.renderProducts()}</Content>
        <Footer>
          <pre>
            Connected as {user.name}. Not you?
            <Link to="/logout"> Sign out</Link>
          </pre>
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  products: productsSelector(state),
  user: authedUserSelector(state),
});

const mapDispatchToProps = {
  listProducts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
