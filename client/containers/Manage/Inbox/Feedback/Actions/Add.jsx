import React from 'react';
import styled from 'styled-components';
import {
  Button as AntButton,
  Input,
  List as AntList,
  Popover as AntPopover,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import { listRoadmapItems } from '../../../../../actions/roadmapItems';
import { setRoadmapItem } from '../../../../../actions/feedbacks';
import { currentProductIdSelector } from '../../../../../selectors/product';
import { roadmapItemsSelector } from '../../../../../selectors/roadmapItem';

const Button = styled(AntButton)`
  width: 100%;
`;
const List = styled(AntList)`
  max-height: 500px;
  overflow-y: scroll;
  width: 300px;
`;
const ListItem = styled(AntList.Item)`
  padding-left: 16px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .ant-list-item-meta-description {
    white-space: nowrap;
  }
`;
const Popover = styled(AntPopover)``;

const createFuse = roadmapItems =>
  new Fuse(roadmapItems, {
    keys: [
      {
        name: 'title',
        weight: 0.7,
      },
      {
        name: 'description',
        weight: 0.3,
      },
    ],
  });

const searchRoadmapItems = (roadmapItems, query) => {
  const fuse = createFuse(roadmapItems);
  return fuse.search(query);
};

class Add extends React.Component {
  static propTypes = {
    listRoadmapItems: PropTypes.func.isRequired,
    setRoadmapItem: PropTypes.func.isRequired,
    feedback: PropTypes.shape({}).isRequired,
    productId: PropTypes.string.isRequired,
    roadmapItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    isLoading: true,
    searchQuery: '',
  };

  async componentDidMount() {
    const { productId } = this.props;
    await this.props.listRoadmapItems(productId);
    this.setState({ isLoading: false });
  }

  async componentDidUpdate(prevProps) {
    const { productId, feedback } = this.props;

    if (
      productId !== prevProps.productId ||
      feedback.id !== prevProps.feedback.id
    ) {
      this.setState({ isLoading: true, searchQuery: '' });
      await this.props.listRoadmapItems(productId);
      this.setState({ isLoading: false });
    }
  }

  inputRef = React.createRef();

  handleQueryChange = evt => {
    const searchQuery = evt.target.value;
    this.setState({ searchQuery });
  };

  handlePopoverVisibilityChange = isVisible => {
    if (isVisible && this.inputRef.current) {
      setTimeout(() => this.inputRef.current.input.focus());
    }
  };

  handleRoadmapItemClick = async roadmapItem => {
    const { feedback } = this.props;
    await this.props.setRoadmapItem(feedback.id, roadmapItem.id);
    message.success('Feedback added to roadmap item!');
  };

  renderRoadmapItem = roadmapItem => (
    <ListItem
      key={roadmapItem.id}
      onClick={() => this.handleRoadmapItemClick(roadmapItem)}
    >
      {roadmapItem.title}
    </ListItem>
  );

  renderPopoverContent = () => {
    const { isLoading, searchQuery } = this.state;

    const { roadmapItems } = this.props;
    const filteredRoadmapItems = searchRoadmapItems(roadmapItems, searchQuery);

    return (
      <div>
        <Input
          placeholder="Search roadmap items"
          ref={this.inputRef}
          autoFocus
          onChange={this.handleQueryChange}
          value={searchQuery}
        />
        <List
          size="small"
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={filteredRoadmapItems}
          renderItem={this.renderRoadmapItem}
        />
      </div>
    );
  };

  render() {
    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        onVisibleChange={this.handlePopoverVisibilityChange}
        content={this.renderPopoverContent()}
      >
        <Button type="primary">Add to roadmap item</Button>
      </Popover>
    );
  }
}

const matchStateToProps = state => ({
  productId: currentProductIdSelector(state),
  roadmapItems: roadmapItemsSelector(state),
});
const mapDispatchToProps = {
  listRoadmapItems,
  setRoadmapItem,
};

export default connect(
  matchStateToProps,
  mapDispatchToProps,
)(Add);
