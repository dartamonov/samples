import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Container extends Component {

  render() {
    const classes = 'container';

    const {
      children,
      className
    } = this.props;

    return (
      <div className={classNames(className, classes)}>
        {children}
      </div>
    );
  }
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Container;
