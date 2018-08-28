import React from 'react';
import styled from 'styled-components';
import { Icon as AntIcon } from 'antd';
import PropTypes from 'prop-types';

const Icon = styled(AntIcon)`
  margin-right: 8px;
`;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} />
    {text}
  </span>
);

IconText.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

IconText.defaultProps = {
  text: '',
};

export default IconText;
