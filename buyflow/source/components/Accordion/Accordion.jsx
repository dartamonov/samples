import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Accordion extends Component {

  animate(e) {
    e.preventDefault();
    $(this.refs.accordion).find('.accordion__body').slideToggle( "slow", function() {
      // animation complete
    });
  }

  render() {
    const {
      active = false,
      children,
      className
    } = this.props;

    return (
      <div ref="accordion" className={classNames(className, 'accordion', { 'is-active': active })} aria-expanded={active}>
        {children}
      </div>
    );
  }
}

Accordion.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.object,
  className: PropTypes.string
};

export default Accordion;
