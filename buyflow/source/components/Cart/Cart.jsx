import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Price from '../Price/Price.jsx';

class Cart extends Component {
  render() {
    if (_.isEmpty(this.props.cart)) {
      return null;
    }

    const {
      continueAction,
      cart
    } = this.props;
    const valid = cart.monthlyTotal > 0;
    const nextBtnClass = {
      'x-button--solid' : valid !== false,
      'x-button--disabled' : valid === false
    };

    return (
      <div className="hg-cart">
        <div className="hg-cart__panel">
          <div className="hg-cart__panel-content">
            <h2 className="hg-cart__panel-title x-heading3">Monthly Total</h2>
          </div>
          <div className="hg-cart__panel-content">
            <Price price={cart.monthlyTotal} />
          </div>
        </div>
        <div className="hg-cart__panel">
          <button type="button" className={classNames(nextBtnClass)} onClick={continueAction}>Review</button>
        </div>
      </div>
    );
  }

}

Cart.propTypes = {
  continueAction: PropTypes.func,
  cart: PropTypes.object.isRequired
};

export default Cart;
