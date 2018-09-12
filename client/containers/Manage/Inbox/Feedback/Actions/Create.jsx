import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Input as AntInput,
  Popover as AntPopover,
  Select as AntSelect,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setNewRoadmapItem } from '../../../../../actions/feedbacks';
import { currentProductIdSelector } from '../../../../../selectors/product';
import { roadmapStagesSelector } from '../../../../../selectors/roadmapStage';
import { tagsSelector } from '../../../../../selectors/tag';

const ActionButton = styled(Button)`
  width: 100%;
  .ant-btn {
    width: 100%;
  }
`;
const Popover = styled(AntPopover)``;
const PopoverContentWrapper = styled.div`
  max-width: 300px;
`;
const Input = styled(AntInput)`
  margin-bottom: 10px;
`;
const TextArea = styled(AntInput.TextArea)`
  margin-bottom: 10px;
`;
const Select = styled(AntSelect)`
  width: 100%;
  margin-bottom: 10px;
`;

class Create extends React.Component {
  static propTypes = {
    setNewRoadmapItem: PropTypes.func.isRequired,
    roadmapStages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    feedback: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    title: '',
    description: '',
    stageId: undefined,
    tagIds: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.feedback.id !== prevProps.feedback.id) {
      this.setState({
        title: '',
        description: '',
        stageId: undefined,
        tagIds: [],
      });
    }
  }

  handleTitleChange = evt => {
    this.setState({ title: evt.target.value });
  };

  handleDescriptionChange = evt => {
    this.setState({ description: evt.target.value });
  };

  handleStageChange = stageId => {
    this.setState({ stageId });
  };

  handleTagSelect = tagId => {
    this.setState({ tagIds: [...this.state.tagIds, tagId] });
  };

  handleTagDeselect = tagId => {
    this.setState({ tagIds: this.state.tagIds.filter(tId => tId !== tagId) });
  };

  handleCreate = async () => {
    const { feedback, productId } = this.props;
    const { title, description, stageId, tagIds } = this.state;
    if (!stageId) {
      message.error('List is required');
      return;
    }
    if (!title) {
      message.error('Title is required');
      return;
    }

    await this.props.setNewRoadmapItem(feedback.id, {
      productId,
      title,
      description,
      stageId,
      tagIds,
    });
    message.success('Feedback associated to new roadmap item!');
  };

  renderPopoverContent = () => {
    const { title, description, stageId, tagIds } = this.state;
    const { roadmapStages, tags } = this.props;
    return (
      <PopoverContentWrapper>
        <Select
          required
          onChange={this.handleStageChange}
          placeholder="List"
          getPopupContainer={trigger => trigger.parentNode}
          value={stageId}
        >
          {roadmapStages.map(stage => (
            <Select.Option key={stage.id} value={stage.id}>
              {stage.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          onSelect={this.handleTagSelect}
          onDeselect={this.handleTagDeselect}
          placeholder="Labels"
          getPopupContainer={trigger => trigger.parentNode}
          value={tagIds}
        >
          {tags.map(tag => (
            <Select.Option key={tag.id} value={tag.id}>
              {tag.name}
            </Select.Option>
          ))}
        </Select>
        <Input
          placeholder="Title"
          onChange={this.handleTitleChange}
          value={title}
        />
        <TextArea
          placeholder="Description"
          onChange={this.handleDescriptionChange}
          value={description}
        />
        <Button onClick={this.handleCreate} type="primary">
          Create
        </Button>
      </PopoverContentWrapper>
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
        <ActionButton type="primary">Create roadmap item</ActionButton>
      </Popover>
    );
  }
}

const matchStateToProps = state => ({
  productId: currentProductIdSelector(state),
  roadmapStages: roadmapStagesSelector(state),
  tags: tagsSelector(state),
});
const mapDispatchToProps = { setNewRoadmapItem };

export default connect(
  matchStateToProps,
  mapDispatchToProps,
)(Create);
