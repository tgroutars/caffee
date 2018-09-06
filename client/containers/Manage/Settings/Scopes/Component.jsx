import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon, Popconfirm } from 'antd';

import Clickable from '../../../../components/Clickable';
import Editable from '../../../../components/Editable';

const SelectUser = styled(Select)`
  margin-left: 6px;
`;

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
  cursor: pointer;
`;

const Scopes = ({ scopes, level, onSave, onArchive, pms, setResponsible }) => (
  <div level={level}>
    {scopes.map(scope => (
      <Scopes.Item
        level={level}
        key={scope.id || scope.cid}
        scope={scope}
        onSave={onSave}
        onArchive={onArchive}
        pms={pms}
        setResponsible={setResponsible}
      />
    ))}
  </div>
);
Scopes.propTypes = {
  scopes: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  level: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  setResponsible: PropTypes.func.isRequired,
  pms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
    setResponsible: PropTypes.func.isRequired,
    pms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

  handleSelectResponsible = userId => {
    const { scope } = this.props;
    this.props.setResponsible(scope.id, userId);
  };

  renderActions() {
    const { scope, pms } = this.props;
    const isNew = !scope.id;
    if (isNew) {
      return null;
    }
    return (
      <Actions>
        {pms && pms.length ? (
          <div>
            Responsible:
            <SelectUser
              value={scope.responsible.id}
              onSelect={this.handleSelectResponsible}
            >
              {pms.map(pm => (
                <Select.Option value={pm.id} key={pm.id}>
                  {pm.name}
                </Select.Option>
              ))}
            </SelectUser>
          </div>
        ) : null}

        {!isNew ? (
          <Popconfirm
            title="Delete this scope?"
            onConfirm={this.archive}
            okText="Yes"
            cancelText="No"
          >
            <ArchiveIcon type="delete" theme="twoTone" twoToneColor="#f5222d" />
          </Popconfirm>
        ) : null}
      </Actions>
    );
  }

  render() {
    const { scope, level, pms, setResponsible } = this.props;
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
          pms={pms}
          setResponsible={setResponsible}
        />
      </div>
    );
  }
}

Scopes.Item = ScopeItem;

export default Scopes;
