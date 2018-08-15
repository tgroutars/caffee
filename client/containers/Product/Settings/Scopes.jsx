import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Menu, Icon } from 'antd';

import Clickable from '../../../components/Clickable';
import Editable from '../../../components/Editable';

const ScopeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: ${({ level }) => level * 24};
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

const Scopes = ({ scopes, level, onChangeName }) => (
  <div level={level}>
    {scopes.map(scope => (
      <Scopes.Item
        level={level}
        key={scope.id}
        scope={scope}
        onChangeName={onChangeName}
      />
    ))}
  </div>
);
Scopes.propTypes = {
  scopes: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  level: PropTypes.number,
  onChangeName: PropTypes.func.isRequired,
};
Scopes.defaultProps = {
  level: 0,
};

class ScopeItem extends React.Component {
  static propTypes = {
    scope: PropTypes.shape({}).isRequired,
    level: PropTypes.number.isRequired,
    onChangeName: PropTypes.func.isRequired,
  };

  handleSaveName = async value => {
    const { scope } = this.props;
    await this.props.onChangeName(scope.id, value);
  };

  render() {
    const { scope, level } = this.props;
    const isNew = !scope.id;
    if (isNew) {
      return (
        <AddScope level={level}>
          <Clickable>+ Add</Clickable>
        </AddScope>
      );
    }
    return (
      // TODO: Use fragments <></> (need babel 7)
      <div>
        <ScopeInfo key={scope.id} level={level}>
          <Editable value={scope.name} onSave={this.handleSaveName} />
          {scope.responsible ? (
            <div>
              Responsible:
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">
                      <Icon type="user" />TODO: Show list of users
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
        </ScopeInfo>
        <Scopes
          onChangeName={this.props.onChangeName}
          scopes={scope.subscopes}
          level={level + 1}
        />
      </div>
    );
  }
}

Scopes.Item = ScopeItem;

export default Scopes;
