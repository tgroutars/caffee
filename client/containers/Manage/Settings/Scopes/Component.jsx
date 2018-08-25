import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Menu, Icon, Popconfirm, Avatar } from 'antd';

import Clickable from '../../../../components/Clickable';
import Editable from '../../../../components/Editable';

const ScopeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: ${({ level }) => level * 48};
  padding: 8px;
  border-left: 4px solid rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;
const AddScope = styled(ScopeInfo)`
  cursor: pointer;
  border: none;
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const ArchiveIcon = styled(Icon)`
  visibility: hidden;
  ${ScopeInfo}:hover & {
    visibility: visible;
  }
  margin-left: 32px;
  font-size: 16px;
  color: #f5222d;
  cursor: pointer;
`;

const Scopes = ({ scopes, level, onSave, onArchive }) => (
  <div level={level}>
    {scopes.map(scope => (
      <Scopes.Item
        level={level}
        key={scope.id || scope.cid}
        scope={scope}
        onSave={onSave}
        onArchive={onArchive}
      />
    ))}
  </div>
);
Scopes.propTypes = {
  scopes: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  level: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
};
Scopes.defaultProps = {
  level: 0,
};

class ScopeItem extends React.Component {
  static propTypes = {
    scope: PropTypes.shape({}).isRequired,
    level: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
  };

  state = { isCreating: false };

  handleSave = async name => {
    const { scope } = this.props;
    await this.props.onSave(scope, name);
  };

  handleClickAdd = () => {
    this.setState({ isCreating: true });
  };

  handleStopCreate = () => {
    const { scope } = this.props;
    if (!scope.id) {
      this.setState({ isCreating: false });
    }
  };

  archive = () => {
    this.props.onArchive(this.props.scope);
  };

  renderActions() {
    const { scope } = this.props;
    const isNew = !scope.id;
    if (isNew) {
      return null;
    }
    return (
      <Actions>
        {scope.responsible ? (
          <div>
            Responsible:
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">
                    {/* TODO: Set responsible */}
                    <Avatar size="small" src={scope.responsible.image} />{' '}
                    {scope.responsible.name}
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Clickable>
                {scope.responsible.name} <Icon type="down" />
              </Clickable>
            </Dropdown>
          </div>
        ) : null}
        {!isNew ? (
          <Popconfirm
            title="Delete this scope?"
            onConfirm={this.archive}
            okText="Yes"
            cancelText="No"
          >
            <ArchiveIcon type="delete" />
          </Popconfirm>
        ) : null}
      </Actions>
    );
  }

  render() {
    const { scope, level } = this.props;
    const { isCreating } = this.state;
    const isNew = !scope.id;
    if (isNew && !isCreating) {
      return (
        <AddScope level={level} onClick={this.handleClickAdd}>
          <Clickable>+ Add scope</Clickable>
        </AddScope>
      );
    }

    return (
      // TODO: Use fragments <></> (need babel 7)
      <div>
        <ScopeInfo level={level}>
          <Editable
            autofocus={isNew}
            onReset={this.handleStopCreate}
            value={scope.name}
            onSave={this.handleSave}
          />
          {this.renderActions()}
        </ScopeInfo>
        <Scopes
          onSave={this.props.onSave}
          onArchive={this.props.onArchive}
          scopes={scope.subscopes}
          level={level + 1}
        />
      </div>
    );
  }
}

Scopes.Item = ScopeItem;

export default Scopes;
