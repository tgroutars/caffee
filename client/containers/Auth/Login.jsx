import React from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Icon, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import api, { APIError } from '../../actions/api';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`;
const LoginWindow = styled(Card)``;
const EmailInput = styled(Input)`
  .ant-input {
    min-height: initial;
  }
`;
const FormSeparator = styled.div`
  width: 100%;
  height: 16px;
`;
const Submit = styled(Button)`
  width: 100%;
`;
const Bold = styled.span`
  font-weight: bold;
`;
const Success = styled.div`
  text-align: left;
`;
const Title = styled.h1``;

const getErrorMessage = err => {
  if (!(err instanceof APIError)) {
    return 'Something went wrong 🙊';
  }
  switch (err.error) {
    case 'invalid_email':
      return 'Please enter a valid email address';
    case 'user_not_found':
      return 'We could not find a user linked to this email address';
    default:
      return 'Something went wrong 🙊';
  }
};

class Login extends React.Component {
  static propTypes = {
    sendPasswordlessLink: PropTypes.func.isRequired,
  };

  state = { email: '', isWaiting: false, success: false };

  handleEmailChange = evt => {
    const email = evt.target.value;
    this.setState({ email });
  };

  handleSubmit = async () => {
    const { email, isWaiting } = this.state;
    if (isWaiting) {
      return;
    }
    if (!email) {
      message.error('Please enter your email');
    }
    this.setState({ isWaiting: true });
    try {
      await this.props.sendPasswordlessLink({ email });
      this.setState({ isWaiting: false, success: true });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      message.error(errorMessage);
      this.setState({ isWaiting: false });
    }
  };

  renderLoginWindow = () => {
    const { email, isWaiting, success } = this.state;
    if (success) {
      return (
        <Success>
          <Title>Check your email!</Title>
          <p>
            Login by clicking the magic link we sent to <Bold>{email}</Bold>
          </p>
        </Success>
      );
    }
    return (
      <LoginWindow title="Caffee login">
        <EmailInput
          autoComplete="email"
          value={email}
          onPressEnter={this.handleSubmit}
          onChange={this.handleEmailChange}
          prefix={<Icon type="mail" />}
          placeholder="Your email"
          type="email"
          disabled={isWaiting}
        />
        <FormSeparator />
        <Submit disabled={isWaiting} onClick={this.handleSubmit} type="primary">
          Get magic link
        </Submit>
      </LoginWindow>
    );
  };

  render() {
    return <Container>{this.renderLoginWindow()}</Container>;
  }
}

const mapDispatchToProps = {
  sendPasswordlessLink: api.auth.sendPasswordlessLink,
};

export default connect(
  null,
  mapDispatchToProps,
)(Login);
