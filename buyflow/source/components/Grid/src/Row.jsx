import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Row extends Component {

  render() {
    const classes = 'row';

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

Row.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Row;
