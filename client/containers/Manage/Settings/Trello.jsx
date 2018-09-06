import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select, message, Alert } from 'antd';
import styled from 'styled-components';

import { currentProductSelector } from '../../../selectors/product';
import { listTrelloBoards, setTrelloBoard } from '../../../actions/products';

const BoardSelect = styled(Select)`
  width: 200px;
  margin-left: 10px;
`;
const Warning = styled(Alert)`
  margin-bottom: 24px;
  max-width: 800px;
`;

class Trello extends React.Component {
  static propTypes = {
    product: PropTypes.shape({}).isRequired,
    listTrelloBoards: PropTypes.func.isRequired,
    setTrelloBoard: PropTypes.func.isRequired,
  };

  state = { isLoading: true, boards: [] };

  async componentDidMount() {
    const { product } = this.props;
    const boards = await this.props.listTrelloBoards(product.id);
    this.setState({ boards, isLoading: false });
  }

  handleSelect = async boardId => {
    const { product } = this.props;
    await this.props.setTrelloBoard(product.id, boardId);
    message.success('Trello board changed');
  };

  renderSelect() {
    const { boards, isLoading } = this.state;
    const { product } = this.props;
    if (isLoading) {
      return null;
    }
    return (
      <div>
        Trello board:
        <BoardSelect
          disabled={isLoading}
          value={product.trelloBoardId}
          onSelect={this.handleSelect}
        >
          {boards.map(board => (
            <Select.Option value={board.id} key={board.id}>
              {board.name}
            </Select.Option>
          ))}
        </BoardSelect>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Trello</h1>
        <p>Configure the Trello integration</p>
        <Warning
          message="Change this with caution"
          description="This will remove all your roadmap items and all feedbacks already associated to those items"
          type="warning"
          showIcon
        />
        {this.renderSelect()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: currentProductSelector(state),
});
const mapDispatchToProps = {
  listTrelloBoards,
  setTrelloBoard,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Trello);
