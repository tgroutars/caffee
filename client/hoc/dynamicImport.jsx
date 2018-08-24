import React from 'react';

import Loading from '../components/Loading';

export default loadComponent =>
  class extends React.Component {
    state = { Component: null };

    async componentDidMount() {
      const Component = (await loadComponent()).default;
      this.setState({ Component });
    }

    render() {
      const { Component } = this.state;
      if (!Component) {
        return <Loading />;
      }
      return <Component {...this.props} />;
    }
  };
