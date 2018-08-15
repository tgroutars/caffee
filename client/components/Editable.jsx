import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Spin } from 'antd';

const Wrapper = styled.div``;

const StyledInput = styled(Input.TextArea)`
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
    resize: none;
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
    onReset: PropTypes.func,
    autofocus: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    required: true,
    onReset: () => {},
    autofocus: false,
  };

  state = { value: this.props.value, isSaving: false };

  componentDidMount() {
    this._isMounted = true;
    if (this.input && this.props.autofocus) {
      this.input.current.focus();
    }
  }

  comonentWillUnmount() {
    this.cancelled = true;
  }

  input = React.createRef();

  isDirty = () => this.state.value !== this.props.value;

  save = async () => {
    const { value } = this.state;
    this.setState({ isSaving: true });
    this.savePromise = this.props.onSave(value);
    if (!this.cancelled) {
      this.setState({ isSaving: false });
    }
  };

  handleBlur = () => {
    const { value } = this.state;
    const { required } = this.props;
    if (required && !value) {
      this.props.onReset();
      this.setState({ value: this.props.value });
      return;
    }
    if (value === this.props.value) {
      return;
    }
    this.save();
  };

  handlePressEnter = evt => {
    evt.target.blur();
  };

  handleChange = evt => {
    this.setState({ value: evt.target.value });
  };

  render() {
    const { isSaving } = this.state;
    const { value } = this.state;
    return (
      <Wrapper>
        <StyledInput
          autosize
          innerRef={this.input}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onPressEnter={this.handlePressEnter}
        />
        {isSaving ? <StyledSpin /> : null}
      </Wrapper>
    );
  }
}

export default Editable;
