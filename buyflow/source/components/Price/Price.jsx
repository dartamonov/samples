import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

class SimplePrice extends Component {

  render() {
    const {
      price,
    } = this.props;

    //if (_.isEmpty(price)) return null;

    const dollarsCents = (price > 0) ? _.words(price.toString(10), /[^.]+/g) : ['0', '00'];
    const dollars = dollarsCents[0];
    const cents = _.size(dollarsCents[1]) === 1 ? `.${dollarsCents[1]}0` : `.${dollarsCents[1]}`.substring(0, 3);

    return (
      <span className="hg-price">
        <span className="hg-price__icon">$</span>
        <span className="hg-price__dollars">{dollars}</span>
        <span className="hg-price__cents">{cents}</span>
        <span>/mo</span>
      </span>
    );

  }
}

SimplePrice.propTypes = {
  price: PropTypes.number
};

SimplePrice.defaultProps = {
  price: 0
};

export default SimplePrice;
