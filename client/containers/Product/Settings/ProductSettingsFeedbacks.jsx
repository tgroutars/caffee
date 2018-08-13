import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Button, message } from 'antd';
import trim from 'lodash/trim';
import styled from 'styled-components';

import { currentProductSelector } from '../../../selectors/product';
import { saveQuestions } from '../../../actions/product';

const { TextArea } = Input;

const questionsPlaceholder = `How would you like this new feature to work?
Why is this feature important to you?
`;

const WhiteSpace = styled.div`
  height: 16px;
`;

const StyledTextArea = styled(TextArea)`
  &.ant-input {
    max-width: 700px;
  }
`;

const computeInputQuestions = (questions = []) => questions.join('\n');

class ProductSettingsFeedbacks extends React.Component {
  static propTypes = {
    product: PropTypes.shape({
      questions: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
    saveQuestions: PropTypes.func.isRequired,
  };

  state = { questions: computeInputQuestions(this.props.product.questions) };

  handleSave = async () => {
    const { product } = this.props;
    const questions = this.state.questions
      .split('\n')
      .map(q => trim(q))
      .filter(q => q);

    await this.props.saveQuestions(product.id, questions);
    message.success('Feedback form saved', 1);
  };

  handleQuestionsChange = evt => {
    this.setState({ questions: evt.target.value });
  };

  render() {
    const { product } = this.props;
    const { questions } = this.state;
    return (
      <div>
        <h1>Feedback form</h1>
        <p>
          Customize the questions you ask when someone submits a new feedback on{' '}
          {product.name}. Add one question per line.
        </p>
        <StyledTextArea
          value={questions}
          onChange={this.handleQuestionsChange}
          placeholder={questionsPlaceholder}
          autosize={{ minRows: 3, maxRows: 20 }}
        />
        <WhiteSpace />
        <Button type="primary" onClick={this.handleSave}>
          Save
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: currentProductSelector(state),
});

const mapDispatchToProps = {
  saveQuestions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductSettingsFeedbacks);
