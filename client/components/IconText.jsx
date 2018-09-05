import React from 'react';
import styled from 'styled-components';
import { Icon as AntIcon } from 'antd';
import PropTypes from 'prop-types';

const Icon = styled(AntIcon)`
  margin-right: 8px;
`;

const IconText = ({ type, text, className }) => (
  <span className={className}>
    <Icon type={type} />
    {text}
  </span>
);

IconText.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

IconText.defaultProps = {
  text: '',
  className: '',
};

export default IconText;
