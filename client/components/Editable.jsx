import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Spin } from 'antd';

const Wrapper = styled.div``;

const StyledInput = styled(Input)`
  && {
    border-color: rgba(0, 0, 0, 0) !important;
    box-shadow: none;
    background: rgba(0, 0, 0, 0);
    width: 200px;
    &:hover,
    &:focus {
      border-color: #d9d9d9 !important;
      background: white;
      border-width: 1px !important;
    }
  }
`;
const StyledSpin = styled(Spin)`
  margin-left: 5px;
`;

class Editable extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    required: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    required: true,
  };

  state = { value: this.props.value, isSaving: false };

  isDirty = () => this.state.value !== this.props.value;

  save = async () => {
    const { value } = this.state;

    this.setState({ isSaving: true });
    await this.props.onSave(value);
    this.setState({ isSaving: false });
  };

  handleBlur = evt => {
    evt.target.blur();
    const { value } = this.state;
    const { required } = this.props;
    if (value === this.props.value) {
      return;
    }
    if (required && !value) {
      this.setState({ value: this.props.value });
      return;
    }
    this.save();
  };

  handleChange = evt => {
    this.setState({ value: evt.target.value });
  };

  render() {
    const { value, isSaving } = this.state;
    return (
      <Wrapper>
        <StyledInput
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onPressEnter={this.handleBlur}
        />
        {isSaving ? <StyledSpin /> : null}
      </Wrapper>
    );
  }
}

export default Editable;
