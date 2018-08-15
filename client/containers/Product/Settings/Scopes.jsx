import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Menu, Icon } from 'antd';

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
const Clickable = styled.div`
  cursor: pointer;
  color: #1890ff;
  user-select: none;
`;
const AddScope = styled(ScopeInfo)`
  cursor: pointer;
  border: none;
`;

const Scopes = ({ scopes, level }) => (
  <div level={level}>
    {scopes.map(scope => (
      <Scopes.Item level={level} key={scope.id} scope={scope} />
    ))}
    {level < 2 ? (
      <AddScope level={level}>
        <Clickable>+ Add</Clickable>
      </AddScope>
    ) : null}
  </div>
);
Scopes.propTypes = {
  scopes: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  level: PropTypes.number,
};
Scopes.defaultProps = {
  level: 0,
};

Scopes.Item = ({ scope, level }) => {
  const DropdownMenu = (
    <Menu>
      <Menu.Item key="1">
        <Icon type="user" />TODO: Show list of users
      </Menu.Item>
    </Menu>
  );
  return (
    // TODO: Use fragments <></> (need babel 7)
    <div>
      <ScopeInfo key={scope.id} level={level}>
        <div>{scope.name}</div>
        <div>
          Responsible:
          <Dropdown overlay={DropdownMenu} trigger={['click']}>
            <Clickable>
              {scope.responsible.name} <Icon type="down" />
            </Clickable>
          </Dropdown>
        </div>
      </ScopeInfo>
      <Scopes scopes={scope.subscopes} level={level + 1} />
    </div>
  );
};
Scopes.Item.propTypes = {
  scope: PropTypes.shape({}).isRequired,
  level: PropTypes.number.isRequired,
};

export default Scopes;
