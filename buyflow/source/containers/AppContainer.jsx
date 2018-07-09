import React, { Component, PropTypes } from 'react';

class AppContainer extends Component {
  render() {
    const {
      children
    } = this.props;

    return (
        <div>
          {children}
        </div>
    );
  }
}

AppContainer.propTypes = {
  children: PropTypes.node
};

export default AppContainer;
